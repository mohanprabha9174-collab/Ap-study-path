import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { navigate, useApp } from "../App.jsx";
import { references } from "../data/references.js";
import { usePrefs } from "../lib/prefs.js";
import AiHelper from "../components/AiHelper.jsx";
import { HIGHLIGHT_COLORS, CodeView, HighlightText, ReferenceDrawer, Toast, formatTime, useCountUp } from "../components/ExamTools.jsx";

const SECONDS_PER_QUESTION = { csp: 103, csa: 128, cyber: 80 };
const TIME_OPTIONS = [
  { value: 1, label: "Standard" },
  { value: 1.5, label: "1.5× time" },
  { value: 2, label: "2× time" },
  { value: 0, label: "Untimed" }
];
const TEXT_SIZES = [0.9, 1, 1.15, 1.3];

function mcqStarters(answered, correct) {
  if (!answered) return ["Give me a hint (don't tell me the answer)", "What concept is this testing?", "How do I start tracing this?"];
  return [
    correct ? "Why is this the right answer?" : "Why was my answer wrong?",
    "Walk me through it step by step",
    "Give me a similar practice question"
  ];
}

// Choices that are code (multi-line, or one line with code punctuation) use the code font.
function looksLikeCode(text) {
  const t = String(text);
  if (/\n/.test(t)) return /[;{}()←]/.test(t);
  return /;\s*$|[{}]|\|\||&&|==|!=|\+\+|--|←|\[\d*\]|\w\(.*\)|^!\w/.test(t);
}
function cleanQuestion(text) {
  return text.replace(/^Practice Test \d+, Question \d+:\s*/, "");
}
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Bump when question order or answer positions change, so old saved answers aren't
// matched against different choices.
const DATA_VERSION = 2;
// Old or damaged saves (wrong version, answers not a list) start fresh instead of crashing.
const isStale = (saved) => Boolean(saved) && ((saved.v || 0) < DATA_VERSION || !Array.isArray(saved.answers));
const staleNotice = () => window.dispatchEvent(new CustomEvent("ap-notice", {
  detail: "The questions in this exam were updated since you saved it, so it starts fresh. Your past scores are still in My Progress."
}));

function newState(length, extra = {}) {
  return {
    v: DATA_VERSION,
    started: false, mode: "exam", timeMultiplier: 1, status: "active",
    currentIndex: 0, answers: Array(length).fill(null), flagged: [], eliminated: {}, highlights: {}, elapsed: 0,
    ...extra
  };
}

function scoreAttempt(course, questions, answers) {
  const unitBreakdown = {};
  course.unitMeta.forEach((u) => { unitBreakdown[u.id] = { unit: u.id, name: u.name, correct: 0, total: 0 }; });
  let correct = 0;
  questions.forEach((q, i) => {
    const row = unitBreakdown[q.unit] || (unitBreakdown[q.unit] = { unit: q.unit, name: `Unit ${q.unit}`, correct: 0, total: 0 });
    row.total += 1;
    if (answers[i] === q.correctAnswer) { correct += 1; row.correct += 1; }
  });
  Object.keys(unitBreakdown).forEach((k) => { if (unitBreakdown[k].total === 0) delete unitBreakdown[k]; });
  const percentage = Math.round((correct / questions.length) * 100);
  const band = percentage >= 85 ? "Exam ready" : percentage >= 70 ? "Strong — keep sharpening" : percentage >= 50 ? "Getting there" : "Keep studying";
  return { correct, total: questions.length, percentage, band, unitBreakdown };
}

function ProgressStatus({ progress, failed, onRetry }) {
  if (failed) {
    return (
      <div className="error-box" role="alert">
        Your saved progress didn't load, so starting is paused to protect it. <button className="link-btn inline" onClick={onRetry}>Try again</button>
      </div>
    );
  }
  if (!progress) return <p className="muted" role="status">Loading your saved progress…</p>;
  return null;
}

// "Custom quiz: Units 2 and 4" so history rows can be told apart.
function quizTitle(questions, allUnits) {
  const units = [...new Set(questions.map((q) => q.unit))].sort((a, b) => a - b);
  if (!units.length) return "Custom quiz";
  if (allUnits && units.length === allUnits) return "Custom quiz: All units";
  const list = units.length === 1 ? units[0] : `${units.slice(0, -1).join(", ")} and ${units[units.length - 1]}`;
  return `Custom quiz: Unit${units.length > 1 ? "s" : ""} ${list}`;
}

// Close a popover on Escape or a click outside it.
function useDismiss(ref, open, close) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) close(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [ref, open, close]);
}

// Clicking the tab you're already on starts that tab fresh (e.g. a new quiz after results).
function useTabReset(reset) {
  useEffect(() => {
    window.addEventListener("ap-tab-reset", reset);
    return () => window.removeEventListener("ap-tab-reset", reset);
  }, [reset]);
}

function useAllProgress() {
  const { store } = useApp();
  const [progress, setProgress] = useState(null);
  const [failed, setFailed] = useState(false);
  // A failed load must not look like "nothing saved": starting fresh would overwrite real progress.
  const reload = useCallback(() => {
    setFailed(false);
    return store.loadAllProgress().then(setProgress).catch(() => { setProgress(null); setFailed(true); });
  }, [store]);
  useEffect(() => { reload(); }, [reload]);
  return [progress, reload, failed];
}

