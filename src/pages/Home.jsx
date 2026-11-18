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

      <section className="how-it-works">
        <div>
          <h3>Exam mode or practice mode</h3>
          <p>Time yourself with flags and a question navigator, or see the explanation right after every answer.</p>
        </div>
        <div>
          <h3>Quizzes from your weak units</h3>
          <p>Your results show which unit is costing you points. Build a quiz from just that unit, as many times as you like.</p>
        </div>
        <div>
          <h3>FRQs scored row by row</h3>
          <p>{backend.aiGrading ? "An AI grader" : "A rubric checker"} goes through each rubric point, says what earned it and what didn't, then shows a reference solution.</p>
        </div>
      </section>
    </section>
  );
}
