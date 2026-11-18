import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../App.jsx";

const SECONDS_PER_QUESTION = { csp: 103, csa: 128, cyber: 80 };

function looksLikeCode(text) {
  return /\n/.test(text) && /[;{}()←]/.test(text);
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function newState(mode, length, extra = {}) {
  return { mode, status: "active", currentIndex: 0, answers: Array(length).fill(null), flagged: [], elapsed: 0, ...extra };
}

function scoreAttempt(course, questions, answers) {
  const unitBreakdown = {};
  course.unitMeta.forEach((u) => { unitBreakdown[u.id] = { unit: u.id, name: u.name, correct: 0, total: 0 }; });
  let correct = 0;
  questions.forEach((q, i) => {
    const row = unitBreakdown[q.unit] || (unitBreakdown[q.unit] = { unit: q.unit, name: `Unit ${q.unit}`, correct: 0, total: 0 });
    row.total += 1;
    if (answers[i] === q.correctAnswer) {
      correct += 1;
      row.correct += 1;
    }
  });
  Object.keys(unitBreakdown).forEach((k) => { if (unitBreakdown[k].total === 0) delete unitBreakdown[k]; });
  const percentage = Math.round((correct / questions.length) * 100);
  const band = percentage >= 85 ? "Exam ready!" : percentage >= 70 ? "Strong — keep sharpening" : percentage >= 50 ? "Getting there" : "Keep studying";
  return { correct, total: questions.length, percentage, band, unitBreakdown };
}

function useAllProgress() {
  const { store } = useApp();
  const [progress, setProgress] = useState(null);
  const reload = () => store.loadAllProgress().then(setProgress).catch(() => setProgress({}));
  useEffect(() => { reload(); }, [store]);
  return [progress, reload];
}

// ---------------------------------------------------------------- full practice exams
export function TestsTab({ course }) {
  const { store } = useApp();
  const [progress, reload] = useAllProgress();
  const [active, setActive] = useState(null);

  if (active) {
    return (
      <TestRunner
        course={course}
        title={active.test.title}
        questions={active.test.questions}
        progressKey={`${course.id}:${active.test.id}`}
        testId={active.test.id}
        initialState={active.state}
        timeLimit={(active.test.minutes || 90) * 60}
        onExit={() => { setActive(null); reload(); }}
      />
    );
  }

  async function start(test, mode, restart = false) {
    const key = `${course.id}:${test.id}`;
    const saved = progress?.[key];
    if (restart || !saved) {
      await store.clearProgress(key);
      setActive({ test, state: newState(mode, test.questions.length) });
    } else {
      setActive({ test, state: { ...newState(saved.mode || "practice", test.questions.length), ...saved } });
    }
  }

  return (
    <div className="test-grid">
      {course.tests.map((test) => {
        const saved = progress?.[`${course.id}:${test.id}`];
        const answered = saved?.answers?.filter((a) => a !== null && a !== undefined).length || 0;
        const total = test.questions.length;
        return (
          <article className="card test-card" key={test.id}>
            <p className="eyebrow">{total} questions, {test.minutes || 90} minutes</p>
            <h2>{test.title}</h2>
            <p>{test.description}</p>
            {saved && (
              <div className="mini-progress">
                <span>{saved.status === "done" ? "Completed — view results" : `${answered} / ${total} answered in ${saved.mode === "exam" ? "exam mode" : "practice mode"}`}</span>
                <div className="mini-progress-track"><div style={{ width: `${(answered / total) * 100}%` }} /></div>
              </div>
            )}
            <div className="button-row">
              {saved ? (
                <>
                  <button className="primary-btn" onClick={() => start(test)}>{saved.status === "done" ? "View results" : "Resume"}</button>
                  <button className="ghost-btn" onClick={() => start(test, saved.mode || "practice", true)}>Restart</button>
                </>
              ) : (
                <>
                  <button className="primary-btn" onClick={() => start(test, "exam")}>Exam mode (timed)</button>
                  <button className="secondary-btn" onClick={() => start(test, "practice")}>Practice mode</button>
                </>
              )}
            </div>
          </article>
        );
      })}
      <article className="card test-card mode-help">
        <h2>Exam vs practice</h2>
        <p><strong>Exam mode</strong> is timed like the real test. You can skip, flag, and change answers, and you only see your score at the end.</p>
        <p><strong>Practice mode</strong> shows the answer and explanation right after each question.</p>
      </article>
    </div>
  );
}

// ---------------------------------------------------------------- custom quiz builder
export function QuizTab({ course }) {
  const { store } = useApp();
  const [progress, reload] = useAllProgress();
  const pool = useMemo(() => course.tests.flatMap((t) => t.questions), [course]);
  const [units, setUnits] = useState(course.unitMeta.map((u) => u.id));
  const [count, setCount] = useState(15);
  const [mode, setMode] = useState("practice");
  const [active, setActive] = useState(null);
  const key = `${course.id}:custom`;

  const byId = useMemo(() => Object.fromEntries(pool.map((q) => [q.id, q])), [pool]);
  const available = pool.filter((q) => units.includes(q.unit)).length;
  const saved = progress?.[key];

  if (active) {
    return (
      <TestRunner
        course={course}
        title="Custom Quiz"
        questions={active.questionIds.map((id) => byId[id]).filter(Boolean)}
        progressKey={key}
        testId="custom"
        initialState={active}
        timeLimit={active.questionIds.length * (SECONDS_PER_QUESTION[course.id] || 90)}
        onExit={() => { setActive(null); reload(); }}
      />
    );
  }

  async function build() {
    const ids = shuffle(pool.filter((q) => units.includes(q.unit))).slice(0, count).map((q) => q.id);
    await store.clearProgress(key);
    setActive(newState(mode, ids.length, { questionIds: ids }));
  }

  const toggleUnit = (id) => setUnits((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]));

  return (
    <div className="quiz-builder-layout">
      <div className="card quiz-builder">
        <h2>Build a quiz from {pool.length} questions</h2>
        <p className="muted">Every quiz is a new random mix, so you can take as many as you want. Focus on your weakest units.</p>

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
        <div className="segmented">
          {[10, 15, 25, 40].map((n) => (
            <button key={n} className={count === n ? "active" : ""} onClick={() => setCount(n)}>{n}</button>
          ))}
        </div>

        <h3>Mode</h3>
        <div className="segmented">
          <button className={mode === "practice" ? "active" : ""} onClick={() => setMode("practice")}>Practice (instant feedback)</button>
          <button className={mode === "exam" ? "active" : ""} onClick={() => setMode("exam")}>Exam (timed)</button>
        </div>

        <div className="button-row">
          <button className="primary-btn" disabled={available === 0} onClick={build}>
            Start {Math.min(count, available)}-question quiz
          </button>
          {saved && saved.status !== "done" && saved.questionIds && (
            <button className="secondary-btn" onClick={() => setActive({ ...saved })}>Resume last quiz</button>
          )}
        </div>
        {units.length === 0 && <p className="error-box">Pick at least one unit.</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- shared runner
function TestRunner({ course, title, questions, progressKey, testId, initialState, timeLimit, onExit }) {
  const { store } = useApp();
  const [state, setState] = useState(initialState);
  const [view, setView] = useState(initialState.status === "done" ? "results" : "quiz");
  const stateRef = useRef(state);
  stateRef.current = state;
  const skipSave = useRef(false);
  const [confirming, setConfirming] = useState(false);

  const exam = state.mode === "exam";
  const question = questions[state.currentIndex];

  // Timer: counts elapsed seconds while the test is active.
  useEffect(() => {
    if (view !== "quiz" || state.status === "done") return undefined;
    const timer = setInterval(() => {
      setState((s) => ({ ...s, elapsed: (s.elapsed || 0) + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, [view, state.status]);

  // Save every 15 seconds and when leaving.
  useEffect(() => {
    const id = setInterval(() => store.saveProgress(progressKey, stateRef.current), 15000);
    return () => { clearInterval(id); if (!skipSave.current) store.saveProgress(progressKey, stateRef.current); };
  }, [progressKey, store]);

  const remaining = Math.max(0, timeLimit - (state.elapsed || 0));
  useEffect(() => {
    if (exam && view === "quiz" && state.status !== "done" && remaining === 0) finish(true);
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(patch) {
    const next = { ...stateRef.current, ...patch };
    setState(next);
    store.saveProgress(progressKey, next);
    return next;
  }

  function choose(index) {
    if (!exam && state.answers[state.currentIndex] !== null) return;
    const answers = [...state.answers];
    answers[state.currentIndex] = index;
    update({ answers });
  }

  function goTo(index) {
    update({ currentIndex: Math.max(0, Math.min(questions.length - 1, index)) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleFlag() {
    const flagged = state.flagged || [];
    update({ flagged: flagged.includes(state.currentIndex) ? flagged.filter((i) => i !== state.currentIndex) : [...flagged, state.currentIndex] });
  }

  async function finish(force = false) {
    const unanswered = stateRef.current.answers.filter((a) => a === null).length;
    if (!force && unanswered > 0) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    const done = update({ status: "done" });
    const result = scoreAttempt(course, questions, done.answers);
    await store.addAttempt({ course: course.id, testId, title, score: result.correct, total: result.total, unitBreakdown: result.unitBreakdown });
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function exitTest() {
    await store.saveProgress(progressKey, stateRef.current);
    onExit();
  }

  if (!question) {
    return <div className="card results-card"><p>No questions found.</p><button className="primary-btn" onClick={onExit}>Back</button></div>;
  }

  if (view === "results" || view === "review") {
    const result = scoreAttempt(course, questions, state.answers);
    if (view === "review") {
      return <Review course={course} questions={questions} answers={state.answers} onBack={() => setView("results")} />;
    }
    return (
      <div className="card results-card">
        <p className="eyebrow">{title}</p>
        <h1>Score: {result.correct} / {result.total}</h1>
        <div className="score-circle">{result.percentage}%</div>
        <h2>{result.band}</h2>
        <p className="muted">Time used: {formatTime(state.elapsed || 0)}. Use the unit breakdown to choose what to study next.</p>
        <div className="unit-breakdown">
          {Object.values(result.unitBreakdown).map((u) => (
            <div className={`unit-score unit-${u.unit}`} key={u.unit}>
              <strong>Unit {u.unit}</strong>
              <span>{u.name}</span>
              <b>{u.correct} / {u.total}</b>
            </div>
          ))}
        </div>
        <div className="button-row center">
          <button className="primary-btn" onClick={() => setView("review")}>Review answers</button>
          <button className="secondary-btn" onClick={async () => { skipSave.current = true; await store.clearProgress(progressKey); onExit(); }}>Clear & start over</button>
          <button className="ghost-btn" onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  const selected = state.answers[state.currentIndex];
  const revealed = !exam && selected !== null;
  const unit = course.unitMeta.find((u) => u.id === question.unit);
  const flagged = (state.flagged || []).includes(state.currentIndex);
  const answeredCount = state.answers.filter((a) => a !== null).length;

  return (
    <section className="quiz-page">
      <div className="quiz-top-row">
        <button className="ghost-btn" onClick={exitTest}>Save & exit</button>
        <span className={`unit-pill unit-${question.unit}`}>Unit {question.unit}: {unit?.name}</span>
        {exam ? (
          <span className={`timer ${remaining < 300 ? "low" : ""}`}>⏱ {formatTime(remaining)} left</span>
        ) : (
          <span className="timer muted-timer">⏱ {formatTime(state.elapsed || 0)}</span>
        )}
      </div>

      <div className="card quiz-card">
        <div className="progress-label">Question {state.currentIndex + 1} of {questions.length}, {answeredCount} answered</div>
        <div className="progress-track"><div style={{ width: `${((state.currentIndex + 1) / questions.length) * 100}%` }} /></div>
        <h2>{question.question.replace(/^Practice Test \d+, Question \d+:\s*/, "")}</h2>
        {question.code && <pre className="code-block">{question.code}</pre>}
        <div className="choices">
          {question.choices.map((choice, index) => {
            const isCorrect = index === question.correctAnswer;
            const classes = ["choice-btn"];
            if (revealed && isCorrect) classes.push("correct");
            if (revealed && selected === index && !isCorrect) classes.push("wrong");
            if (exam && selected === index) classes.push("selected");
            if (looksLikeCode(choice)) classes.push("mono");
            return (
              <button key={index} className={classes.join(" ")} onClick={() => choose(index)} disabled={revealed}>
                <strong>{String.fromCharCode(65 + index)}</strong> <span>{choice}</span>
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className={`explanation-box ${selected === question.correctAnswer ? "good" : "bad"}`}>
            <strong>{selected === question.correctAnswer ? "Correct." : `Not quite — the answer is ${String.fromCharCode(65 + question.correctAnswer)}.`}</strong> {question.explanation}
          </div>
        )}
        <div className="quiz-actions">
          {exam && <button className={`ghost-btn ${flagged ? "flag-on" : ""}`} onClick={toggleFlag}>{flagged ? "★ Flagged" : "☆ Flag for review"}</button>}
          <div className="button-row">
            <button className="secondary-btn" onClick={() => goTo(state.currentIndex - 1)} disabled={state.currentIndex === 0}>Previous</button>
            {state.currentIndex < questions.length - 1 ? (
              <button className="primary-btn" onClick={() => goTo(state.currentIndex + 1)} disabled={!exam && selected === null}>Next</button>
            ) : (
              <button className="primary-btn" onClick={() => finish()} disabled={!exam && selected === null}>Finish & score</button>
            )}
          </div>
        </div>
      </div>

      {confirming && (
        <div className="card confirm-card" role="alertdialog" aria-label="Submit with unanswered questions">
          <p><strong>{state.answers.filter((a) => a === null).length} question(s) are unanswered.</strong> Blank answers count as wrong. Submit anyway?</p>
          <div className="button-row">
            <button className="primary-btn" onClick={() => finish(true)}>Submit anyway</button>
            <button className="ghost-btn" onClick={() => setConfirming(false)}>Keep working</button>
          </div>
        </div>
      )}

      {exam && (
        <div className="card palette-card">
          <div className="palette-head">
            <strong>Question navigator</strong>
            <button className="primary-btn small-btn" onClick={() => finish()}>Submit exam</button>
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
                onClick={() => goTo(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="muted small">Dark = answered, highlighted = flagged</p>
        </div>
      )}
    </section>
  );
}

function Review({ course, questions, answers, onBack }) {
  const [filter, setFilter] = useState("wrong");
  const items = questions
    .map((q, i) => ({ q, i, selected: answers[i] }))
    .filter((item) => filter === "all" || item.selected !== item.q.correctAnswer);

  return (
    <section className="quiz-page">
      <div className="quiz-top-row">
        <button className="ghost-btn" onClick={onBack}>← Back to results</button>
        <div className="segmented compact">
          <button className={filter === "wrong" ? "active" : ""} onClick={() => setFilter("wrong")}>Missed only</button>
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All questions</button>
        </div>
      </div>
      {items.length === 0 && <div className="card results-card"><h2>No missed questions 🎉</h2></div>}
      {items.map(({ q, i, selected }) => (
        <div className="card quiz-card review-item" key={q.id || i}>
          <p className="eyebrow">Question {i + 1}, Unit {q.unit}: {course.unitMeta.find((u) => u.id === q.unit)?.name}</p>
          <h3>{q.question.replace(/^Practice Test \d+, Question \d+:\s*/, "")}</h3>
          {q.code && <pre className="code-block">{q.code}</pre>}
          <div className="choices">
            {q.choices.map((choice, ci) => (
              <div key={ci} className={`choice-review ${ci === q.correctAnswer ? "correct" : ""} ${selected === ci && ci !== q.correctAnswer ? "wrong" : ""} ${looksLikeCode(choice) ? "mono" : ""}`}>
                <strong>{String.fromCharCode(65 + ci)}</strong> {choice}
                {selected === ci && <em className="your-pick"> (your answer)</em>}
              </div>
            ))}
          </div>
          {selected === null && <p className="muted">You left this one blank.</p>}
          <div className="explanation-box"><strong>Explanation:</strong> {q.explanation}</div>
        </div>
      ))}
    </section>
  );
}

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}
