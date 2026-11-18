import { courseList } from "../data/courses.js";
import { navigate, useApp } from "../App.jsx";

export default function Home() {
  const { user, backend } = useApp();
  const totalQuestions = courseList.reduce((sum, c) => sum + c.tests.reduce((s, t) => s + t.questions.length, 0), 0);
  const totalFrqs = courseList.reduce((sum, c) => sum + c.frqs.length, 0);

  return (
    <section className="page home-page">
      <div className="hero card hero-card">
        <div>
          <p className="eyebrow">Free AP Computer Science prep</p>
          <h1>AP Study Path</h1>
          <p className="hero-text">
            Full-length practice exams, unlimited custom quizzes, tips and tricks, and FRQ practice that gets graded against a rubric for
            AP Computer Science Principles, AP Computer Science A, and AP Cybersecurity.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate("/csp")}>Start practicing</button>
            {!user && backend.available && (
              <button className="secondary-btn" onClick={() => navigate("/login")}>Create a free account</button>
            )}
            {user && <button className="secondary-btn" onClick={() => navigate("/dashboard")}>My progress</button>}
          </div>
          <div className="stat-row">
            <div><strong>{totalQuestions}</strong><span>exam-style MCQs</span></div>
            <div><strong>{totalFrqs}</strong><span>FRQs with rubrics</span></div>
            <div><strong>3</strong><span>AP courses</span></div>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="floating-chip chip-blue">CSP</div>
          <div className="floating-chip chip-purple">Java</div>
          <div className="floating-chip chip-amber">FRQ</div>
          <div className="floating-chip chip-coral">Cyber</div>
        </div>
      </div>

      {backend.available && backend.aiGrading && (
        <div className="card update-banner">
          <div>
            <strong>AI FRQ grading is live</strong>
            <p>Write your free response, and an AI grader scores it row by row against the rubric, explains each point, and tells you exactly what to fix. {user ? "" : "Sign in to use it."}</p>
          </div>
          <button className="secondary-btn" onClick={() => navigate(user ? "/csa/frq" : "/login")}>{user ? "Try an FRQ" : "Sign in"}</button>
        </div>
      )}

      <section className="course-section">
        <div className="page-header compact-header">
          <p className="eyebrow">Courses</p>
          <h2>Choose your AP path</h2>
        </div>
        <div className="course-grid three">
          {courseList.map((course) => {
            const questions = course.tests.reduce((s, t) => s + t.questions.length, 0);
            return (
              <article className={`card course-card accent-${course.accent}`} key={course.id}>
                <span className="course-status">{course.short}</span>
                <h3>{course.name}</h3>
                <p>{course.tagline}</p>
                <ul className="course-facts">
                  <li>{course.tests.length} practice exams • {questions} questions</li>
                  <li>{course.frqs.length} FRQs with rubrics</li>
                  <li>{course.units.length} units of notes + tips & tricks</li>
                </ul>
                <div className="button-row">
                  <button className="primary-btn" onClick={() => navigate(`/${course.id}/tests`)}>Practice exams</button>
                  <button className="secondary-btn" onClick={() => navigate(`/${course.id}/frq`)}>FRQs</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="overview-grid">
        <FeatureCard icon="📝" title="Real exam practice" text="Full-length timed exams in exam mode, or practice mode with instant explanations. Your progress saves automatically." />
        <FeatureCard icon="🎲" title="Unlimited custom quizzes" text="Pick the units you're weak in and how many questions you want. Every quiz is a new random mix." />
        <FeatureCard icon="✍️" title="FRQs graded for you" text="Each FRQ is scored rubric row by row, with feedback on what earned points, what didn't, and a reference solution." />
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
