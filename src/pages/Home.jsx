import { useState } from "react";
import { courseList } from "../data/courses.js";
import { navigate, useApp } from "../App.jsx";

const SAMPLE = {
  code: `int a = 17;
int b = 5;
double c = a / b + a % b;
System.out.println(c);`,
  choices: ["5.4", "5.0", "3.4", "5"],
  correct: 1,
  explanation: "17 / 5 is integer division, so it's 3. 17 % 5 is 2. 3 + 2 = 5, stored in a double, so it prints 5.0."
};

export default function Home() {
  const { user, backend } = useApp();
  const [picked, setPicked] = useState(null);

  return (
    <section className="page home-page">
      <div className="hero">
        <div className="hero-copy">
          <h1>Practice AP computer science the way the exam asks it.</h1>
          <p className="hero-text">
            Full-length practice exams, quizzes built from your weak units, and free-response questions scored against a rubric for AP CSP, AP CSA, and AP Cybersecurity.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate("/csa/tests")}>Start a practice exam</button>
            {!user && backend.available
              ? <button className="secondary-btn" onClick={() => navigate("/login")}>Create a free account</button>
              : <button className="secondary-btn" onClick={() => navigate("/dashboard")}>See my progress</button>}
          </div>
        </div>

        <div className="sample-q" aria-label="Sample question">
          <p className="sample-label">Try one — AP CSA, Unit 1</p>
          <p className="sample-prompt">What is printed?</p>
          <pre className="code-block">{SAMPLE.code}</pre>
          <div className="choices">
            {SAMPLE.choices.map((c, i) => {
              const cls = ["choice-btn"];
              if (picked !== null && i === SAMPLE.correct) cls.push("correct");
              if (picked === i && i !== SAMPLE.correct) cls.push("wrong");
              return (
                <button key={c} className={cls.join(" ")} onClick={() => setPicked(i)} disabled={picked !== null}>
                  <strong>{String.fromCharCode(65 + i)}</strong> <span>{c}</span>
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className={`explanation-box ${picked === SAMPLE.correct ? "good" : "bad"}`}>
              <strong>{picked === SAMPLE.correct ? "Correct." : "Not quite — it's B."}</strong> {SAMPLE.explanation}
              <button className="link-btn" onClick={() => navigate("/csa/quiz")}>Get 15 more like this</button>
            </div>
          )}
        </div>
      </div>

      <section className="course-list" aria-label="Courses">
        {courseList.map((course) => {
          const questions = course.tests.reduce((s, t) => s + t.questions.length, 0);
          return (
            <article className={`course-row accent-${course.accent}`} key={course.id}>
              <div className="course-row-main">
                <h2>{course.name}</h2>
                <p>{course.tagline}</p>
              </div>
              <dl className="course-row-facts">
                <div><dt>{questions}</dt><dd>practice questions</dd></div>
                <div><dt>{course.tests.length}</dt><dd>full exams</dd></div>
                <div><dt>{course.frqs.length}</dt><dd>FRQs with rubrics</dd></div>
              </dl>
              <div className="course-row-actions">
                <button className="primary-btn" onClick={() => navigate(`/${course.id}/tests`)}>Open {course.short}</button>
                <button className="ghost-btn" onClick={() => navigate(`/${course.id}/frq`)}>FRQs</button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="how-to-use" aria-labelledby="how-to-use-title">
        <h2 id="how-to-use-title">How to use AP Study Path</h2>
        <p className="muted">New here? Follow these four steps. Each one builds on the last.</p>
        <ol className="steps">
          <li>
            <h3>Pick your course</h3>
            <p>Choose AP CSP, AP CSA, or AP Cybersecurity above. Everything inside is matched to that exam.</p>
          </li>
          <li>
            <h3>Take a practice exam</h3>
            <p><strong>Why:</strong> your score shows which units you're weak in, so you know where to spend study time.</p>
          </li>
          <li>
            <h3>Fix your weak units</h3>
            <p>Read the unit notes, then build a custom quiz from just those units. <strong>Why:</strong> short focused practice raises your score faster than retaking whole exams.</p>
          </li>
          <li>
            <h3>Practice FRQs</h3>
            <p>Write a free response and get it {backend.aiGrading ? "graded by AI" : "scored"} with specific fixes. <strong>Why:</strong> FRQs are a big part of your score, and feedback shows exactly which rubric points you're missing.</p>
          </li>
        </ol>
        {!user && backend.available && (
          <p className="muted small">Tip: create a free account so your progress saves on every device{backend.aiGrading ? " and you can use AI grading" : ""}.</p>
        )}
      </section>
    </section>
  );
}
