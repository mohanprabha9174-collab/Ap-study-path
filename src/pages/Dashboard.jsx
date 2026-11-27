import { useEffect, useState } from "react";
import { CodeView } from "../components/ExamTools.jsx";
import { courses, courseList } from "../data/courses.js";
import { api, getToken, setToken } from "../lib/api.js";
import { navigate, useApp } from "../App.jsx";

export default function Dashboard() {
  const { user, store, backend, signOut } = useApp();
  const [attempts, setAttempts] = useState(null);
  const [frqs, setFrqs] = useState([]);

  useEffect(() => {
    const valid = (list) => (Array.isArray(list) ? list : []).filter((a) =>
      a && Number(a.total) > 0 && Number.isFinite(Number(a.score)) && Number(a.score) <= Number(a.total)
      && !Number.isNaN(new Date(a.createdAt).getTime()))
      .map((a) => ({
        ...a,
        // Skip damaged unit rows so one bad save can't break this page.
        unitBreakdown: Object.fromEntries(Object.entries(a.unitBreakdown && typeof a.unitBreakdown === "object" ? a.unitBreakdown : {})
          .filter(([, u]) => u && typeof u === "object" && Number(u.total) > 0))
      }));
    store.listAttempts().then((list) => setAttempts(valid(list))).catch(() => setAttempts([]));
    store.listFrqHistory().then((list) => setFrqs(Array.isArray(list) ? list.filter((f) => f && f.course && Number(f.total) > 0 && Number.isFinite(Number(f.score))) : [])).catch(() => setFrqs([]));
  }, [store]);

  if (attempts === null) return <section className="page"><div className="card loading-card">Loading your progress…</div></section>;

  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">{user ? `Signed in as ${user.email}` : "Guest — progress is saved in this browser only"}</p>
        <h1>{user?.name ? `${user.name}'s progress` : "My progress"}</h1>
        {!user && backend.available && (
          <p><button className="link-btn inline" onClick={() => navigate("/login/register")}>Create a free account</button> to save progress across devices and unlock AI grading.</p>
        )}
      </div>

      {user && <RecoveryCodeNotice />}

      <div className="dash-grid">
        {courseList.map((course) => <CourseSummary key={course.id} course={course} attempts={attempts.filter((a) => a.course === course.id)} frqs={frqs.filter((f) => f.course === course.id)} />)}
      </div>

      <div className="card history-card">
        <h2>Recent exams and quizzes</h2>
        {attempts.length === 0 ? (
          <div className="empty-state">
            <p>Nothing here yet. Start with a practice exam: when you finish, this page shows your score for each unit and tells you what to study next.</p>
            <div className="button-row">
              <button className="secondary-btn" onClick={() => navigate("/csp/tests")}>AP CSP exam</button>
              <button className="secondary-btn" onClick={() => navigate("/csa/tests")}>AP CSA exam</button>
              <button className="secondary-btn" onClick={() => navigate("/cyber/tests")}>AP Cyber exam</button>
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Course</th><th>Test</th><th>Score</th></tr></thead>
              <tbody>
                {attempts.slice(0, 25).map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>{courses[a.course]?.short || a.course}</td>
                    <td>{a.title}</td>
                    <td><strong>{a.score}/{a.total}</strong> ({Math.round((a.score / a.total) * 100)}%)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FrqHistory frqs={frqs} store={store} />

      {user && (
        <div className="account-grid">
          <RecoveryCode />
          <ChangePassword />
          <YourData onDeleted={signOut} />
        </div>
      )}
    </section>
  );
}

function CourseSummary({ course, attempts, frqs }) {
  // Nothing done yet in this course: one clear next step instead of empty stat tiles.
  if (!attempts.length && !frqs.length) {
    return (
      <div className={`card dash-card dash-card--empty accent-${course.accent}`}>
        <h2>{course.name}</h2>
        <p className="muted">No exams or FRQs yet. A practice exam shows your score for each unit and what to study next.</p>
        <button className="primary-btn" onClick={() => navigate(`/${course.id}/tests`)}>Take your first {course.short} exam</button>
      </div>
    );
  }
  // Full practice exams and short custom quizzes are counted separately.
  const exams = attempts.filter((a) => a.testId !== "custom");
  const quizzes = attempts.length - exams.length;
  const best = exams.reduce((m, a) => Math.max(m, a.score / a.total), 0);
  const recent = attempts.slice(0, 5);
  const avg = recent.length ? recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length : 0;

  // Combine unit breakdowns to find the weakest unit.
  const unitTotals = {};
  attempts.forEach((a) => {
    Object.values(a.unitBreakdown || {}).forEach((u) => {
      const t = unitTotals[u.unit] || (unitTotals[u.unit] = { unit: u.unit, name: u.name, correct: 0, total: 0 });
      t.correct += u.correct;
      t.total += u.total;
    });
  });
  const units = Object.values(unitTotals).filter((u) => u.total >= 3).sort((a, b) => a.correct / a.total - b.correct / b.total);
  const weakest = units[0];
  const frqAvg = frqs.length ? frqs.reduce((s, f) => s + f.score / f.total, 0) / frqs.length : null;

  return (
    <article className={`card dash-card accent-${course.accent}`}>
      <h2>{course.name}</h2>
      <div className="dash-stats">
        <div><strong>{exams.length}</strong><span>practice exams</span></div>
        <div><strong>{quizzes}</strong><span>custom quizzes</span></div>
        <div><strong>{exams.length ? `${Math.round(best * 100)}%` : "—"}</strong><span>best exam score</span></div>
        <div><strong>{recent.length ? `${Math.round(avg * 100)}%` : "—"}</strong><span>recent avg</span></div>
        <div><strong>{frqAvg === null ? "—" : `${Math.round(frqAvg * 100)}%`}</strong><span>FRQ avg</span></div>
      </div>
      {units.length > 0 && (
        <div className="unit-bars">
          {[...units].sort((a, b) => a.unit - b.unit).map((u) => (
            <div className="unit-bar" key={u.unit}>
              <span>U{u.unit}</span>
              <div className="bar-track"><div className={`bar-fill unit-${u.unit}`} style={{ width: `${Math.round((u.correct / u.total) * 100)}%` }} /></div>
              <b>{Math.round((u.correct / u.total) * 100)}%</b>
            </div>
          ))}
        </div>
      )}
      {weakest ? (
        <p className="recommend">Focus next: <strong>Unit {weakest.unit} — {weakest.name}</strong> ({Math.round((weakest.correct / weakest.total) * 100)}%). Build a custom quiz on it and review the notes.</p>
      ) : (
        <p className="muted">Take a practice exam to see which units you're strong and weak in.</p>
      )}
      <div className="button-row">
        <button className="primary-btn small-btn" onClick={() => navigate(weakest ? `/${course.id}/quiz/${weakest.unit}` : `/${course.id}/tests`)}>{weakest ? `Quiz Unit ${weakest.unit}` : "Start an exam"}</button>
        <button className="secondary-btn small-btn" onClick={() => navigate(`/${course.id}/frq`)}>FRQs</button>
      </div>
    </article>
  );
}

const NEW_CODE_KEY = "ap-study-path:new-recovery-code";

function CodeToCopy({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="recovery-code-row">
      <code className="recovery-code">{code}</code>
      <button className="secondary-btn small-btn" onClick={() => {
        navigator.clipboard?.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
      }}>{copied ? "Copied" : "Copy"}</button>
    </div>
  );
}

// Shown right after sign-up or a password reset: the code is only ever shown this once.
function RecoveryCodeNotice() {
  const [code, setCode] = useState(() => { try { return sessionStorage.getItem(NEW_CODE_KEY); } catch { return null; } });
  if (!code) return null;
  return (
    <div className="card recovery-card" role="status">
      <h2>Save your recovery code</h2>
      <p>If you forget your password, this code resets it. <strong>It's shown only once</strong>, so write it down or save it somewhere safe.</p>
      <CodeToCopy code={code} />
      <button className="primary-btn" onClick={() => { try { sessionStorage.removeItem(NEW_CODE_KEY); } catch { /* ignore */ } setCode(null); }}>I've saved it</button>
    </div>
  );
}

function RecoveryCode() {
  const [info, setInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { api("/auth/recovery-code").then(setInfo).catch(() => setInfo({ hasCode: false })); }, [code]);

  async function make(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api("/auth/recovery-code", { method: "POST", body: { password } });
      setCode(data.recoveryCode);
      setPassword("");
      try { sessionStorage.removeItem(NEW_CODE_KEY); } catch { /* ignore */ }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={`card account-card ${info && !info.hasCode ? "needs-code" : ""}`}>
      <h2>Recovery code</h2>
      {info === null ? <p className="muted">Checking…</p> : info.hasCode ? (
        <p className="muted">You have a code (made {new Date(info.createdAt).toLocaleDateString()}). It resets your password if you forget it. Making a new one cancels the old one.</p>
      ) : (
        <p><strong>You don't have a recovery code yet.</strong> Without one, a forgotten password can't be reset. Make one now and save it.</p>
      )}
      {code ? (
        <>
          <p>Your new code. <strong>It's shown only once</strong>, so save it now.</p>
          <CodeToCopy code={code} />
        </>
      ) : !open ? (
        <button className={info && !info.hasCode ? "primary-btn" : "link-btn"} onClick={() => setOpen(true)}>{info?.hasCode ? "Make a new code" : "Make my recovery code"}</button>
      ) : (
        <form className="login-form narrow" onSubmit={make}>
          <label htmlFor="rc-pw">Your password</label>
          <input id="rc-pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          <button className="primary-btn" type="submit">Show my new code</button>
          {error && <div className="error-box" role="alert">{error}</div>}
        </form>
      )}
    </div>
  );
}

const frqTitle = (f) => courses[f.course]?.frqs?.find((x) => x.id === f.frqId)?.title || "FRQ";

function FrqHistory({ frqs, store }) {
  const [openId, setOpenId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [course, setCourse] = useState("all");
  const shown = frqs.filter((f) => course === "all" || f.course === course);

  async function toggle(f) {
    if (openId === f.id) { setOpenId(null); return; }
    setOpenId(f.id);
    setDetail({ loading: true });
    try {
      const d = await store.getFrqSubmission(f.id);
      setDetail(d ? { ...d, loading: false } : { error: "That answer wasn't saved." });
    } catch (err) {
      setDetail({ error: err.message });
    }
  }

  return (
    <div className="card history-card frq-history-card">
      <div className="history-head">
        <h2>Past FRQs</h2>
        {frqs.length > 0 && (
          <select aria-label="Show FRQs for" value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="all">All courses</option>
            {courseList.map((c) => <option key={c.id} value={c.id}>{c.short}</option>)}
          </select>
        )}
      </div>
      {frqs.length === 0 ? (
        <div className="empty-state">
          <p>No graded FRQs yet. Write an answer on an FRQ page and grade it; each one shows up here with its score and feedback.</p>
          <div className="button-row">
            {courseList.map((c) => <button key={c.id} className="secondary-btn" onClick={() => navigate(`/${c.id}/frq`)}>{c.short} FRQs</button>)}
          </div>
        </div>
      ) : (
        <ul className="frq-history-list">
          {shown.slice(0, 40).map((f) => {
            const pct = Math.round((f.score / f.total) * 100);
            const isOpen = openId === f.id;
            return (
              <li key={f.id} className={isOpen ? "open" : ""}>
                <div className="frq-history-row">
                  <div className="frq-history-main">
                    <strong>{frqTitle(f)}</strong>
                    <span className="frq-history-meta"><span>{courses[f.course]?.short}</span><span>{new Date(f.createdAt).toLocaleDateString()}</span><span>{f.grader === "ai" ? "AI graded" : "Rubric estimate"}</span></span>
                  </div>
                  <span className={`score-pill ${pct >= 70 ? "good" : pct >= 40 ? "mid" : "low"}`}>{f.score}/{f.total}</span>
                  <div className="frq-history-actions">
                    <button className="link-btn" aria-expanded={isOpen} onClick={() => toggle(f)}>{isOpen ? "Hide answer" : "See answer"}</button>
                    <button className="secondary-btn small-btn" onClick={() => navigate(`/${f.course}/frq/${f.frqId}`)}>Try again</button>
                  </div>
                </div>
                {isOpen && (
                  <div className="frq-history-detail">
                    {detail?.loading ? <p className="muted">Loading…</p> : detail?.error ? <p className="error-box">{detail.error}</p> : (
                      <>
                        {detail?.feedback?.summary && <p className="frq-history-summary">{detail.feedback.summary}</p>}
                        {detail?.feedback?.rows?.length > 0 && (
                          <ul className="frq-history-rows">
                            {detail.feedback.rows.map((r, i) => (
                              <li key={i} className={Number(r.earned) >= Number(r.max) ? "earned" : "missed"}>
                                <b>{r.earned}/{r.max}</b> {r.point}{r.reason ? <span className="muted"> — {r.reason}</span> : null}
                              </li>
                            ))}
                          </ul>
                        )}
                        {detail?.response ? (
                          f.course === "csa" ? <CodeView code={detail.response} /> : <p className="frq-history-answer">{detail.response}</p>
                        ) : <p className="muted">The answer text wasn't saved for this one.</p>}
                      </>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function YourData({ onDeleted }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [sure, setSure] = useState(false);
  const [msg, setMsg] = useState(null);

  async function download() {
    setMsg(null);
    try {
      const data = await api("/account/export");
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "ap-study-path-my-data.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  }

  async function remove(e) {
    e.preventDefault();
    setMsg(null);
    try {
      await api("/account/delete", { method: "POST", body: { password } });
      try {
        Object.keys(localStorage).filter((k) => k.startsWith("ap-study-path:")).forEach((k) => localStorage.removeItem(k));
      } catch { /* ignore */ }
      window.dispatchEvent(new CustomEvent("ap-notice", { detail: "Your account and everything saved with it were deleted." }));
      onDeleted();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  }

  return (
    <div className="card account-card">
      <h2>Your data</h2>
      <p className="muted">Download everything saved in your account, or delete the account. See the <a href="#/privacy">privacy policy</a>.</p>
      <div className="button-row">
        <button className="secondary-btn small-btn" onClick={download} disabled={!getToken()}>Download my data</button>
        <button className="link-btn danger-link" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Cancel" : "Delete my account"}</button>
      </div>
      {open && (
        <form className="login-form narrow" onSubmit={remove}>
          <p><strong>This can't be undone.</strong> Your scores, saved exams, FRQ answers and account are removed for good.</p>
          <label htmlFor="del-pw">Your password</label>
          <input id="del-pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          <label className="agree-row">
            <input type="checkbox" checked={sure} onChange={(e) => setSure(e.target.checked)} />
            <span>I understand everything will be deleted.</span>
          </label>
          <button className="danger-btn" type="submit" disabled={!sure || !password}>Delete my account</button>
        </form>
      )}
      {msg && <div className={msg.ok ? "success-box" : "error-box"} role={msg.ok ? "status" : "alert"}>{msg.text}</div>}
    </div>
  );
}

function ChangePassword() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    if (newPassword !== confirm) { setMsg({ ok: false, text: "The two new passwords don't match." }); return; }
    try {
      const data = await api("/auth/change-password", { method: "POST", body: { currentPassword, newPassword } });
      if (data.token) setToken(data.token);
      setMsg({ ok: true, text: "Password updated. Other devices are signed out." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  }

  return (
    <div className="card account-card">
      <h2>Password</h2>
      <button className="link-btn" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Hide" : "Change password"}</button>
      {open && (
        <form className="login-form narrow" onSubmit={submit}>
          <label htmlFor="cur-pw">Current password</label>
          <input id="cur-pw" type="password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
          <label htmlFor="new-pw">New password</label>
          <input id="new-pw" type="password" minLength={8} value={newPassword} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
          <label htmlFor="confirm-pw">New password again</label>
          <input id="confirm-pw" type="password" minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          <button className="primary-btn" type="submit">Update password</button>
          {msg && <div className={msg.ok ? "success-box" : "error-box"} role={msg.ok ? "status" : "alert"}>{msg.text}</div>}
        </form>
      )}
    </div>
  );
}
