import { useEffect, useMemo, useState } from "react";
import { practiceTests, unitMeta } from "./data/practiceTests.js";
import { frqs, pprChecklist } from "./data/frqs.js";
import { units } from "./data/units.js";

const pageLinks = [
  { id: "home", label: "Home" },
  { id: "practice", label: "Practice Tests" },
  { id: "frq", label: "FRQ Practice" },
  { id: "units", label: "Units" }
];

const AUTH_KEY = "ap-study-path-auth-user";
const USERS_KEY = "ap-study-path-users-v1";

function loadStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}


function loadStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

function storageKey(testId) {
  return `ap-study-path-ap-csp-progress-${testId}`;
}

function saveProgress(testId, state) {
  localStorage.setItem(storageKey(testId), JSON.stringify(state));
}

function loadProgress(testId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(testId)) || "null");
  } catch {
    return null;
  }
}

function clearProgress(testId) {
  localStorage.removeItem(storageKey(testId));
}

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => loadStoredUser());

  function goTo(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLogin({ email }) {
    const nextUser = {
      email: email.trim().toLowerCase(),
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    setPage("home");
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <Navbar page={page} goTo={goTo} user={user} onLogout={handleLogout} />
      <main>
        {page === "home" && <Home goTo={goTo} user={user} />}
        {page === "practice" && <PracticeTests />}
        {page === "frq" && <FrqPractice />}
        {page === "units" && <UnitsPage />}
      </main>
      <footer className="site-footer">
        <p>AP Study Path • AP CSP Study is available now, with more AP course sections planned.</p>
      </footer>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const normalizedEmail = email.trim().toLowerCase();
  const users = loadStoredUsers();
  const accountExists = Boolean(users[normalizedEmail]);

  function validEmail(value) {
    return value.includes("@") && value.includes(".");
  }

  async function submitLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!validEmail(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const savedUsers = loadStoredUsers();
    const savedAccount = savedUsers[normalizedEmail];
    const passwordHash = await hashPassword(password);

    if (!savedAccount) {
      if (confirmPassword !== password) {
        setError("This is a new account. Re-type the same password in Confirm Password to create it.");
        return;
      }

      savedUsers[normalizedEmail] = {
        email: normalizedEmail,
        passwordHash,
        createdAt: new Date().toISOString()
      };
      saveStoredUsers(savedUsers);
      setMessage("Account created. Signing you in now.");
      onLogin({ email: normalizedEmail });
      return;
    }

    if (savedAccount.passwordHash !== passwordHash) {
      setError("Wrong password. Click Try Again and enter the password linked to this email.");
      return;
    }

    onLogin({ email: normalizedEmail });
  }

  return (
    <main className="auth-page">
      <section className="card auth-card">
        <div className="auth-copy">
          <p className="eyebrow">Student Account</p>
          <h1>Welcome to AP Study Path</h1>
          <p>Enter your email and password to access your AP Study Path practice dashboard. AP CSP is the first full course section, and more AP subjects can be added later.</p>
          <div className="auth-highlights">
            <span>Saved account</span>
            <span>Password check</span>
            <span>No API key needed</span>
          </div>
        </div>

        <form className="login-form" onSubmit={submitLogin}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="student@example.com"
            autoComplete="email"
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          {!accountExists && validEmail(normalizedEmail) && (
            <>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-type password for new account"
                autoComplete="new-password"
              />
              <p className="login-note">New email detected. Confirm your password once to create the account.</p>
            </>
          )}

          {error && <div className="error-box">{error}</div>}
          {message && <div className="success-box">{message}</div>}

          <button className="primary-btn" type="submit">{accountExists ? "Sign In" : "Create Account"}</button>
          <div className="button-row auth-buttons">
            <button
              className="secondary-btn"
              type="button"
              onClick={() => {
                setPassword("");
                setConfirmPassword("");
                setError("Try again with the password linked to this email.");
                setMessage("");
              }}
            >
              Try Again
            </button>
          </div>
          <p className="login-note">Beginner project note: this saves accounts in this browser using a password hash. There is no forgot-password flow in this version. A real public website would use a secure backend database.</p>
        </form>
      </section>
    </main>
  );
}

function Navbar({ page, goTo, user, onLogout }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => goTo("home")} aria-label="Go to home">
        <span className="brand-mark">AP</span>
        <span>AP Study Path</span>
      </button>
      <div className="nav-area">
        <nav className="nav-links" aria-label="Main navigation">
          {pageLinks.map((link) => (
            <button
              key={link.id}
              className={page === link.id ? "active" : ""}
              onClick={() => goTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="user-chip">
          <span>{user.email}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
}

function Home({ goTo, user }) {
  return (
    <section className="page home-page">
      <div className="hero card hero-card">
        <div>
          <p className="eyebrow">AP Study Platform</p>
          <h1>AP Study Path</h1>
          <p className="hero-text">A growing study hub for AP courses, starting with a complete AP Computer Science Principles section.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => goTo("practice")}>Start AP CSP Practice</button>
            <button className="secondary-btn" onClick={() => goTo("units")}>Explore AP CSP Units</button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="floating-chip chip-blue">Data</div>
          <div className="floating-chip chip-purple">Code</div>
          <div className="floating-chip chip-amber">Networks</div>
          <div className="floating-chip chip-coral">Impact</div>
        </div>
      </div>

      <div className="card update-banner">
        <div>
          <strong>Logged in as {user.email}</strong>
          <p>AP CSP is the first full section in AP Study Path. It includes robot sequence questions, longer pseudocode questions, Booleans, loops, lists, procedures, binary conversions, FRQ rubrics, and full unit deep dives.</p>
        </div>
        <button className="secondary-btn" onClick={() => goTo("practice")}>Open AP CSP Section</button>
      </div>

      <section className="course-section">
        <div className="page-header compact-header">
          <p className="eyebrow">Courses</p>
          <h2>Choose your AP path</h2>
          <p>AP Study Path is built to grow beyond one course. The AP Computer Science Principles section is available now, and other AP subjects can be added later using the same course-card structure.</p>
        </div>
        <div className="course-grid">
          <article className="card course-card active-course">
            <span className="course-status">Available now</span>
            <h3>AP Computer Science Principles</h3>
            <p>Practice tests, robot/code MCQs, binary conversions, Create Task/PPR preparation, FRQ rubrics, and deep dives for all five AP CSP units.</p>
            <div className="button-row">
              <button className="primary-btn" onClick={() => goTo("practice")}>Practice Tests</button>
              <button className="secondary-btn" onClick={() => goTo("frq")}>FRQ Practice</button>
            </div>
          </article>
          <article className="card course-card coming-course">
            <span className="course-status muted-status">Coming later</span>
            <h3>More AP Courses</h3>
            <p>Future sections could include AP Computer Science A, AP Biology, AP World History, AP English Language, AP U.S. Government, and AP Calculus.</p>
          </article>
        </div>
      </section>

      <div className="overview-grid">
        <FeatureCard icon="📝" title="AP CSP Practice Tests" text="Three 70-question exams with instant feedback, scoring, unit breakdowns, code tracing, and robot path questions." />
        <FeatureCard icon="✍️" title="AP CSP FRQ Practice" text="Free AP CSP written-response practice with PPR support, checklists, exam-style prompts, and built-in rubrics." />
        <FeatureCard icon="📚" title="AP CSP Unit Deep Dives" text="Color-coded AP CSP unit cards and expandable topic explanations for every major AP CSP concept." />
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <article className="card feature-card">
      <div className="feature-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}

function PracticeTests() {
  const [activeTestId, setActiveTestId] = useState(null);
  const [mode, setMode] = useState("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const activeTest = practiceTests.find((test) => test.id === activeTestId);

  function startTest(test) {
    const saved = loadProgress(test.id);
    setActiveTestId(test.id);
    setMode(saved?.mode === "results" ? "results" : "quiz");
    setCurrentIndex(saved?.currentIndex || 0);
    setAnswers(saved?.answers || Array(test.questions.length).fill(null));
    setReviewIndex(0);
  }

  function restartTest(test) {
    clearProgress(test.id);
    setActiveTestId(test.id);
    setMode("quiz");
    setCurrentIndex(0);
    setAnswers(Array(test.questions.length).fill(null));
    setReviewIndex(0);
  }

  function exitToLanding() {
    if (activeTest) {
      saveProgress(activeTest.id, { mode, currentIndex, answers });
    }
    setActiveTestId(null);
    setMode("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseAnswer(choiceIndex) {
    if (!activeTest || answers[currentIndex] !== null) return;
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = choiceIndex;
    setAnswers(nextAnswers);
    saveProgress(activeTest.id, { mode: "quiz", currentIndex, answers: nextAnswers });
  }

  function nextQuestion() {
    if (!activeTest) return;
    if (currentIndex === activeTest.questions.length - 1) {
      setMode("results");
      saveProgress(activeTest.id, { mode: "results", currentIndex, answers });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    saveProgress(activeTest.id, { mode: "quiz", currentIndex: nextIndex, answers });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (mode === "landing") {
    return (
      <section className="page">
        <PageHeader title="Practice Tests" subtitle="Choose one full-length 70-question AP CSP practice exam. These tests now include code tracing, missing-line AP pseudocode, list/procedure questions, and robot sequence-to-goal questions." />
        <div className="test-grid">
          {practiceTests.map((test) => {
            const saved = loadProgress(test.id);
            const answered = saved?.answers?.filter((answer) => answer !== null).length || 0;
            return (
              <article className="card test-card" key={test.id}>
                <p className="eyebrow">70 questions</p>
                <h2>{test.title}</h2>
                <p>{test.description}</p>
                <div className="topic-tags">
                  <span>Code tracing</span>
                  <span>Missing lines</span>
                  <span>Robot paths</span>
                </div>
                <div className="mini-progress">
                  <span>{answered} / 70 answered</span>
                  <div className="mini-progress-track"><div style={{ width: `${(answered / 70) * 100}%` }} /></div>
                </div>
                <div className="button-row">
                  <button className="primary-btn" onClick={() => startTest(test)}>{answered > 0 ? "Resume" : "Start"}</button>
                  {answered > 0 && <button className="ghost-btn" onClick={() => restartTest(test)}>Restart</button>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  if (!activeTest) return null;

  const results = calculateResults(activeTest, answers);

  if (mode === "results") {
    return <ResultsScreen test={activeTest} answers={answers} results={results} onReview={() => { setMode("review"); setReviewIndex(0); }} onExit={exitToLanding} onRestart={() => restartTest(activeTest)} />;
  }

  if (mode === "review") {
    return <WrongAnswerReview test={activeTest} answers={answers} wrongQuestions={results.wrongQuestions} reviewIndex={reviewIndex} setReviewIndex={setReviewIndex} onBack={() => setMode("results")} />;
  }

  const question = activeTest.questions[currentIndex];
  const selected = answers[currentIndex];
  const answered = selected !== null;

  return (
    <section className="page quiz-page">
      <div className="quiz-top-row">
        <button className="ghost-btn" onClick={exitToLanding}>Pause / Exit</button>
        <span className={`unit-pill unit-${question.unit}`}>Unit {question.unit}: {unitMeta.find((u) => u.id === question.unit)?.name}</span>
      </div>
      <div className="card quiz-card">
        <div className="progress-label">Question {currentIndex + 1} of {activeTest.questions.length}</div>
        <div className="progress-track"><div style={{ width: `${((currentIndex + 1) / activeTest.questions.length) * 100}%` }} /></div>
        <h2>{question.question}</h2>
        <div className="choices">
          {question.choices.map((choice, index) => {
            const isCorrect = index === question.correctAnswer;
            const isWrongSelected = answered && selected === index && !isCorrect;
            const showCorrect = answered && isCorrect;
            return (
              <button
                key={choice}
                className={`choice-btn ${showCorrect ? "correct" : ""} ${isWrongSelected ? "wrong" : ""}`}
                onClick={() => chooseAnswer(index)}
                disabled={answered}
              >
                <strong>{String.fromCharCode(65 + index)}.</strong> {choice}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className="explanation-box">
            <strong>{selected === question.correctAnswer ? "Correct." : "Not quite."}</strong> {question.explanation}
          </div>
        )}
        <div className="quiz-actions">
          <button className="primary-btn" onClick={nextQuestion} disabled={!answered}>
            {currentIndex === activeTest.questions.length - 1 ? "Finish Test" : "Next"}
          </button>
        </div>
      </div>
    </section>
  );
}

function calculateResults(test, answers) {
  let correct = 0;
  const unitBreakdown = {};
  const wrongQuestions = [];

  for (const unit of unitMeta) {
    unitBreakdown[unit.id] = { unit: unit.id, name: unit.name, correct: 0, total: 0 };
  }

  test.questions.forEach((question, index) => {
    unitBreakdown[question.unit].total += 1;
    if (answers[index] === question.correctAnswer) {
      correct += 1;
      unitBreakdown[question.unit].correct += 1;
    } else {
      wrongQuestions.push({ question, index, selected: answers[index] });
    }
  });

  const percentage = Math.round((correct / test.questions.length) * 100);
  let band = "Keep studying";
  if (percentage >= 85) band = "Exam ready!";
  else if (percentage >= 70) band = "Good job";
  else if (percentage >= 50) band = "Getting there";

  return { correct, total: test.questions.length, percentage, band, unitBreakdown, wrongQuestions };
}

function ResultsScreen({ test, answers, results, onReview, onExit, onRestart }) {
  return (
    <section className="page">
      <div className="card results-card">
        <p className="eyebrow">{test.title}</p>
        <h1>Score: {results.correct} / {results.total}</h1>
        <div className="score-circle">{results.percentage}%</div>
        <h2>{results.band}</h2>
        <p className="muted">Use the unit breakdown below to decide what to study next.</p>
        <div className="unit-breakdown">
          {Object.values(results.unitBreakdown).map((unit) => (
            <div className={`unit-score unit-${unit.unit}`} key={unit.unit}>
              <strong>Unit {unit.unit}</strong>
              <span>{unit.name}</span>
              <b>{unit.correct} / {unit.total}</b>
            </div>
          ))}
        </div>
        <div className="button-row center">
          <button className="primary-btn" onClick={onReview} disabled={results.wrongQuestions.length === 0}>Review Wrong Answers</button>
          <button className="secondary-btn" onClick={onRestart}>Restart Test</button>
          <button className="ghost-btn" onClick={onExit}>Back to Tests</button>
        </div>
      </div>
    </section>
  );
}

function WrongAnswerReview({ test, answers, wrongQuestions, reviewIndex, setReviewIndex, onBack }) {
  if (wrongQuestions.length === 0) {
    return (
      <section className="page">
        <div className="card results-card">
          <h1>No wrong answers 🎉</h1>
          <button className="primary-btn" onClick={onBack}>Back to Results</button>
        </div>
      </section>
    );
  }

  const item = wrongQuestions[reviewIndex];
  const { question, selected, index } = item;

  return (
    <section className="page quiz-page">
      <div className="quiz-top-row">
        <button className="ghost-btn" onClick={onBack}>Back to Results</button>
        <span className="progress-label">Wrong answer {reviewIndex + 1} of {wrongQuestions.length}</span>
      </div>
      <div className="card quiz-card">
        <p className="eyebrow">Original question {index + 1} • {test.title}</p>
        <h2>{question.question}</h2>
        <div className="choices">
          {question.choices.map((choice, choiceIndex) => {
            const isCorrect = choiceIndex === question.correctAnswer;
            const isWrongSelected = selected === choiceIndex && !isCorrect;
            return (
              <div key={choice} className={`choice-review ${isCorrect ? "correct" : ""} ${isWrongSelected ? "wrong" : ""}`}>
                <strong>{String.fromCharCode(65 + choiceIndex)}.</strong> {choice}
              </div>
            );
          })}
        </div>
        <div className="explanation-box"><strong>Explanation:</strong> {question.explanation}</div>
        <div className="button-row space-between">
          <button className="secondary-btn" disabled={reviewIndex === 0} onClick={() => setReviewIndex(reviewIndex - 1)}>Previous</button>
          <button className="secondary-btn" disabled={reviewIndex === wrongQuestions.length - 1} onClick={() => setReviewIndex(reviewIndex + 1)}>Next</button>
        </div>
      </div>
    </section>
  );
}

function FrqPractice() {
  const [generatedFrqs, setGeneratedFrqs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ap-csp-generated-ppr-frqs") || "[]"); }
    catch { return []; }
  });
  const allFrqs = useMemo(() => [...frqs, ...generatedFrqs], [generatedFrqs]);
  const [selectedId, setSelectedId] = useState(allFrqs[0]?.id || frqs[0].id);
  const selected = allFrqs.find((frq) => frq.id === selectedId) || allFrqs[0] || frqs[0];
  const [responses, setResponses] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ap-csp-frq-responses") || "{}"); }
    catch { return {}; }
  });
  const [feedback, setFeedback] = useState({});
  const [pprText, setPprText] = useState(() => localStorage.getItem("ap-csp-ppr-text") || "");
  const [pprFileName, setPprFileName] = useState("");
  const [pprFileMessage, setPprFileMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("ap-csp-frq-responses", JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    localStorage.setItem("ap-csp-generated-ppr-frqs", JSON.stringify(generatedFrqs));
  }, [generatedFrqs]);

  useEffect(() => {
    localStorage.setItem("ap-csp-ppr-text", pprText);
  }, [pprText]);

  function checkResponseWithRubric() {
    const responseText = responses[selected.id] || "";
    const nextFeedback = buildRubricFeedback(selected, responseText);
    setFeedback((prev) => ({ ...prev, [selected.id]: nextFeedback }));
  }

  function handlePprFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPprFileName(file.name);
    setPprFileMessage("Reading attachment...");

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const readableText = text.replace(/[^\x20-\x7E\n\r\t]/g, " ").trim();
        if (readableText.length > 200) {
          setPprText(readableText);
          setPprFileMessage(`Attached ${file.name}. I tried to import readable PDF text. Review the PPR box because browser-only PDF text extraction is imperfect.`);
        } else {
          setPprFileMessage(`Attached ${file.name}. PDF text extraction is limited in the browser, so paste the PPR text into the box too.`);
        }
        return;
      }

      setPprText(text);
      setPprFileMessage(`Attached ${file.name} and copied its text into the PPR box.`);
    };
    reader.onerror = () => setPprFileMessage("Could not read that file. Paste the PPR text into the box instead.");
    reader.readAsText(file);
  }

  function buildPprPracticeSet() {
    const hasPpr = pprText.trim().length > 0 || pprFileName;
    const practiceSet = frqs.slice(0, 8).map((frq, index) => ({
      ...frq,
      id: `ppr-local-${index + 1}`,
      title: `PPR Practice ${index + 1}: ${frq.title}`,
      category: "Personalized PPR Practice",
      prompt: `${frq.prompt}\n\nUse the PPR you ${hasPpr ? "provided" : "will provide"} as your evidence. Answer using your own program code; do not invent code that is not in your PPR.`
    }));
    setGeneratedFrqs(practiceSet);
    if (practiceSet[0]?.id) setSelectedId(practiceSet[0].id);
  }

  function clearGeneratedPprQuestions() {
    setGeneratedFrqs([]);
    if (selectedId.startsWith("ppr-local-")) setSelectedId(frqs[0].id);
  }

  return (
    <section className="page frq-page">
      <PageHeader
        title="FRQ Practice + Free Rubrics"
        subtitle="No API key needed. Practice Create Task-style written responses that fit almost any PPR, then check your answer against a clear rubric."
      />

      <div className="card ppr-panel">
        <div>
          <p className="eyebrow">Create Task Practice</p>
          <h2>Paste or Attach your PPR for practice</h2>
          <p>
            This page does not send your PPR to an AI service. It stores your text in your browser and gives you general Create Task-style questions that you answer using your own PPR.
          </p>
        </div>
        <label className="file-drop" htmlFor="ppr-file">
          <strong>Attach PPR file</strong>
          <span>{pprFileName || "Choose a .txt, .md, .js, .py, .java, .html, .css, or PDF file"}</span>
          <input
            id="ppr-file"
            type="file"
            accept=".txt,.md,.js,.jsx,.py,.java,.html,.css,.pdf"
            onChange={handlePprFile}
          />
        </label>
        {pprFileMessage && <div className="info-box">{pprFileMessage}</div>}
        <textarea
          className="ppr-textarea"
          value={pprText}
          onChange={(event) => setPprText(event.target.value)}
          placeholder="Paste your PPR here. Include the procedure, procedure call, list/collection, and list use. Remove names, emails, or private information first."
        />
        <div className="button-row">
          <button className="primary-btn" onClick={buildPprPracticeSet}>Create Free PPR Practice Set</button>
          <button className="ghost-btn" onClick={clearGeneratedPprQuestions}>Clear PPR Practice Set</button>
        </div>
      </div>

      <div className="card ppr-checklist-card">
        <p className="eyebrow">PPR Checklist</p>
        <h2>Before you rely on your PPR, check these items</h2>
        <div className="checklist-grid">
          {pprChecklist.map((group) => (
            <div className="checklist-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="frq-layout">
        <aside className="card frq-sidebar">
          <h2>Choose an FRQ</h2>
          {frqs.map((frq, index) => (
            <button key={frq.id} className={selectedId === frq.id ? "frq-tab active" : "frq-tab"} onClick={() => setSelectedId(frq.id)}>
              <span>{index + 1}</span>
              <div>
                <strong>{frq.title}</strong>
                <small>{frq.category}</small>
              </div>
            </button>
          ))}

          {generatedFrqs.length > 0 && (
            <div className="generated-list">
              <h3>PPR Practice Set</h3>
              {generatedFrqs.map((frq, index) => (
                <button key={frq.id} className={selectedId === frq.id ? "frq-tab active" : "frq-tab"} onClick={() => setSelectedId(frq.id)}>
                  <span>P{index + 1}</span>
                  <div>
                    <strong>{frq.title}</strong>
                    <small>{frq.category}</small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>
        <div className="card frq-workspace">
          <p className="eyebrow">{selected.category}</p>
          <h2>{selected.title}</h2>
          <p className="prompt-box">{selected.prompt}</p>
          {selected.tip && <div className="info-box"><strong>Exam tip:</strong> {selected.tip}</div>}

          <div className="rubric-preview">
            <h3>Rubric for this question</h3>
            <ul>
              {(selected.rubric || []).map((row) => (
                <li key={row.point}><strong>{row.point}:</strong> {row.lookFor}</li>
              ))}
            </ul>
          </div>

          <label htmlFor="student-response">Your response</label>
          <textarea
            id="student-response"
            value={responses[selected.id] || ""}
            onChange={(event) => setResponses((prev) => ({ ...prev, [selected.id]: event.target.value }))}
            placeholder="Write your answer here. Use your actual PPR code as evidence and explain why your answer is true."
          />
          <div className="button-row">
            <button className="primary-btn" onClick={checkResponseWithRubric}>Check with Free Rubric</button>
            <button className="ghost-btn" onClick={() => setResponses((prev) => ({ ...prev, [selected.id]: "" }))}>Clear</button>
          </div>
          {feedback[selected.id] && <RubricFeedbackCard feedback={feedback[selected.id]} rubric={selected.rubric || []} checklist={selected.checklist || []} />}
        </div>
      </div>
    </section>
  );
}

function buildRubricFeedback(frq, responseText) {
  const text = responseText.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const rubric = frq.rubric || [];
  const checks = rubric.map((row) => {
    const matched = (row.keywords || []).filter((keyword) => lower.includes(keyword.toLowerCase()));
    const status = matched.length >= 2 || (matched.length >= 1 && words.length >= 70) ? "Likely included" : "Check manually";
    return { ...row, matched, status };
  });
  const likelyIncluded = checks.filter((row) => row.status === "Likely included").length;
  const score = Math.min(rubric.length, likelyIncluded);
  const band = score >= rubric.length ? "Strong" : score >= Math.ceil(rubric.length / 2) ? "Developing" : "Needs more evidence";

  const suggestions = [];
  if (words.length < 70) suggestions.push("Add more detail. Strong AP CSP written responses usually explain cause and effect, not just name terms.");
  if (!lower.includes("because") && !lower.includes("so that") && !lower.includes("therefore")) suggestions.push("Add reasoning words such as 'because,' 'so that,' or 'therefore' to explain why your claim is true.");
  if (!lower.includes("input") && frq.category.includes("Function")) suggestions.push("For Program Design questions, make sure you identify a specific input from your program.");
  if (!lower.includes("output") && frq.category.includes("Function")) suggestions.push("For Program Design questions, make sure you identify a specific output from your program.");
  if (frq.title.toLowerCase().includes("list") && !lower.includes("list") && !lower.includes("array") && !lower.includes("collection")) suggestions.push("This question is about data abstraction, so name your list/array/collection and explain how it is used.");
  if (frq.title.toLowerCase().includes("procedure") && !lower.includes("procedure") && !lower.includes("function") && !lower.includes("method")) suggestions.push("This question is about procedural abstraction, so name your selected procedure/function/method.");

  return {
    score,
    total: rubric.length,
    band,
    checks,
    suggestions: suggestions.length ? suggestions : ["Good start. Now compare your response against each rubric row and make sure every claim uses evidence from your PPR."],
    wordCount: words.length
  };
}

function RubricFeedbackCard({ feedback, checklist }) {
  return (
    <div className="grade-card rubric-feedback-card">
      <div className="grade-header">
        <h3>Free Rubric Feedback</h3>
        <strong>{feedback.score} / {feedback.total} likely • {feedback.band}</strong>
      </div>
      <p className="muted">This is a practice estimate, not an official score. Use the rubric rows below to revise your answer.</p>
      <div className="rubric-result-list">
        {feedback.checks.map((row) => (
          <div className="rubric-result" key={row.point}>
            <b>{row.point}</b>
            <span>{row.status}</span>
            <p>{row.lookFor}</p>
          </div>
        ))}
      </div>
      <div className="grade-columns">
        <div>
          <h4>Question checklist</h4>
          <ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h4>Revise next</h4>
          <ul>{feedback.suggestions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

function UnitsPage() {
  const [activeUnitId, setActiveUnitId] = useState(null);
  const [openTopicId, setOpenTopicId] = useState(null);
  const activeUnit = units.find((unit) => unit.id === activeUnitId);

  if (!activeUnit) {
    return (
      <section className="page">
        <PageHeader title="Units & Deep Dives" subtitle="Explore every AP CSP unit with topic-by-topic explanations, examples, and exam tips." />
        <div className="unit-card-grid">
          {units.map((unit) => (
            <button className={`card unit-card unit-${unit.id}`} key={unit.id} onClick={() => { setActiveUnitId(unit.id); setOpenTopicId(unit.topics[0]?.id); }}>
              <span className="unit-badge">Unit {unit.id}</span>
              <h2>{unit.name}</h2>
              <p>{unit.overview}</p>
              <strong>Open deep dive →</strong>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="page unit-detail-page">
      <button className="ghost-btn" onClick={() => { setActiveUnitId(null); setOpenTopicId(null); }}>← Back to Units</button>
      <div className={`card unit-detail-header unit-${activeUnit.id}`}>
        <span className="unit-badge">Unit {activeUnit.id}</span>
        <h1>{activeUnit.name}</h1>
        <p>{activeUnit.overview}</p>
      </div>
      <div className="accordion-list">
        {activeUnit.topics.map((topic) => {
          const open = openTopicId === topic.id;
          return (
            <article className="card accordion-item" key={topic.id}>
              <button className="accordion-title" onClick={() => setOpenTopicId(open ? null : topic.id)}>
                <span>{topic.name}</span>
                <strong>{open ? "−" : "+"}</strong>
              </button>
              {open && (
                <div className="accordion-content">
                  {topic.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <p className="eyebrow">Study Mode</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

export default App;
