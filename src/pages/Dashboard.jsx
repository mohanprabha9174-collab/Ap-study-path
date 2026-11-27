import { useEffect, useState } from "react";
import { courses, courseList } from "../data/courses.js";
import { api, setToken } from "../lib/api.js";
import { navigate, useApp } from "../App.jsx";

export default function Dashboard() {
  const { user, store, backend } = useApp();
  const [attempts, setAttempts] = useState(null);
  const [frqs, setFrqs] = useState([]);

  useEffect(() => {
    const valid = (list) => (Array.isArray(list) ? list : []).filter((a) =>
      a && Number(a.total) > 0 && Number.isFinite(Number(a.score)) && !Number.isNaN(new Date(a.createdAt).getTime()));
    store.listAttempts().then((list) => setAttempts(valid(list))).catch(() => setAttempts([]));
    store.listFrqHistory().then((list) => setFrqs(Array.isArray(list) ? list.filter((f) => f && f.course) : [])).catch(() => setFrqs([]));
  }, [store]);

  if (attempts === null) return <section className="page"><div className="card loading-card">Loading your progress…</div></section>;

  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">{user ? `Signed in as ${user.email}` : "Guest — progress is saved in this browser only"}</p>
        <h1>{user?.name ? `${user.name}'s progress` : "My progress"}</h1>
        {!user && backend.available && (
          <p><button className="link-btn inline" onClick={() => navigate("/login")}>Create a free account</button> to save progress across devices and unlock AI grading.</p>
        )}
      </div>

      <div className="dash-grid">
        {courseList.map((course) => <CourseSummary key={course.id} course={course} attempts={attempts.filter((a) => a.course === course.id)} frqs={frqs.filter((f) => f.course === course.id)} />)}
      </div>

      <div className="card history-card">
        <h2>Recent exams and quizzes</h2>
        {attempts.length === 0 ? (
          <div className="empty-state">
            <p>Nothing here yet. Start with a practice exam: when you finish, this page shows your score for each unit and tells you what to study next.</p>
            <div className="button-row">
              <button className="primary-btn" onClick={() => navigate("/csp/tests")}>AP CSP exam</button>
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

      {user && <ChangePassword />}
    </section>
  );
}

function CourseSummary({ course, attempts, frqs }) {
  const best = attempts.reduce((m, a) => Math.max(m, a.score / a.total), 0);
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
        <div><strong>{attempts.length}</strong><span>exams and quizzes</span></div>
        <div><strong>{attempts.length ? `${Math.round(best * 100)}%` : "—"}</strong><span>best score</span></div>
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
      <button className="link-btn" onClick={() => setOpen(!open)}>{open ? "Hide" : "Change password"}</button>
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