// ================================================================ full practice exams
export function TestsTab({ course }) {
  const { store } = useApp();
  const [progress, reload, failed] = useAllProgress();
  const ready = Boolean(progress) && !failed;
  const [active, setActive] = useState(null);
  useTabReset(useCallback(() => { setActive(null); reload(); }, [reload]));

  if (active) {
    return (
      <TestRunner
        course={course}
        title={active.test.title}
        questions={active.test.questions}
        progressKey={`${course.id}:${active.test.id}`}
        testId={active.test.id}
        initialState={active.state}
        baseTimeLimit={(active.test.minutes || 90) * 60}
        onExit={() => { setActive(null); reload(); }}
      />
    );
  }

  async function open(test, restart = false) {
    if (!ready) return;
    const key = `${course.id}:${test.id}`;
    const saved = progress[key];
    if (restart) {
      const answered = saved?.answers?.filter((a) => a !== null && a !== undefined).length || 0;
      if (saved?.status !== "done" && answered > 0 && !window.confirm(`Start over? Your ${answered} saved ${answered === 1 ? "answer" : "answers"} for ${test.title} will be erased.`)) return;
      await store.clearProgress(key);
      setActive({ test, state: newState(test.questions.length) });
    } else if (!saved) {
      setActive({ test, state: newState(test.questions.length) });
    } else if (isStale(saved)) {
      await store.clearProgress(key);
      staleNotice();
      setActive({ test, state: newState(test.questions.length) });
    } else {
      setActive({ test, state: { ...newState(test.questions.length), started: true, ...saved } });
    }
  }

  return (
    <>
    <ProgressStatus progress={progress} failed={failed} onRetry={reload} />
    <p className="tools-note">Every exam has the test-day tools: highlighter, cross-out, mark for review, reference sheet and a timer you can hide.</p>
    <div className="test-grid">
      {course.tests.map((test) => {
        const saved = progress?.[`${course.id}:${test.id}`];
        const answered = saved?.answers?.filter((a) => a !== null && a !== undefined).length || 0;
        const total = test.questions.length;
        return (
          <article className={`card test-card ${saved ? (saved.status === "done" ? "is-done" : "is-started") : ""}`} key={test.id}>
            <span className={`test-status ${saved ? (saved.status === "done" ? "done" : "started") : "new"}`}>
              {saved ? (saved.status === "done" ? "Finished" : "In progress") : "Not started"}
            </span>
            <p className="eyebrow">{total} questions, {test.minutes || 90} minutes</p>
            <h2>{test.title}</h2>
            <p>{test.description}</p>
            {saved && (
              <div className="mini-progress">
                <span>{saved.status === "done" ? "Finished. Your results are saved." : `${answered} of ${total} answered in ${saved.mode === "exam" ? "exam mode" : "practice mode"}`}</span>
                {saved.status !== "done" && saved.mode === "exam" && saved.timeMultiplier > 0 && (() => {
                  // Exam mode's clock keeps running while away, so show what's actually left.
                  const limit = (test.minutes || 90) * 60 * saved.timeMultiplier;
                  const away = saved.lastActiveAt ? (Date.now() - saved.lastActiveAt) / 1000 : 0;
                  const left = Math.max(0, Math.round(limit - (saved.elapsed || 0) - away));
                  return <strong className={`card-clock ${left === 0 ? "out" : ""}`}>{left === 0 ? "Time's up: open it to see your results" : `${formatTime(left)} left on the clock (it keeps running)`}</strong>;
                })()}
                <div className="mini-progress-track"><div style={{ width: `${(answered / total) * 100}%` }} /></div>
              </div>
            )}
            <div className="button-row">
              {saved ? (
                <>
                  <button className="primary-btn" disabled={!ready} onClick={() => open(test)}>{saved.status === "done" ? "View results" : "Resume"}</button>
                  <button className="ghost-btn" disabled={!ready} onClick={() => open(test, true)}>Start over</button>
                </>
              ) : (
                <button className="primary-btn" disabled={!ready} onClick={() => open(test)}>Set up and start</button>
              )}
            </div>
          </article>
        );
      })}
    </div>
    </>
  );
}

