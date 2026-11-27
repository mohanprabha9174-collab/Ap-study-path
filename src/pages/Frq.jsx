import { useEffect, useState } from "react";
import { navigate, scrollBehavior, useApp } from "../App.jsx";
import { api } from "../lib/api.js";
import { gradeWithRubric, rubricTotal } from "../lib/rubricGrader.js";
import { loadDraft, saveDraft } from "../lib/store.js";
import { references } from "../data/references.js";
import AiHelper from "../components/AiHelper.jsx";
import ProjectUpload, { useProject } from "../components/ProjectUpload.jsx";
import { usePrefs } from "../lib/prefs.js";
import { CodeView, ReferenceDrawer, formatTime } from "../components/ExamTools.jsx";

const FRQ_MINUTES = { csp: 30, csa: 22, cyber: 50 };

function FrqToolbar({ course, frqId }) {
  const [prefs, setPrefs] = usePrefs();
  const [refOpen, setRefOpen] = useState(false);
  // One timer per course. It keeps running across FRQs, tab switches and reloads (it's stored
  // in this browser tab), since CSP's 30 minutes cover several prompts.
  const timerKey = `ap-study-path:frq-timer:${course.id}`;
  const readTimer = () => {
    try {
      const t = JSON.parse(sessionStorage.getItem(timerKey) || "null");
      if (!t) return { left: FRQ_MINUTES[course.id] * 60, running: false };
      const left = t.running ? Math.max(0, Math.round(t.left - (Date.now() - t.at) / 1000)) : t.left;
      return { left, running: t.running && left > 0 };
    } catch { return { left: FRQ_MINUTES[course.id] * 60, running: false }; }
  };
  const [running, setRunning] = useState(() => readTimer().running);
  const [left, setLeft] = useState(() => readTimer().left);
  useEffect(() => { const t = readTimer(); setRunning(t.running); setLeft(t.left); }, [course.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    try { sessionStorage.setItem(timerKey, JSON.stringify({ left, running, at: Date.now() })); } catch { /* ignore */ }
  }, [left, running, timerKey]);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setLeft((t) => (t <= 1 ? (setRunning(false), 0) : t - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const full = FRQ_MINUTES[course.id] * 60;
  const reference = references[course.id];
  return (
    <div className="frq-toolbar">
      <div className="frq-timer">
        {left === 0 ? <span className="exam-timer low times-up" role="alert">Time's up: finish your sentence and grade it</span>
          : prefs.showTimer ? <span className={`exam-timer ${left <= 300 && running ? "low" : ""}`}>{formatTime(left)}</span> : <span className="exam-timer hidden-timer">Timer hidden</span>}
        {left > 0 && <button className="bar-btn" onClick={() => setRunning(!running)}>{running ? "Pause" : left === full ? `Start ${FRQ_MINUTES[course.id]}-minute timer` : "Resume"}</button>}
        {left !== full && <button className="bar-btn" onClick={() => { setRunning(false); setLeft(full); }}>{left === 0 ? "Start again" : "Reset"}</button>}
        <button className="bar-btn" onClick={() => setPrefs({ showTimer: !prefs.showTimer })}>{prefs.showTimer ? "Hide" : "Show"}</button>
      </div>
      {reference && <button className="tool-btn" onClick={() => setRefOpen(true)}>Reference</button>}
      <ReferenceDrawer reference={reference} open={refOpen} onClose={() => setRefOpen(false)} />
    </div>
  );
}

export function FrqTab({ course, frqParam }) {
  const { user, backend, store } = useApp();
  // The open FRQ lives in the URL (#/csa/frq/<id>) so reloads and links keep it.
  const lastKey = `ap-study-path:last-frq:${course.id}`;
  const remembered = (() => { try { return sessionStorage.getItem(lastKey); } catch { return null; } })();
  const frq = course.frqs.find((f) => f.id === frqParam) || course.frqs.find((f) => f.id === remembered) || orderFrqs(course.frqs)[0];
  useEffect(() => { try { sessionStorage.setItem(lastKey, frq.id); } catch { /* ignore */ } }, [frq.id, lastKey]);
  const setSelectedId = (id) => {
    navigate(`/${course.id}/frq/${id}`);
    // Bring the new prompt into view (the page may be scrolled down to the answer).
    requestAnimationFrame(() => document.querySelector(".frq-workspace")?.scrollIntoView({ block: "start", behavior: scrollBehavior() }));
  };
  const [askText, setAskText] = useState("");
  const [response, setResponse] = useState(() => loadDraft(`frq:${frq.id}`));
  const [project, setProject] = useProject();
  const [noProjectWarning, setNoProjectWarning] = useState(false);
  const ppr = project.code || loadDraft("ppr:csp");
  const hasProject = ppr.trim().length > 20 || project.files.length > 0;
  const [results, setResults] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [showRubric, setShowRubric] = useState(false);
  const [history, setHistory] = useState([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [usage, setUsage] = useState(null);

  const aiAvailable = backend.available && backend.aiGrading;
  const canUseServer = backend.available && Boolean(user);

  useEffect(() => {
    setResponse(loadDraft(`frq:${frq.id}`));
    setShowSolution(false);
    setShowRubric(false);
    setNoProjectWarning(false);
    setError("");
  }, [frq.id]);

  useEffect(() => {
    if (aiAvailable && canUseServer) api("/ai/usage").then(setUsage).catch(() => {});
    else setUsage(null);
  }, [aiAvailable, canUseServer, results]);
  useEffect(() => {
    const onUsage = (e) => setUsage(e.detail);
    window.addEventListener("ap-usage", onUsage);
    return () => window.removeEventListener("ap-usage", onUsage);
  }, []);
  const aiLeft = !(aiAvailable && canUseServer) || !usage?.grades || usage.grades.remaining > 0;

  useEffect(() => {
    store.listFrqHistory().then((list) => setHistory(list.filter((h) => h.course === course.id))).catch(() => setHistory([]));
  }, [store, course.id, results]);

  function onResponseChange(text) {
    setResponse(text);
    saveDraft(`frq:${frq.id}`, text);
  }

  async function grade(skipProjectCheck = false) {
    setError("");
    if (response.trim().length < 10) {
      setError("Write your answer in the box first, then grade it.");
      return;
    }
    if (frq.usesPpr && !hasProject && !skipProjectCheck && canUseServer) {
      setNoProjectWarning(true);
      return;
    }
    setNoProjectWarning(false);
    setBusy(true);
    try {
      let result;
      if (canUseServer) {
        result = await api("/frq/grade", { method: "POST", body: { course: course.id, frqId: frq.id, response, ppr: frq.usesPpr ? ppr : "", pprFiles: frq.usesPpr ? project.files : [] } });
      } else {
        result = { ...gradeWithRubric({ frq, response }), solution: frq.solution || null };
        await store.addFrqResult({ course: course.id, frqId: frq.id, score: result.score, total: result.total, grader: result.grader });
      }
      setResults((prev) => ({ ...prev, [frq.id]: { ...result, gradedText: response } }));
      setTimeout(() => document.getElementById("frq-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const result = results[frq.id];
  const myHistory = history.filter((h) => h.frqId === frq.id);
  // FRQs in exam order; the sidebar groups and Previous / Next both follow it.
  const ordered = orderFrqs(course.frqs);
  const groups = [...new Set(ordered.map((f) => f.category))];

  return (
    <div className="frq-page">
      <GradingBanner aiAvailable={aiAvailable} canUseServer={canUseServer} backendAvailable={backend.available} usage={usage} csp={course.id === "csp"} />

      {course.id === "csp" && (
        <>
          <ProjectUpload project={{ ...project, code: ppr }} onChange={(next) => { setProject(next); saveDraft("ppr:csp", next.code); }} checklist={course.pprChecklist} />
        </>
      )}

      <div className="frq-layout">
        <label className="frq-picker">
          <span>FRQ</span>
          <select value={frq.id} onChange={(e) => setSelectedId(e.target.value)}>
            {groups.map((group) => (
              <optgroup key={group} label={group}>
                {course.frqs.filter((f) => f.category === group).map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
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
          <FrqToolbar course={course} frqId={frq.id} />
          <div className="frq-head">
            <div>
              <p className="eyebrow">{frq.category}, {rubricTotal(frq)} points</p>
              <h2>{frq.title}</h2>
            </div>
            <FrqNav frqs={ordered} current={frq} onGo={setSelectedId} />
          </div>
          <FrqPrompt frq={frq} />

          <ol className="frq-steps" aria-label="How to practice this FRQ">
            {frq.usesPpr && canUseServer && aiAvailable && <li className={hasProject ? "done" : "now"}>Upload your Create Task project at the top of this page</li>}
            <li className={response.trim() ? "done" : "now"}>Read the prompt and write your answer below</li>
            <li className={result ? "done" : response.trim() ? "now" : ""}>Click {canUseServer && aiAvailable && aiLeft ? "Grade with AI" : "Score with rubric"} to see your points</li>
            <li className={result ? "now" : ""}>Fix what the feedback points out, then grade again</li>
          </ol>

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
            maxLength={12000}
            aria-describedby="response-meta"
            onKeyDown={(e) => {
              // Tab indents Java code. Press Esc first to let Tab move focus out of the box.
              if (e.key === "Escape") { e.currentTarget.dataset.escaped = "1"; return; }
              const escaped = e.currentTarget.dataset.escaped === "1";
              delete e.currentTarget.dataset.escaped;
              if (course.id !== "csa" || escaped) return;
              const el = e.target;
              const start = el.selectionStart;
              const end = el.selectionEnd;
              // Edit through the browser's own text insertion so Ctrl+Z still works; fall back to
              // setRangeText where that isn't supported. Then sync state from the box.
              const edit = (text, from, to, select) => {
                e.preventDefault();
                el.setSelectionRange(from, to);
                const ok = text ? document.execCommand("insertText", false, text) : document.execCommand("delete");
                if (!ok) el.setRangeText(text, from, to, "end");
                if (select) el.setSelectionRange(select[0], select[1]);
                onResponseChange(el.value);
              };
              const value = el.value;
              const lineStart = value.lastIndexOf("\n", start - 1) + 1;
              const line = value.slice(lineStart, start);
              const indent = line.match(/^ */)[0];
              const multiLine = start !== end && value.slice(start, end).includes("\n");
              if (e.key === "Tab" && (multiLine || e.shiftKey)) {
                // With several lines selected (or Shift+Tab anywhere on a line), indent or outdent
                // every touched line by 4 spaces and keep the lines selected.
                const blockEnd = value.indexOf("\n", end - (value[end - 1] === "\n" ? 1 : 0));
                const to = blockEnd === -1 ? value.length : blockEnd;
                const block = value.slice(lineStart, to);
                const changed = block.split("\n").map((l) => (e.shiftKey ? l.replace(/^ {1,4}/, "") : `    ${l}`)).join("\n");
                if (changed === block) { e.preventDefault(); return; }
                edit(changed, lineStart, to, [lineStart, lineStart + changed.length]);
              } else if (e.key === "Tab") {
                // Tab indents by 4 spaces, the usual Java style (replacing any selected text on one line).
                edit("    ", start, end);
              } else if (e.key === "Enter" && !e.shiftKey) {
                // A new line keeps the current indentation, one level deeper after "{".
                const deeper = /\{\s*$/.test(line) ? "    " : "";
                edit(`\n${indent}${deeper}`, start, end);
              } else if (e.key === "}" && start === end && /^ +$/.test(line)) {
                // Typing "}" on an indented blank line steps back one level.
                const cut = Math.min(4, line.length);
                edit("}", start - cut, end);
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
          <div className="response-meta" id="response-meta">
            {response.trim() ? response.trim().split(/\s+/).length : 0} words, saved as a draft on this device
            {course.id === "csa" && ". Tab indents 4 spaces, Enter keeps your indentation; press Esc then Tab to leave the box"}
            {response.length > 10000 && <strong> · {response.length.toLocaleString()} of 12,000 characters</strong>}
          </div>

          {error && <div className="error-box" role="alert">{error}</div>}
          {noProjectWarning && !hasProject && (
            <div className="confirm-card pop-in">
              <p><strong>You haven't uploaded your project yet.</strong> Without it, the AI can't check your answer against your actual code, so your score will be less accurate.</p>
              <div className="button-row">
                <button className="primary-btn" onClick={() => { setNoProjectWarning(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Upload my project</button>
                <button className="ghost-btn" onClick={() => grade(true)}>Grade anyway</button>
              </div>
            </div>
          )}
          <div className="button-row">
            <button className="primary-btn" onClick={() => grade()} disabled={busy}>
              {busy ? (canUseServer && aiAvailable && aiLeft ? "AI is grading…" : "Scoring…") : canUseServer && aiAvailable && aiLeft ? "Grade with AI" : "Score with rubric"}
            </button>
            <button className="secondary-btn ai-btn" onClick={() => setAiOpen(true)}><span className="ai-badge">AI</span> Get help</button>
            <button className="ghost-btn" onClick={() => { if (!response.trim() || window.confirm("Erase your whole answer? This can't be undone.")) onResponseChange(""); }}>Clear</button>
            {frq.solution && (result || myHistory.length > 0) && (
              <button className="secondary-btn" onClick={() => setShowSolution(!showSolution)}>{showSolution ? "Hide" : "Show"} reference solution</button>
            )}
          </div>

          {result && result.gradedText !== undefined && result.gradedText !== response && (
            <p className="info-box" role="status">You've changed your answer since this grade. Grade again to update it.</p>
          )}
          {result && (
            <GradeCard
              result={result}
              onAsk={result.score < result.total ? () => {
                const missed = (result.rows || []).filter((r) => r.earned < r.max).map((r) => `"${r.point}"`).slice(0, 4);
                setAskText(`Why did I lose points on ${missed.length ? missed.join(", ") : "this FRQ"}, and what exactly should I change in my answer?`);
                setAiOpen(true);
              } : null}
            />
          )}
          {result && nextFrq(ordered, frq) && (
            <div className="next-frq card">
              <p><strong>Ready for another?</strong> Next up: {nextFrq(ordered, frq).title}</p>
              <button className="primary-btn" onClick={() => setSelectedId(nextFrq(ordered, frq).id)}>Go to the next FRQ</button>
            </div>
          )}

          {showSolution && frq.solution && (
            <div className="solution-box">
              <h3>Reference solution</h3>
              <p className="muted">Other correct approaches also earn full credit.</p>
              {course.id === "csa" ? <CodeView code={frq.solution} /> : <pre className="prose-pre">{frq.solution}</pre>}
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
      <AiHelper
        open={aiOpen}
        onClose={() => { setAiOpen(false); setAskText(""); }}
        autoAsk={askText}
        onAutoAsked={() => setAskText("")}
        course={course}
        context={{ key: `frq:${frq.id}`, label: frq.title, kind: "frq", frqId: frq.id, draft: response, graded: Boolean(result), ppr: frq.usesPpr ? ppr : "", pprFiles: frq.usesPpr ? project.files : [] }}
        starters={frqStarters(Boolean(result))}
      />
    </div>
  );
}

function frqStarters(graded) {
  return graded
    ? ["Explain my score", "How do I fix what I missed?", "Which rubric point should I fix first?", "Explain the reference solution"]
    : ["What is this question asking?", "Give me a hint for the first part", "Check my draft against the rubric (no answers)", "How should I start?"];
}

// FRQs in exam order: Written Response 1 before 2(a), 2(b), 2(c); FRQ 1 before FRQ 2, and so on.
// Within a section, the order they're listed in the data.
export function orderFrqs(frqs) {
  const key = (f) => String(f.category).split(":")[0];
  return frqs.map((f, i) => ({ f, i })).sort((a, b) => key(a.f).localeCompare(key(b.f), undefined, { numeric: true }) || a.i - b.i).map((x) => x.f);
}

const nextFrq = (frqs, frq) => frqs[frqs.indexOf(frq) + 1] || null;

// Previous / next buttons, so students can skip a question they don't want to do.
function FrqNav({ frqs, current, onGo }) {
  const i = frqs.indexOf(current);
  return (
    <nav className="frq-nav" aria-label="Move between FRQs">
      <button className="ghost-btn" disabled={i <= 0} onClick={() => onGo(frqs[i - 1].id)}>Previous</button>
      <span className="frq-nav__count">{i + 1} of {frqs.length}</span>
      <button className="secondary-btn" disabled={i >= frqs.length - 1} onClick={() => onGo(frqs[i + 1].id)}>Skip to next</button>
    </nav>
  );
}

// Method calls and Java expressions in prose show in the code font, e.g. bestStreak(int goal).
function withInlineCode(text) {
  const out = [];
  const re = /\b[A-Za-z_][A-Za-z0-9_]*(?:\[[^\]]*\])*\([^()]*\)|\b[a-z][A-Za-z0-9_]*\[[^\]]+\](?:\[[^\]]+\])?/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<code className="inline-code" key={m.index}>{m[0]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Points per part, read from rubric rows labelled "A: ..." or "(a) ...".
function partPoints(frq, label) {
  const re = new RegExp(`^\\(?${label}\\)?[:\\s]`, "i");
  const rows = frq.rubric.filter((r) => re.test(r.point));
  return rows.length ? rows.reduce((sum, r) => sum + (r.points ?? 1), 0) : null;
}

// The prompt laid out for reading: intro, numbered sources you can cite by line, then each
// part in its own box with its points.
function FrqPrompt({ frq }) {
  const paragraphs = String(frq.prompt).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const intro = [];
  const parts = [...(frq.parts || []).map((p) => ({ label: p.label, text: p.text }))];
  paragraphs.forEach((p) => {
    const m = p.match(/^\(([a-d])\)\s*([\s\S]*)$/i);
    if (m && !frq.parts?.length) parts.push({ label: m[1], text: m[2] });
    else intro.push(p);
  });
  return (
    <div className="frq-prompt">
      {intro.map((p, i) => {
        const example = p.match(/^Example:\s*\n([\s\S]+)$/);
        if (example) return <div className="prompt-example" key={i}><p className="prompt-intro"><strong>Example</strong></p><CodeView code={example[1]} /></div>;
        const lines = p.split("\n");
        if (lines.length > 1 && lines.slice(1).every((l) => /^[•-]\s/.test(l))) {
          return (
            <div key={i}>
              <p className="prompt-intro">{withInlineCode(lines[0])}</p>
              <ul className="prompt-bullets">{lines.slice(1).map((l, li) => <li key={li}>{withInlineCode(l.replace(/^[•-]\s*/, ""))}</li>)}</ul>
            </div>
          );
        }
        if (lines.every((l) => /^[•-]\s/.test(l))) {
          return <ul className="prompt-bullets" key={i}>{lines.map((l, li) => <li key={li}>{withInlineCode(l.replace(/^[•-]\s*/, ""))}</li>)}</ul>;
        }
        return <p className="prompt-intro" key={i}>{withInlineCode(p)}</p>;
      })}
      {frq.code && <CodeView code={frq.code} />}
      {frq.sources?.length > 0 && (
        <section className="sources" aria-label="Sources">
          <p className="sources__hint">Line numbers are shown so you can cite them, for example "Source 2, line 3".</p>
          {frq.sources.map((src) => {
            const m = src.title.match(/^(Source \d+):\s*(.*)$/);
            return (
              <details className="source-card" key={src.title} open>
                <summary>{m ? <><span className="source-tag">{m[1]}</span> {m[2]}</> : src.title}</summary>
                <CodeView code={src.content} plain />
              </details>
            );
          })}
        </section>
      )}
      {parts.length > 0 && (
        <ol className="part-cards" aria-label="Parts to answer">
          {parts.map((p) => {
            const pts = partPoints(frq, p.label);
            return (
              <li className="part-card" key={p.label}>
                <span className="part-tag">Part {frq.parts?.length ? p.label : `(${p.label})`}</span>
                {pts !== null && <span className="part-points">{pts} pt{pts === 1 ? "" : "s"}</span>}
                <p>{withInlineCode(p.text)}</p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function GradingBanner({ aiAvailable, canUseServer, backendAvailable, usage, csp }) {
  const grades = usage?.grades;
  if (aiAvailable && canUseServer && grades?.remaining === 0) {
    return (
      <div className="card grading-banner">
        <span><strong>You've used today's {grades.limit} AI grades.</strong> Grading falls back to the keyword rubric estimate until they reset tomorrow. Grading the same answer again is free.</span>
      </div>
    );
  }
  if (aiAvailable && canUseServer) {
    return (
      <div className="card grading-banner ai">
        <span><strong>AI grading is on.</strong> Your answer is scored row by row against the rubric, with specific fixes.</span>
        {grades && <span className="usage-pill">{grades.remaining} of {grades.limit} AI grades left today</span>}
      </div>
    );
  }
  if (aiAvailable && !canUseServer) {
    return (
      <div className="card grading-banner">
        <span><strong>Sign in to unlock AI grading.</strong> As a guest you get a quick keyword-based rubric estimate, your work saves only in this browser{csp ? ", and your uploaded project isn't read" : ""}.</span>
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

function GradeCard({ result, onAsk }) {
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
      {result.corrections?.length > 0 && (
        <div className="corrections">
          <h4>Line-by-line fixes</h4>
          {result.corrections.map((c, i) => (
            <div className="correction" key={i}>
              {c.quote && <pre className="quote">{c.quote}</pre>}
              <p>{c.fix}</p>
            </div>
          ))}
        </div>
      )}
      {result.examTip && <div className="info-box"><strong>Exam tip:</strong> {result.examTip}</div>}
      {result.grader === "ai" && onAsk && (
        <button className="ai-inline-btn" onClick={onAsk}>Ask why this was marked wrong</button>
      )}
      <p className="muted small">Practice score only — not an official AP score.</p>
    </div>
  );
}
