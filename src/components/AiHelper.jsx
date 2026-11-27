import { useEffect, useRef, useState } from "react";
import { navigate, useApp } from "../App.jsx";
import { api } from "../lib/api.js";

// Tiny, safe Markdown: fenced code, inline code, **bold**, bullet lists, paragraphs.
// Builds React elements (no innerHTML), so model output can't inject HTML.
function renderInline(text, keyBase) {
  const parts = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    parts.push(tok.startsWith("`")
      ? <code key={`${keyBase}-${i++}`}>{tok.slice(1, -1)}</code>
      : <strong key={`${keyBase}-${i++}`}>{tok.slice(2, -2)}</strong>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Markdown({ text }) {
  const blocks = [];
  const chunks = text.split(/```[a-zA-Z]*\n?/);
  chunks.forEach((chunk, ci) => {
    if (ci % 2 === 1) {
      blocks.push(<pre className="code-block small" key={`c${ci}`}>{chunk.replace(/\n$/, "")}</pre>);
      return;
    }
    chunk.split(/\n{2,}/).forEach((para, pi) => {
      const lines = para.split("\n").filter((l) => l.trim());
      if (!lines.length) return;
      if (lines.every((l) => /^\s*([-*]|\d+\.)\s+/.test(l))) {
        blocks.push(
          <ul key={`l${ci}-${pi}`}>
            {lines.map((l, li) => <li key={li}>{renderInline(l.replace(/^\s*([-*]|\d+\.)\s+/, ""), `${ci}-${pi}-${li}`)}</li>)}
          </ul>
        );
      } else {
        blocks.push(
          <p key={`p${ci}-${pi}`}>
            {lines.map((l, li) => <span key={li}>{li > 0 && <br />}{renderInline(l.replace(/^#+\s*/, ""), `${ci}-${pi}-${li}`)}</span>)}
          </p>
        );
      }
    });
  });
  return <div className="md">{blocks}</div>;
}

/**
 * Slide-out AI helper.
 * context: { key, label, kind: "mcq"|"frq"|"general", questionId?, studentChoice?, answered?, frqId?, draft?, graded?, ppr? }
 * starters: quick prompts shown as buttons.
 */
export default function AiHelper({ open, onClose, course, context, starters = [] }) {
  const { user, backend } = useApp();
  const [threads, setThreads] = useState({});
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const messages = threads[context.key] || [];
  const [usage, setUsage] = useState(null);
  const canUse = Boolean(user && backend.available && backend.aiGrading);

  useEffect(() => {
    if (open && canUse) {
      api("/ai/usage").then((u) => {
        setUsage(u);
        // Keep other counters on the page (like the FRQ banner) in step.
        window.dispatchEvent(new CustomEvent("ap-usage", { detail: u }));
      }).catch(() => {});
    }
  }, [open, canUse, messages.length]);
  const chats = usage?.chats;
  const outOfRequests = chats?.remaining === 0;

  // Stop the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    if (!open) return undefined;
    const before = document.body.style.overflowY;
    document.body.style.overflowY = "hidden";
    return () => { document.body.style.overflowY = before; };
  }, [open]);

  const drawerRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const el = drawerRef.current;
    if (el) { if (open) el.removeAttribute("inert"); else el.setAttribute("inert", ""); }
    if (!open) return undefined;
    const opener = document.activeElement;
    // Keep keyboard focus inside the drawer while it is open, and return it to the opener on close.
    const onKey = (e) => {
      if (e.key === "Escape") { closeRef.current(); return; }
      if (e.key !== "Tab" || !el) return;
      const items = [...el.querySelectorAll("button, textarea, input, a[href], [tabindex]:not([tabindex='-1'])")].filter((n) => !n.disabled && n.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!el.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => (inputRef.current || el?.querySelector("button, a[href]"))?.focus(), 250);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, busy]);

  useEffect(() => { setError(""); }, [context.key]);

  async function send(text, base = messages) {
    const content = text.trim();
    if (!content || busy || outOfRequests) return;
    const history = [...base, { role: "user", content }];
    setThreads((t) => ({ ...t, [context.key]: history }));
    setInput("");
    setError("");
    setBusy(true);
    try {
      const { reply } = await api("/ai/help", {
        method: "POST",
        body: {
          course: course.id,
          kind: context.kind,
          questionId: context.questionId,
          studentChoice: context.studentChoice,
          answered: context.answered,
          frqId: context.frqId,
          draft: context.draft,
          graded: context.graded,
          ppr: context.ppr,
          // Uploaded project files go with the first message of a chat only; later turns
          // still include the project code text, which keeps each request small.
          pprFiles: history.length <= 1 ? context.pprFiles : [],
          history
        }
      });
      setThreads((t) => ({ ...t, [context.key]: [...history, { role: "assistant", content: reply }] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  let body;
  if (!backend.available || !backend.aiGrading) {
    body = <div className="ai-empty"><p>The AI helper needs the site's server with an AI key set up. It isn't available on this copy of the site.</p></div>;
  } else if (!user) {
    body = (
      <div className="ai-empty">
        <p>Sign in to chat with the AI helper. It can explain questions, give hints without spoiling answers, and help you fix your FRQs.</p>
        <button className="primary-btn" onClick={() => { onClose(); navigate("/login"); }}>Sign in</button>
      </div>
    );
  } else {
    body = (
      <>
        <div className="ai-messages" ref={listRef} aria-live="polite">
          {messages.length === 0 && (
            <div className="ai-intro">
              <p>Ask anything about {context.label ? <strong>{context.label}</strong> : `${course.short}`}. Pick a starter or type your own question.</p>
              <div className="ai-starters">
                {starters.map((s) => <button key={s} className="starter-chip" disabled={outOfRequests} onClick={() => send(s)}>{s}</button>)}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}`}>
              {m.role === "assistant" ? <Markdown text={m.content} /> : <p>{m.content}</p>}
            </div>
          ))}
          {busy && <div className="ai-msg assistant typing" aria-label="AI is thinking"><span /><span /><span /></div>}
          {error && (
            <div className="error-box" role="alert">
              {error}
              {messages[messages.length - 1]?.role === "user" && !outOfRequests && (
                <button className="link-btn inline" onClick={() => send(messages[messages.length - 1].content, messages.slice(0, -1))}>Try again</button>
              )}
            </div>
          )}
          {outOfRequests && (
            <div className="info-box">You've used all {chats.limit} AI helper messages for today. They reset tomorrow; until then you can still practice and grade FRQs.</div>
          )}
        </div>
        {messages.length > 0 && starters.length > 0 && !busy && !outOfRequests && (
          <div className="ai-starters compact">
            {starters.slice(0, 3).map((s) => <button key={s} className="starter-chip" onClick={() => send(s)}>{s}</button>)}
          </div>
        )}
        <form className="ai-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask a question…"
            rows={2}
            maxLength={2000}
            tabIndex={open ? 0 : -1}
            disabled={outOfRequests}
            aria-label="Your question for the AI helper"
          />
          <button className="primary-btn" type="submit" disabled={busy || !input.trim() || outOfRequests}>Send</button>
        </form>
        <p className="ai-footnote">
          {chats && <strong>{chats.remaining} of {chats.limit} helper messages left today. </strong>}
          AI can make mistakes. Check important answers against your notes.
        </p>
      </>
    );
  }

  return (
    <>
      <div className={`drawer-scrim ${open ? "open" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside ref={drawerRef} className={`reference-drawer ai-drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open} aria-label="AI study helper">
        <div className="drawer-head">
          <h2><span className="ai-badge">AI</span> Study helper</h2>
          <div className="button-row">
            {messages.length > 0 && <button className="bar-btn" onClick={() => setThreads((t) => ({ ...t, [context.key]: [] }))}>New chat</button>}
            <button className="icon-btn" onClick={onClose} aria-label="Close AI helper">✕</button>
          </div>
        </div>
        {context.label && <p className="muted small ai-context">Helping with: {context.label}</p>}
        {body}
      </aside>
    </>
  );
}
