import { useEffect, useState } from "react";
import { navigate, useApp } from "../App.jsx";
import { api } from "../lib/api.js";
import { gradeWithRubric, rubricTotal } from "../lib/rubricGrader.js";
import { loadDraft, saveDraft } from "../lib/store.js";

export function FrqTab({ course }) {
  const { user, backend, store } = useApp();
  const [selectedId, setSelectedId] = useState(course.frqs[0]?.id);
  const frq = course.frqs.find((f) => f.id === selectedId) || course.frqs[0];
  const [response, setResponse] = useState(() => loadDraft(`frq:${frq.id}`));
  const [ppr, setPpr] = useState(() => loadDraft("ppr:csp"));
  const [results, setResults] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [showRubric, setShowRubric] = useState(false);
  const [history, setHistory] = useState([]);

  const aiAvailable = backend.available && backend.aiGrading;
  const canUseServer = backend.available && Boolean(user);

  useEffect(() => {
    setResponse(loadDraft(`frq:${frq.id}`));
    setShowSolution(false);
    setError("");
  }, [frq.id]);

  useEffect(() => {
    store.listFrqHistory().then((list) => setHistory(list.filter((h) => h.course === course.id))).catch(() => setHistory([]));
  }, [store, course.id, results]);

  function onResponseChange(text) {
    setResponse(text);
    saveDraft(`frq:${frq.id}`, text);
  }

  function onPprChange(text) {
    setPpr(text);
    saveDraft("ppr:csp", text);
  }

  function handlePprFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.name.toLowerCase().endsWith(".pdf")) {
      setError("PDFs can't be read in the browser reliably. Open your PPR, copy the code text, and paste it into the box.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onPprChange(String(reader.result || "").slice(0, 15000));
    reader.readAsText(file);
  }

  async function grade() {
    setError("");
    if (response.trim().length < 10) {
      setError("Write your response first.");
      return;
    }
    setBusy(true);
    try {
      let result;
      if (canUseServer) {
        result = await api("/frq/grade", { method: "POST", body: { course: course.id, frqId: frq.id, response, ppr: frq.usesPpr ? ppr : "" } });
      } else {
        result = { ...gradeWithRubric({ frq, response }), solution: frq.solution || null };
        await store.addFrqResult({ course: course.id, frqId: frq.id, score: result.score, total: result.total, grader: result.grader });
      }
      setResults((prev) => ({ ...prev, [frq.id]: result }));
      setTimeout(() => document.getElementById("frq-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const result = results[frq.id];
  const myHistory = history.filter((h) => h.frqId === frq.id);
  const groups = [...new Set(course.frqs.map((f) => f.category))];

  return (
    <div className="frq-page">
      <GradingBanner course={course} aiAvailable={aiAvailable} canUseServer={canUseServer} backendAvailable={backend.available} />

      {course.id === "csp" && (
        <div className="card ppr-panel">
          <div>
            <h2>Paste your PPR code</h2>
            <p>The AP CSP written response asks about your own program. Paste the code from your Personalized Project Reference here (procedure, where it's called, list creation, and list use) so your answers can be graded against it. Remove names or personal info first.</p>
          </div>
          <label className="file-drop" htmlFor="ppr-file">
            <strong>Attach a code file</strong>
            <span>.txt, .js, .py, .java, .html, .md</span>
            <input id="ppr-file" type="file" accept=".txt,.md,.js,.jsx,.py,.java,.html,.css" onChange={handlePprFile} />
          </label>
          <textarea className="ppr-textarea mono" value={ppr} onChange={(e) => onPprChange(e.target.value)} placeholder="Paste your PPR code here…" />
          <details className="ppr-checklist-details">
            <summary>PPR requirements checklist</summary>
            <div className="checklist-grid">
              {course.pprChecklist.map((group) => (
                <div className="checklist-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      <div className="frq-layout">
        <aside className="card frq-sidebar">
          <h2>Choose an FRQ</h2>
          {groups.map((group) => (
            <div key={group} className="frq-group">
              <h3>{group}</h3>
              {course.frqs.filter((f) => f.category === group).map((f) => {
                const best = history.filter((h) => h.frqId === f.id).reduce((m, h) => Math.max(m, h.score / h.total), -1);
                return (
                  <button key={f.id} className={f.id === frq.id ? "frq-tab active" : "frq-tab"} onClick={() => setSelectedId(f.id)}>
                    <div>
                      <strong>{f.title}</strong>
                      <small>{rubricTotal(f)} points{best >= 0 ? `, best ${Math.round(best * 100)}%` : ""}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        <div className="card frq-workspace">
          <p className="eyebrow">{frq.category}, {rubricTotal(frq)} points</p>
          <h2>{frq.title}</h2>
          <p className="prompt-box">{frq.prompt}</p>
          {frq.code && <pre className="code-block">{frq.code}</pre>}

          {frq.sources?.length > 0 && (
            <div className="sources">
              {frq.sources.map((s) => (
                <details className="source-card" key={s.title} open>
                  <summary>{s.title}</summary>
                  <pre>{s.content}</pre>
                </details>
              ))}
            </div>
          )}

          {frq.parts?.length > 0 && (
            <ol className="parts-list">
              {frq.parts.map((p) => <li key={p.label}><strong>Part {p.label}.</strong> {p.text}</li>)}
            </ol>
          )}

          {frq.tip && <div className="info-box"><strong>Exam tip:</strong> {frq.tip}</div>}

          <button className="link-btn" onClick={() => setShowRubric(!showRubric)}>{showRubric ? "Hide" : "Show"} scoring rubric</button>
          {showRubric && (
            <div className="rubric-preview">
              <ul>
                {frq.rubric.map((row) => (
                  <li key={row.point}><strong>{row.point} ({row.points ?? 1} pt{(row.points ?? 1) > 1 ? "s" : ""}):</strong> {row.lookFor}</li>
                ))}
              </ul>
            </div>
          )}

          <label htmlFor="student-response">Your response</label>
          <textarea
            id="student-response"
            className={course.id === "csa" ? "mono code-input" : ""}
            value={response}
            onChange={(e) => onResponseChange(e.target.value)}
            onKeyDown={(e) => {
              if (course.id === "csa" && e.key === "Tab") {
                e.preventDefault();
                const el = e.target;
                const start = el.selectionStart;
                const next = response.slice(0, start) + "  " + response.slice(el.selectionEnd);
                onResponseChange(next);
                requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 2; });
              }
            }}
            placeholder={
              course.id === "csa"
                ? "Write your Java code here. Include the full method headers. Label parts, e.g. // (a)  and  // (b)"
                : course.id === "cyber"
                  ? "Answer each part with a label: (A) ... (B) ... Cite sources, e.g. 'Source 3 shows…'"
                  : "Answer using specific details from your own PPR code. Explain why, not just what."
            }
            spellCheck={course.id !== "csa"}
          />
          <div className="response-meta">{response.trim() ? response.trim().split(/\s+/).length : 0} words, saved as a draft on this device</div>

          {error && <div className="error-box">{error}</div>}
          <div className="button-row">
            <button className="primary-btn" onClick={grade} disabled={busy}>
              {busy ? (canUseServer && aiAvailable ? "AI is grading…" : "Scoring…") : canUseServer && aiAvailable ? "Grade with AI" : "Score with rubric"}
            </button>
            <button className="ghost-btn" onClick={() => onResponseChange("")}>Clear</button>
            {frq.solution && (result || myHistory.length > 0) && (
              <button className="secondary-btn" onClick={() => setShowSolution(!showSolution)}>{showSolution ? "Hide" : "Show"} reference solution</button>
            )}
          </div>

          {result && <GradeCard result={result} />}

          {showSolution && frq.solution && (
            <div className="solution-box">
              <h3>Reference solution</h3>
              <p className="muted">Other correct approaches also earn full credit.</p>
              <pre className={course.id === "csa" ? "code-block" : "prose-pre"}>{frq.solution}</pre>
            </div>
          )}

          {myHistory.length > 0 && (
            <div className="history-box">
              <h3>Your attempts</h3>
              <ul>
                {myHistory.slice(0, 6).map((h) => (
                  <li key={h.id}>{new Date(h.createdAt).toLocaleString()} — <strong>{h.score} / {h.total}</strong> <span className="muted">({h.grader === "ai" ? "AI graded" : "rubric estimate"})</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GradingBanner({ aiAvailable, canUseServer, backendAvailable }) {
  if (aiAvailable && canUseServer) {
    return <div className="card grading-banner ai"><strong>🤖 AI grading on.</strong> Your answer is scored row by row against the rubric like an AP reader would, with specific feedback.</div>;
  }
  if (aiAvailable && !canUseServer) {
    return (
      <div className="card grading-banner">
        <span><strong>Sign in to unlock AI grading.</strong> As a guest you get a quick keyword-based rubric estimate.</span>
        <button className="primary-btn small-btn" onClick={() => navigate("/login")}>Sign in</button>
      </div>
    );
  }
  return (
    <div className="card grading-banner">
      <span><strong>Rubric scoring mode.</strong> {backendAvailable ? "AI grading isn't configured on this server yet, so" : "This copy of the site runs without a server, so"} responses get a keyword-based rubric estimate. Compare with the reference solution to self-check.</span>
    </div>
  );
}

function GradeCard({ result }) {
  const pct = result.total ? Math.round((result.score / result.total) * 100) : 0;
  return (
    <div className="grade-card" id="frq-result">
      <div className="grade-header">
        <h3>{result.grader === "ai" ? "AI grading result" : "Rubric estimate"}</h3>
        <strong className="grade-score">{result.score} / {result.total} <span>({pct}%)</span></strong>
      </div>
      {result.notice && <div className="info-box">{result.notice}</div>}
      {result.summary && <p>{result.summary}</p>}
      <div className="rubric-result-list">
        {result.rows.map((row) => (
          <div className={`rubric-result ${row.earned >= row.max ? "earned" : row.earned > 0 ? "partial" : "missed"}`} key={row.point}>
            <b>{row.point}</b>
            <span>{row.earned} / {row.max}</span>
            <p>{row.reason}</p>
          </div>
        ))}
      </div>
      <div className="grade-columns">
        {result.strengths?.length > 0 && (
          <div>
            <h4>What you did well</h4>
            <ul>{result.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        )}
        {result.improvements?.length > 0 && (
          <div>
            <h4>Fix next</h4>
            <ul>{result.improvements.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        )}
      </div>
      {result.examTip && <div className="info-box"><strong>Exam tip:</strong> {result.examTip}</div>}
      <p className="muted small">Practice score only — not an official AP score.</p>
    </div>
  );
}