// ================================================================ custom quiz builder
export function QuizTab({ course, initialUnits }) {
  const { store } = useApp();
  const [progress, reload, failed] = useAllProgress();
  const ready = Boolean(progress) && !failed;
  // Some practice-exam questions are near-copies with only an app name changed; a quiz uses
  // one of each, judged by having the same set of choices.
  const pool = useMemo(() => {
    const seen = new Set();
    return course.tests.flatMap((t) => t.questions).filter((q) => {
      const key = [...q.choices].sort().join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [course]);
  const [units, setUnits] = useState(() => {
    // #/csa/quiz/4 (or 1,3) pre-selects units, e.g. from "Quiz this unit" or the weakest-unit tip.
    const all = course.unitMeta.map((u) => u.id);
    const picked = String(initialUnits || "").split(",").map((x) => all.find((id) => String(id) === x.trim())).filter((id) => id !== undefined);
    return picked.length ? picked : all;
  });
  const [count, setCount] = useState(15);
  const [active, setActive] = useState(null);
  const key = `${course.id}:custom`;
  const byId = useMemo(() => Object.fromEntries(pool.map((q) => [q.id, q])), [pool]);
  const available = pool.filter((q) => units.includes(q.unit)).length;
  const saved = progress?.[key];
  useTabReset(useCallback(() => { setActive(null); reload(); }, [reload]));

  if (active) {
    return (
      <TestRunner
        course={course}
        title={quizTitle(active.questionIds.map((id) => byId[id]).filter(Boolean), course.unitMeta.length)}
        questions={active.questionIds.map((id) => byId[id]).filter(Boolean)}
        progressKey={key}
        testId="custom"
        initialState={active}
        baseTimeLimit={active.questionIds.length * (SECONDS_PER_QUESTION[course.id] || 90)}
        onExit={() => { setActive(null); reload(); }}
      />
    );
  }

  async function build() {
    if (!ready) return;
    if (saved && saved.status !== "done" && saved.questionIds && !window.confirm("Build a new quiz? Your unfinished quiz will be replaced once you start the new one.")) return;
    const ids = shuffle(pool.filter((q) => units.includes(q.unit))).slice(0, count).map((q) => q.id);
    // Nothing is cleared here: the old quiz is only replaced when the new one actually starts.
    setActive(newState(ids.length, { questionIds: ids, mode: "practice" }));
  }
  const toggleUnit = (id) => setUnits((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]));

  return (
    <div className="card quiz-builder">
      <h2>Build a quiz from {pool.length} questions</h2>
      <p className="muted">Every quiz is a new random mix. Pick the units you want to work on.</p>
      <ProgressStatus progress={progress} failed={failed} onRetry={reload} />

      <h3>Units</h3>
      <div className="unit-toggle-grid">
        {course.unitMeta.map((u) => {
          const n = pool.filter((q) => q.unit === u.id).length;
          return (
            <label key={u.id} className={`unit-toggle unit-${u.id} ${units.includes(u.id) ? "on" : ""}`}>
              <input type="checkbox" checked={units.includes(u.id)} onChange={() => toggleUnit(u.id)} />
              <span>Unit {u.id}: {u.name}</span>
              <small>{n} questions</small>
            </label>
          );
        })}
      </div>

      <h3>Number of questions</h3>
      <div className="segmented" role="radiogroup" aria-label="Number of questions">
        {[10, 15, 25, 40].map((n) => (
          <button key={n} role="radio" aria-checked={count === n} className={count === n ? "active" : ""} onClick={() => setCount(n)}>{n}</button>
        ))}
      </div>

      <div className="button-row">
        <button className="primary-btn" disabled={available === 0 || !ready} onClick={build}>{available === 0 ? "Pick at least one unit" : `Set up a ${Math.min(count, available)}-question quiz`}</button>
        {saved && saved.status !== "done" && saved.questionIds && (
          <button className="secondary-btn" onClick={() => {
            if (isStale(saved)) { store.clearProgress(key); staleNotice(); reload(); return; }
            setActive({ ...newState(saved.questionIds.length), started: true, ...saved });
          }}>Resume last quiz</button>
        )}
      </div>
      {units.length === 0 && <p className="error-box">Pick at least one unit.</p>}
    </div>
  );
}

// ================================================================ the exam runner
function TestRunner({ course, title, questions, progressKey, testId, initialState, baseTimeLimit, onExit }) {
  const { store } = useApp();
  const [prefs, setPrefs] = usePrefs();
  // In timed exam mode the clock keeps running while the student is away, like the real exam.
  // Practice mode still pauses.
  const [awayNote] = useState(() => {
    const s = initialState;
    if (s.mode !== "exam" || !(s.timeMultiplier > 0) || !s.started || s.status === "done" || !s.lastActiveAt) return 0;
    return Math.max(0, Math.floor((Date.now() - s.lastActiveAt) / 1000));
  });
  const [state, setState] = useState(() => (awayNote ? { ...initialState, elapsed: (initialState.elapsed || 0) + awayNote } : initialState));
  const persist = (s) => store.saveProgress(progressKey, { ...s, lastActiveAt: Date.now() });
  const [view, setView] = useState(initialState.status === "done" ? "results" : initialState.started ? "quiz" : "setup");
  const [highlighter, setHighlighter] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navRef = useRef(null);
  const settingsRef = useRef(null);
  const closeNav = useCallback(() => setNavOpen(false), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  useDismiss(navRef, navOpen, closeNav);
  useDismiss(settingsRef, settingsOpen, closeSettings);
  const [toast, setToast] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;
  const skipSave = useRef(false);
  const warned = useRef(false);
  const [forceTimer, setForceTimer] = useState(false);
  const clearToast = useCallback(() => setToast(""), []);
  useEffect(() => {
    if (awayNote >= 60) setToast(`Exam mode: the clock kept running while you were away (${Math.round(awayNote / 60)} min).`);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const reference = references[course.id];
  const exam = state.mode === "exam";
  const timed = state.timeMultiplier > 0;
  const timeLimit = Math.round(baseTimeLimit * (state.timeMultiplier || 1));
  const remaining = Math.max(0, timeLimit - (state.elapsed || 0));
  const question = questions[state.currentIndex];

  useEffect(() => {
    if (view !== "quiz" && view !== "check") return undefined;
    const id = setInterval(() => setState((s) => ({ ...s, elapsed: (s.elapsed || 0) + 1 })), 1000);
    return () => clearInterval(id);
  }, [view]);

  useEffect(() => {
    const id = setInterval(() => { if (stateRef.current.started) persist(stateRef.current); }, 15000);
    return () => { clearInterval(id); if (!skipSave.current && stateRef.current.started) persist(stateRef.current); };
  }, [progressKey, store]);

  useEffect(() => {
    if (!timed || (view !== "quiz" && view !== "check")) return;
    if (remaining <= 300 && remaining > 0 && !warned.current) {
      warned.current = true;
      setToast("5 minutes remaining.");
      // Show the clock for the rest of this exam without changing the saved setting.
      setForceTimer(true);
    }
    if (remaining === 0) {
      update({ timedOut: true });
      finish(true);
    }
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(patch) {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;
    setState(next);
    if (next.started) persist(next);
    return next;
  }

  const choose = useCallback((index) => {
    const s = stateRef.current;
    if (s.mode !== "exam" && s.answers[s.currentIndex] !== null) return;
    const answers = [...s.answers];
    answers[s.currentIndex] = answers[s.currentIndex] === index && s.mode === "exam" ? null : index;
    const elim = { ...(s.eliminated || {}) };
    if (elim[s.currentIndex]?.includes(index)) elim[s.currentIndex] = elim[s.currentIndex].filter((i) => i !== index);
    update({ answers, eliminated: elim });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleEliminate(index) {
    const s = stateRef.current;
    const list = s.eliminated?.[s.currentIndex] || [];
    const nextList = list.includes(index) ? list.filter((i) => i !== index) : [...list, index];
    const answers = [...s.answers];
    if (s.mode === "exam" && answers[s.currentIndex] === index && !list.includes(index)) answers[s.currentIndex] = null;
    update({ eliminated: { ...s.eliminated, [s.currentIndex]: nextList }, answers });
  }

  function setHighlights(key, ranges) {
    update({ highlights: { ...(stateRef.current.highlights || {}), [key]: ranges } });
  }

  const goTo = useCallback((index) => {
    setNavOpen(false);
    update({ currentIndex: Math.max(0, Math.min(questions.length - 1, index)) });
    setView("quiz");
  }, [questions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleFlag() {
    const s = stateRef.current;
    const flagged = s.flagged || [];
    update({ flagged: flagged.includes(s.currentIndex) ? flagged.filter((i) => i !== s.currentIndex) : [...flagged, s.currentIndex] });
  }

  async function finish(force = false) {
    const s = stateRef.current;
    if (s.status === "done") return;
    const unanswered = s.answers.filter((a) => a === null).length;
    if (!force && unanswered > 0 && prefs.confirmSubmit) { setConfirming(true); return; }
    setConfirming(false);
    const done = update({ status: "done" });
    const result = scoreAttempt(course, questions, done.answers);
    await store.addAttempt({ course: course.id, testId, title, score: result.correct, total: result.total, unitBreakdown: result.unitBreakdown });
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function exitTest() {
    if (stateRef.current.started) await persist(stateRef.current);
    onExit();
  }

  useEffect(() => {
    if (view !== "quiz") return undefined;
    const onKey = (e) => {
      if (e.target.closest("input, textarea, select, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      // Shortcuts are off while a panel is open, so typing there never changes an answer.
      if (refOpen || aiOpen || settingsOpen || navOpen || confirming) return;
      const s = stateRef.current;
      if (e.key === "ArrowRight") { e.preventDefault(); if (s.currentIndex < questions.length - 1) goTo(s.currentIndex + 1); else setView("check"); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(s.currentIndex - 1); }
      else if (/^[a-d]$/i.test(e.key)) {
        const idx = e.key.toLowerCase().charCodeAt(0) - 97;
        // A repeated key keeps the answer; only a click on the chosen bubble clears it.
        if (idx < questions[s.currentIndex].choices.length && s.answers[s.currentIndex] !== idx) choose(idx);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, questions, goTo, choose, refOpen, aiOpen, settingsOpen, navOpen, confirming]);

  if (view === "setup") {
    return (
      <SetupScreen
        course={course} title={title} count={questions.length} baseTimeLimit={baseTimeLimit}
        state={state} setState={setState} prefs={prefs} setPrefs={setPrefs} hasReference={Boolean(reference)}
        onBack={onExit}
        onBegin={() => { update({ started: true }); setView("quiz"); }}
      />
    );
  }

  if (view === "results") {
    return (
      <Results
        course={course} title={title} questions={questions} state={state} timeLimit={timeLimit}
        onReview={() => setView("review")}
        onRestart={async () => {
          if (!window.confirm("Start over? This attempt's answers will be cleared. Your score stays in My Progress.")) return;
          skipSave.current = true;
          await store.clearProgress(progressKey);
          onExit();
        }}
        onExit={onExit}
      />
    );
  }

  if (view === "review") {
    return <Review course={course} questions={questions} answers={state.answers} onBack={() => setView("results")} />;
  }

  const answeredCount = state.answers.filter((a) => a !== null).length;
  const textStyle = { "--q-scale": prefs.textScale };

  const header = (
    <div className="exam-bar">
      <div className="exam-bar-left">
        <strong>{title}</strong>
        <button className="bar-btn" onClick={exitTest}>Save and exit</button>
      </div>
      <div className="exam-bar-center">
        {timed ? (
          <>
            {prefs.showTimer || forceTimer ? (
              <span className={`exam-timer ${remaining <= 300 ? "low" : ""}`}>{formatTime(remaining)}</span>
            ) : (
              <span className="exam-timer hidden-timer" aria-label="Timer hidden">Timer hidden</span>
            )}
            <button className="bar-btn" onClick={() => setPrefs({ showTimer: !prefs.showTimer })}>{prefs.showTimer ? "Hide" : "Show"}</button>
          </>
        ) : (
          <span className="exam-timer untimed">Untimed</span>
        )}
      </div>
      <div className="exam-bar-right">
        <button className={`tool-btn ${highlighter ? "on" : ""}`} onClick={() => setHighlighter(!highlighter)} aria-pressed={highlighter} title="Highlighter: select text to highlight it">
          <span className="swatch" style={{ background: HIGHLIGHT_COLORS[prefs.highlightColor] }} /> Highlight
        </button>
        {reference && <button className={`tool-btn ${refOpen ? "on" : ""}`} onClick={() => setRefOpen(true)}>Reference</button>}
        {!exam && view === "quiz" && <button className={`tool-btn ai-tool ${aiOpen ? "on" : ""}`} onClick={() => setAiOpen(true)}>Ask AI</button>}
        <div className="text-size" role="group" aria-label="Text size">
          <button className="tool-btn" aria-label="Smaller text" disabled={prefs.textScale <= TEXT_SIZES[0]} onClick={() => setPrefs({ textScale: TEXT_SIZES[Math.max(0, TEXT_SIZES.indexOf(prefs.textScale) - 1)] })}>A−</button>
          <button className="tool-btn" aria-label="Larger text" disabled={prefs.textScale >= TEXT_SIZES[TEXT_SIZES.length - 1]} onClick={() => setPrefs({ textScale: TEXT_SIZES[Math.min(TEXT_SIZES.length - 1, TEXT_SIZES.indexOf(prefs.textScale) + 1)] })}>A+</button>
        </div>
        <div className="popover-anchor" ref={settingsRef}>
          <button className={`tool-btn ${settingsOpen ? "on" : ""}`} onClick={() => setSettingsOpen(!settingsOpen)} aria-expanded={settingsOpen}>Settings</button>
          {settingsOpen && <SettingsPopover prefs={prefs} setPrefs={setPrefs} onClose={() => setSettingsOpen(false)} />}
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="exam-footer">
      <span className="footer-left muted small">{answeredCount} of {questions.length} answered</span>
      <div className="popover-anchor center" ref={navRef}>
        <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen}>
          {view === "check" ? "Check your work" : `Question ${state.currentIndex + 1} of ${questions.length}`} <span className={`caret ${navOpen ? "up" : ""}`}>▾</span>
        </button>
        {navOpen && (
          <div className="nav-popover">
            <Navigator questions={questions} state={state} onPick={goTo} />
            <button className="secondary-btn small-btn" onClick={() => { setNavOpen(false); setView("check"); }}>Go to review page</button>
          </div>
        )}
      </div>
      <div className="button-row">
        {view === "check" ? (
          <>
            <button className="ghost-btn" onClick={() => goTo(state.currentIndex)}>Back to question {state.currentIndex + 1}</button>
            <button className="primary-btn" onClick={() => finish()}>Submit</button>
          </>
        ) : (
          <>
            <button className="ghost-btn" onClick={() => goTo(state.currentIndex - 1)} disabled={state.currentIndex === 0}>Back</button>
            <button className="primary-btn" onClick={() => (state.currentIndex < questions.length - 1 ? goTo(state.currentIndex + 1) : setView("check"))}>Next</button>
          </>
        )}
      </div>
    </div>
  );

  if (view === "check") {
    const unanswered = state.answers.filter((a) => a === null).length;
    const flagged = (state.flagged || []).length;
    return (
      <section className="exam-shell" style={textStyle}>
        {header}
        <div className="exam-body">
          <div className="card check-card pop-in">
            <h2>Check your work</h2>
            <p>Go back to anything you skipped or marked for review. When you're ready, submit.</p>
            <div className="check-stats">
              <div><strong>{answeredCount}</strong><span>answered</span></div>
              <div className={unanswered ? "warn" : ""}><strong>{unanswered}</strong><span>unanswered</span></div>
              <div><strong>{flagged}</strong><span>marked for review</span></div>
            </div>
            <Navigator questions={questions} state={state} onPick={goTo} large />
            {confirming && (
              <div className="confirm-card pop-in" role="alertdialog" aria-label="Submit with unanswered questions" ref={(el) => el?.scrollIntoView({ block: "center", behavior: "smooth" })}>
                <p><strong>{unanswered} question{unanswered === 1 ? " is" : "s are"} unanswered.</strong> Blank answers count as wrong.</p>
                <div className="button-row">
                  <button className="primary-btn" onClick={() => finish(true)}>Submit anyway</button>
                  <button className="ghost-btn" onClick={() => setConfirming(false)}>Keep working</button>
                </div>
              </div>
            )}
          </div>
        </div>
        {footer}
        <ReferenceDrawer reference={reference} open={refOpen} onClose={() => setRefOpen(false)} />
        <Toast message={toast} onDone={clearToast} />
      </section>
    );
  }

  const selected = state.answers[state.currentIndex];
  const revealed = !exam && selected !== null;
  const unit = course.unitMeta.find((u) => u.id === question.unit);
  const isFlagged = (state.flagged || []).includes(state.currentIndex);
  const eliminated = state.eliminated?.[state.currentIndex] || [];
  const hl = state.highlights || {};
  const qKey = `${state.currentIndex}`;

  return (
    <section className="exam-shell" style={textStyle}>
      {header}
      <div className="exam-body">
        <div className="question-pane card" key={state.currentIndex}>
          <div className="question-head">
            <span className="q-number">{state.currentIndex + 1}</span>
            <button className={`flag-btn ${isFlagged ? "on" : ""}`} onClick={toggleFlag} aria-pressed={isFlagged}>
              <span className="flag-icon" aria-hidden="true">⚑</span> {isFlagged ? "Marked for review" : "Mark for review"}
            </button>
            <span className={`unit-pill unit-${question.unit}`}>Unit {question.unit}: {unit?.name}</span>
            {!exam && <span className="mode-chip">Practice mode</span>}
          </div>

          <HighlightText
            className="q-text" text={cleanQuestion(question.question)} ranges={hl[`${qKey}:q`]}
            active={highlighter} color={prefs.highlightColor} onChange={(r) => setHighlights(`${qKey}:q`, r)}
          />
          {question.code && (
            <HighlightText
              as="pre" code className="code-block q-code" text={question.code} ranges={hl[`${qKey}:c`]}
              active={highlighter} color={prefs.highlightColor} onChange={(r) => setHighlights(`${qKey}:c`, r)}
            />
          )}
          {highlighter && <p className="tool-hint">Highlighter is on. Select words to highlight them; click a highlight to remove it.</p>}

          <div className="choices" role="radiogroup" aria-label="Answer choices">
            {question.choices.map((choice, index) => {
              const isCorrect = index === question.correctAnswer;
              const isOut = eliminated.includes(index);
              const cls = ["choice-btn"];
              if (revealed && isCorrect) cls.push("correct");
              if (revealed && selected === index && !isCorrect) cls.push("wrong");
              if (exam && selected === index) cls.push("selected");
              if (isOut) cls.push("eliminated");
              if (looksLikeCode(choice)) cls.push("mono");
              return (
                <div className="choice-row" key={index}>
                  <button role="radio" aria-checked={selected === index} className={cls.join(" ")} onClick={() => choose(index)} disabled={revealed}>
                    <strong>{String.fromCharCode(65 + index)}</strong> <span>{choice}</span>
                  </button>
                  {prefs.eliminator && !revealed && (
                    <button
                      className={`strike-btn ${isOut ? "on" : ""}`} onClick={() => toggleEliminate(index)}
                      aria-label={`${isOut ? "Undo cross out" : "Cross out"} choice ${String.fromCharCode(65 + index)}`}
                      title={isOut ? "Undo" : "Cross out this choice"}
                    >
                      {isOut ? "Undo" : <s>{String.fromCharCode(65 + index)}</s>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {revealed && (
            <div className={`explanation-box reveal ${selected === question.correctAnswer ? "good" : "bad"}`}>
              <strong>{selected === question.correctAnswer ? "Correct." : `Not quite. The answer is ${String.fromCharCode(65 + question.correctAnswer)}.`}</strong> {question.explanation}
            </div>
          )}
          {!exam && (
            <button className="ai-inline-btn" onClick={() => setAiOpen(true)}>
              <span className="ai-badge">AI</span> {revealed ? (selected === question.correctAnswer ? "Ask the AI to go deeper" : "Ask the AI why you missed it") : "Stuck? Get a hint from the AI"}
            </button>
          )}
          {!exam && !revealed && <p className="lock-hint">Practice mode: your first pick locks in and shows the answer.</p>}
          <p className="shortcut-hint muted small">Keyboard: A–D to answer, ← and → to move between questions.</p>
        </div>
      </div>
      {footer}
      {!exam && (
        <AiHelper
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          course={course}
          context={{ key: `q:${question.id}`, label: `Question ${state.currentIndex + 1}`, kind: "mcq", questionId: question.id, studentChoice: selected, answered: revealed }}
          starters={mcqStarters(revealed, selected === question.correctAnswer)}
        />
      )}
      <ReferenceDrawer reference={reference} open={refOpen} onClose={() => setRefOpen(false)} />
      <Toast message={toast} onDone={clearToast} />
    </section>
  );
}

function SetupScreen({ course, title, count, baseTimeLimit, state, setState, prefs, setPrefs, hasReference, onBack, onBegin }) {
  const set = (patch) => setState((s) => ({ ...s, ...patch }));
  const minutes = (m) => (m === 0 ? "No time limit" : `${Math.round((baseTimeLimit * m) / 60)} minutes`);
  return (
    <div className="setup card pop-in">
      <button className="link-btn" onClick={onBack}>Back to {course.short}</button>
      <h1>{title}</h1>
      <p className="muted">{count} questions. Your answers save automatically, so you can leave and come back.</p>

      <div className="setup-grid">
        <fieldset>
          <legend>How do you want to take it?</legend>
          <label className={`choice-card ${state.mode === "exam" ? "on" : ""}`}>
            <input type="radio" name="mode" checked={state.mode === "exam"} onChange={() => set({ mode: "exam" })} />
            <span><strong>Exam mode</strong>Answers stay hidden until you submit. You can skip, change answers, and come back. The timer keeps running if you leave, like the real exam.</span>
          </label>
          <label className={`choice-card ${state.mode === "practice" ? "on" : ""}`}>
            <input type="radio" name="mode" checked={state.mode === "practice"} onChange={() => set({ mode: "practice" })} />
            <span><strong>Practice mode</strong>See the correct answer and explanation right after each question. Your first pick locks in, so choose carefully.</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Time limit</legend>
          <div className="time-options">
            {TIME_OPTIONS.map((opt) => (
              <label key={opt.label} className={`choice-card compact ${state.timeMultiplier === opt.value ? "on" : ""}`}>
                <input type="radio" name="time" checked={state.timeMultiplier === opt.value} onChange={() => set({ timeMultiplier: opt.value })} />
                <span><strong>{opt.label}</strong>{minutes(opt.value)}</span>
              </label>
            ))}
          </div>
          <p className="muted small">1.5× and 2× match common testing accommodations.</p>
        </fieldset>
      </div>

      <h2 className="setup-h">Your tools</h2>
      <ul className="tools-list">
        <li><strong>Highlight:</strong> turn it on, then select words in the question or code.</li>
        <li><strong>Cross out:</strong> strike through choices you've ruled out.</li>
        <li><strong>Mark for review:</strong> flag a question and find it later on the review page.</li>
        <li><strong>Hide timer:</strong> hide it any time. It comes back at 5 minutes remaining.</li>
        {hasReference && <li><strong>Reference:</strong> open the {course.id === "csa" ? "Java methods" : course.id === "csp" ? "pseudocode" : "study"} reference in a side panel.</li>}
      </ul>

      <div className="setup-prefs">
        <label className="switch"><input type="checkbox" checked={prefs.showTimer} onChange={(e) => setPrefs({ showTimer: e.target.checked })} /> Show the timer</label>
        <label className="switch"><input type="checkbox" checked={prefs.eliminator} onChange={(e) => setPrefs({ eliminator: e.target.checked })} /> Show cross-out buttons</label>
        <label className="switch"><input type="checkbox" checked={prefs.reduceMotion} onChange={(e) => setPrefs({ reduceMotion: e.target.checked })} /> Reduce animations</label>
        <span className="size-pick">Text size
          {TEXT_SIZES.map((s) => (
            <button key={s} className={`size-dot ${prefs.textScale === s ? "on" : ""}`} style={{ fontSize: `${s}rem` }} onClick={() => setPrefs({ textScale: s })} aria-label={`Text size ${Math.round(s * 100)}%`}>A</button>
          ))}
        </span>
      </div>

      <button className="primary-btn big-btn" onClick={onBegin}>Begin {state.mode === "exam" ? "exam" : "practice"}</button>
    </div>
  );
}

function SettingsPopover({ prefs, setPrefs, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="settings-popover pop-in" role="dialog" aria-label="Test settings">
      <div className="popover-row">
        <span>Highlight color</span>
        <div className="swatches">
          {Object.entries(HIGHLIGHT_COLORS).map(([name, hex]) => (
            <button key={name} className={`swatch-btn ${prefs.highlightColor === name ? "on" : ""}`} style={{ background: hex }} onClick={() => setPrefs({ highlightColor: name })} aria-label={`${name} highlighter`} />
          ))}
        </div>
      </div>
      <label className="switch"><input type="checkbox" checked={prefs.showTimer} onChange={(e) => setPrefs({ showTimer: e.target.checked })} /> Show timer</label>
      <label className="switch"><input type="checkbox" checked={prefs.eliminator} onChange={(e) => setPrefs({ eliminator: e.target.checked })} /> Cross-out buttons</label>
      <label className="switch"><input type="checkbox" checked={prefs.confirmSubmit} onChange={(e) => setPrefs({ confirmSubmit: e.target.checked })} /> Warn before submitting blanks</label>
      <label className="switch"><input type="checkbox" checked={prefs.reduceMotion} onChange={(e) => setPrefs({ reduceMotion: e.target.checked })} /> Reduce animations</label>
      <button className="link-btn" onClick={onClose}>Done</button>
    </div>
  );
}

function Navigator({ questions, state, onPick, large }) {
  return (
    <div className={`navigator ${large ? "large" : ""}`}>
      <div className="nav-legend small">
        <span><i className="lg current" /> Current</span>
        <span><i className="lg unanswered" /> Unanswered</span>
        <span><i className="lg flagged" /> For review</span>
      </div>
      <div className="palette">
        {questions.map((_, i) => (
          <button
            key={i}
            className={[
              state.answers[i] !== null ? "answered" : "",
              (state.flagged || []).includes(i) ? "flagged" : "",
              i === state.currentIndex ? "current" : ""
            ].join(" ")}
            onClick={() => onPick(i)}
            aria-label={`Question ${i + 1}${state.answers[i] === null ? ", unanswered" : ""}${(state.flagged || []).includes(i) ? ", marked for review" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function Results({ course, title, questions, state, onReview, onRestart, onExit, timeLimit }) {
  const result = scoreAttempt(course, questions, state.answers);
  const shown = useCountUp(result.percentage);
  // Weakest unit: lowest score, and on a tie the one with the most questions missed.
  const weakUnit = Object.values(result.unitBreakdown).filter((u) => u.total > 0 && u.correct < u.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total || (b.total - b.correct) - (a.total - a.correct))[0];
  const blank = state.answers.filter((a) => a === null || a === undefined).length;
  const limit = state.timeMultiplier > 0 ? timeLimit : 0;
  return (
    <div className="card results-card pop-in">
      <p className="eyebrow">{title}</p>
      <div className="score-ring" style={{ "--pct": shown }}>
        <span>{shown}%</span>
      </div>
      <h1>{result.correct} of {result.total} correct</h1>
      <h2>{result.band}</h2>
      {state.timedOut && <p className="info-box" role="status">Time ran out, so your answers were submitted automatically.</p>}
      <p className="muted">
        Time used: {formatTime(limit ? Math.min(state.elapsed || 0, limit) : state.elapsed || 0)}.
        {blank > 0 && <> <strong>{blank} {blank === 1 ? "question was" : "questions were"} left blank.</strong></>}
        {" "}Start your next quiz with your weakest unit.
      </p>
      <div className="unit-breakdown">
        {Object.values(result.unitBreakdown).map((u) => (
          <div className={`unit-score unit-${u.unit}`} key={u.unit}>
            <strong>Unit {u.unit}</strong>
            <span>{u.name}</span>
            <b>{u.correct} / {u.total}</b>
            <div className="bar-track"><div className="bar-fill grow" style={{ width: `${(u.correct / u.total) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="button-row center">
        <button className="primary-btn" onClick={onReview}>Review answers</button>
        {weakUnit && (
          <button className="secondary-btn" onClick={() => {
            const target = `#/${course.id}/quiz/${weakUnit.unit}`;
            // Already on that page (a quiz's own results): start a fresh builder instead.
            if (window.location.hash === target) window.dispatchEvent(new CustomEvent("ap-tab-reset"));
            else navigate(target.slice(1));
          }}>Quiz Unit {weakUnit.unit}</button>
        )}
        <button className="ghost-btn" onClick={onRestart}>Start over</button>
        <button className="ghost-btn" onClick={onExit}>Back to {course.short}</button>
      </div>
    </div>
  );
}

function Review({ course, questions, answers, onBack }) {
  const [filter, setFilter] = useState("wrong");
  const [aiItem, setAiItem] = useState(null);
  const items = questions
    .map((q, i) => ({ q, i, selected: answers[i] }))
    .filter((item) => filter === "all" || item.selected !== item.q.correctAnswer);

  return (
    <section className="quiz-page">
      <div className="quiz-top-row">
        <button className="ghost-btn" onClick={onBack}>Back to results</button>
        <div className="segmented compact">
          <button className={filter === "wrong" ? "active" : ""} onClick={() => setFilter("wrong")}>Missed or skipped</button>
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All questions</button>
        </div>
      </div>
      {items.length === 0 && <div className="card results-card"><h2>You didn't miss any.</h2></div>}
      {items.map(({ q, i, selected }) => (
        <div className="card quiz-card review-item" key={q.id || i}>
          <p className="eyebrow">Question {i + 1}, Unit {q.unit}: {course.unitMeta.find((u) => u.id === q.unit)?.name}</p>
          <h3>{cleanQuestion(q.question)}</h3>
          {q.code && <CodeView code={q.code} />}
          <div className="choices">
            {q.choices.map((choice, ci) => (
              <div key={ci} className={`choice-review ${ci === q.correctAnswer ? "correct" : ""} ${selected === ci && ci !== q.correctAnswer ? "wrong" : ""} ${looksLikeCode(choice) ? "mono" : ""}`}>
                <strong>{String.fromCharCode(65 + ci)}</strong> <span>{choice}</span>
                {selected === ci && <em className="your-pick">Your answer</em>}
              </div>
            ))}
          </div>
          {selected === null && <p className="muted">You left this one blank.</p>}
          <div className="explanation-box"><strong>Why:</strong> {q.explanation}</div>
          <button className="ai-inline-btn" onClick={() => setAiItem({ q, i, selected })}>
            <span className="ai-badge">AI</span> {selected === q.correctAnswer ? "Ask the AI to explain more" : "Ask the AI why you missed it"}
          </button>
        </div>
      ))}
      {aiItem && (
        <AiHelper
          open={Boolean(aiItem)}
          onClose={() => setAiItem(null)}
          course={course}
          context={{ key: `q:${aiItem.q.id}`, label: `Question ${aiItem.i + 1}`, kind: "mcq", questionId: aiItem.q.id, studentChoice: aiItem.selected, answered: true }}
          starters={mcqStarters(true, aiItem.selected === aiItem.q.correctAnswer)}
        />
      )}
    </section>
  );
}
