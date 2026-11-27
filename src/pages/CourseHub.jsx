import { useEffect, useRef, useState } from "react";
import { navigate, useApp } from "../App.jsx";
import { QuizTab, TestsTab } from "./Tests.jsx";
import { FrqTab } from "./Frq.jsx";
import AiHelper from "../components/AiHelper.jsx";

const TABS = [
  { id: "tests", label: "Practice Exams" },
  { id: "quiz", label: "Custom Quiz" },
  { id: "frq", label: "FRQ Practice" },
  { id: "notes", label: "Unit Notes" },
  { id: "tips", label: "Tips & Tricks" }
];

const TAB_INTROS = {
  tests: { what: "Full-length exams that match the real test.", why: "Take one first: your results show which units to study." },
  quiz: { what: "Short quizzes built from the units you choose.", why: "Use these on your weak units. A new random mix every time." },
  frq: { what: "Free-response practice with rubric scoring and feedback.", why: "Write your answer, grade it, then fix what the feedback points out." },
  notes: { what: "Key ideas for every unit, in plain language.", why: "Read the unit you missed most, then quiz yourself on it." },
  tips: { what: "Exam strategy and common traps.", why: "Read before test day so easy points don't slip away." }
};

const TUTOR_STARTERS = {
  csp: ["Explain lists in AP pseudocode", "How do I trace a robot question?", "Make me a 2-week study plan"],
  csa: ["Explain ArrayList vs arrays", "How do I avoid off-by-one errors?", "Make me a 2-week study plan"],
  cyber: ["Explain the CIA triad with examples", "How do I read firewall rules?", "Make me a 2-week study plan"]
};

export default function CourseHub({ course, tab, extra }) {
  const current = TABS.some((t) => t.id === tab) ? tab : "tests";
  const [tutorOpen, setTutorOpen] = useState(false);
  const { user, backend } = useApp();
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

      <div className="tab-intro">
        <p><strong>{TAB_INTROS[current].what}</strong> {TAB_INTROS[current].why}</p>
        {!user && backend.available && (
          <p className="guest-note">You're practicing as a guest, so progress saves only in this browser. <button className="link-btn inline" onClick={() => navigate("/login")}>Sign in</button> to save it everywhere{backend.aiGrading ? " and use AI help" : ""}.</p>
        )}
      </div>

      {current === "tests" && <TestsTab course={course} />}
      {current === "quiz" && <QuizTab key={extra || "all"} course={course} initialUnits={extra} />}
      {current === "frq" && <FrqTab course={course} />}
      {current === "notes" && <NotesTab course={course} unitParam={extra} />}
      {current === "tips" && <TipsTab course={course} />}

      {(current === "notes" || current === "tips") && (
        <button className="ai-fab" onClick={() => setTutorOpen(true)}><span className="ai-badge">AI</span> Ask the tutor</button>
      )}
      <AiHelper
        open={tutorOpen}
        onClose={() => setTutorOpen(false)}
        course={course}
        context={{ key: `general:${course.id}`, label: course.name, kind: "general" }}
        starters={TUTOR_STARTERS[course.id] || []}
      />
    </section>
  );
}

function NotesTab({ course, unitParam }) {
  // The open unit lives in the URL (#/csp/notes/3) so Back returns to the unit list.
  const unit = course.units.find((u) => String(u.id) === String(unitParam));
  const [openTopicId, setOpenTopicId] = useState(unit?.topics[0]?.id ?? null);
  const headerRef = useRef(null);
  const openUnit = (u) => { setOpenTopicId(u.topics[0]?.id); navigate(`/${course.id}/notes/${u.id}`); };

  useEffect(() => {
    if (!unit || !headerRef.current) return;
    setOpenTopicId((id) => (unit.topics.some((t) => t.id === id) ? id : unit.topics[0]?.id));
    const el = headerRef.current;
    requestAnimationFrame(() => {
      el.scrollIntoView({ block: "start" });
      el.focus({ preventScroll: true });
    });
  }, [unit?.id]);

  if (!unit) {
    return (
      <div className="unit-card-grid">
        {course.units.map((u) => (
          <button className={`card unit-card unit-${u.id}`} key={u.id} onClick={() => openUnit(u)}>
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
      <button className="ghost-btn" onClick={() => navigate(`/${course.id}/notes`)}>← All units</button>
      <div className={`card unit-detail-header unit-${unit.id}`} ref={headerRef} tabIndex={-1}>
        <span className="unit-badge">Unit {unit.id}</span>
        <h2 className="unit-title">{unit.name}</h2>
        <p>{unit.overview}</p>
        <button className="secondary-btn" onClick={() => navigate(`/${course.id}/quiz/${unit.id}`)}>Quiz this unit</button>
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
