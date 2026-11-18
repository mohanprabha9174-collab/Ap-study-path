import { useState } from "react";
import { navigate } from "../App.jsx";
import { QuizTab, TestsTab } from "./Tests.jsx";
import { FrqTab } from "./Frq.jsx";

const TABS = [
  { id: "tests", label: "Practice Exams" },
  { id: "quiz", label: "Custom Quiz" },
  { id: "frq", label: "FRQ Practice" },
  { id: "notes", label: "Unit Notes" },
  { id: "tips", label: "Tips & Tricks" }
];

export default function CourseHub({ course, tab }) {
  const current = TABS.some((t) => t.id === tab) ? tab : "tests";
  return (
    <section className="page course-hub">
      <div className={`card course-banner accent-${course.accent}`}>
        <div>
          <h1>{course.name}</h1>
          <p>{course.tagline}</p>
        </div>
        <div className="exam-format">
          <strong>Exam format</strong>
          <ul>{course.examFormat.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      </div>

      <nav className="tab-bar" aria-label={`${course.short} sections`}>
        {TABS.map((t) => (
          <button key={t.id} className={current === t.id ? "active" : ""} onClick={() => navigate(`/${course.id}/${t.id}`)}>
            {t.label}
          </button>
        ))}
      </nav>

      {current === "tests" && <TestsTab course={course} />}
      {current === "quiz" && <QuizTab course={course} />}
      {current === "frq" && <FrqTab course={course} />}
      {current === "notes" && <NotesTab course={course} />}
      {current === "tips" && <TipsTab course={course} />}
    </section>
  );
}

function NotesTab({ course }) {
  const [activeUnitId, setActiveUnitId] = useState(null);
  const [openTopicId, setOpenTopicId] = useState(null);
  const unit = course.units.find((u) => u.id === activeUnitId);

  if (!unit) {
    return (
      <div className="unit-card-grid">
        {course.units.map((u) => (
          <button className={`card unit-card unit-${u.id}`} key={u.id} onClick={() => { setActiveUnitId(u.id); setOpenTopicId(u.topics[0]?.id); }}>
            <span className="unit-badge">Unit {u.id}</span>
            <h2>{u.name}</h2>
            <p>{u.overview}</p>
            <strong>{u.topics.length} topics</strong>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="unit-detail-page">
      <button className="ghost-btn" onClick={() => setActiveUnitId(null)}>← All units</button>
      <div className={`card unit-detail-header unit-${unit.id}`}>
        <span className="unit-badge">Unit {unit.id}</span>
        <h1>{unit.name}</h1>
        <p>{unit.overview}</p>
        <button className="secondary-btn" onClick={() => navigate(`/${course.id}/quiz`)}>Build a quiz</button>
      </div>
      <div className="accordion-list">
        {unit.topics.map((topic) => {
          const open = openTopicId === topic.id;
          return (
            <article className="card accordion-item" key={topic.id}>
              <button className="accordion-title" onClick={() => setOpenTopicId(open ? null : topic.id)}>
                <span>{topic.name}</span>
                <strong>{open ? "−" : "+"}</strong>
              </button>
              {open && <div className="accordion-content">{topic.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function TipsTab({ course }) {
  return (
    <div className="tips-grid">
      {course.tips.map((section) => (
        <article className="card tips-section" key={section.title}>
          <h2>{section.title}</h2>
          {section.tips.map((tip) => (
            <div className="tip" key={tip.title}>
              <h3>{tip.title}</h3>
              <p>{tip.text}</p>
              {tip.example && <pre className="code-block small">{tip.example}</pre>}
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}
