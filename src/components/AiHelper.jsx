import { useEffect, useRef, useState } from "react";
import { navigate, useApp } from "../App.jsx";
import { api } from "../lib/api.js";
import { CodeView } from "./ExamTools.jsx";

// Small, safe Markdown: headings, fenced code, inline code, **bold**, *italic*, bullet and
// numbered lists, tables and paragraphs. Builds React elements (no innerHTML), so model
// output can't inject HTML.
function renderInline(text, keyBase) {
  const parts = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|(?<![*\w])\*[^*\s][^*]*\*(?![*\w]))/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${i++}`;
    if (tok.startsWith("`")) parts.push(<code key={key}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("**")) parts.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    else parts.push(<em key={key}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const BULLET = /^\s*[-*•]\s+/;
const NUMBER = /^\s*\d+[.)]\s+/;
const TABLE_ROW = /^\s*\|.*\|\s*$/;

function renderLines(lines, key) {
  // Group consecutive lines by kind so a lead-in sentence followed by a list renders correctly.
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const heading = line.match(/^\s*(#{1,6})\s+(.*)$/);
    if (heading) {
      out.push(<h4 key={`${key}-h${i}`}>{renderInline(heading[2], `${key}-h${i}`)}</h4>);
      i++;
    } else if (TABLE_ROW.test(line)) {
      const rows = [];
      while (i < lines.length && TABLE_ROW.test(lines[i])) rows.push(lines[i++]);
      const cells = rows
        .filter((r) => !/^\s*\|[\s:|-]+\|\s*$/.test(r))
        .map((r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
      const [head, ...body] = cells;
      out.push(
        <div className="md-table" key={`${key}-t${i}`}>
          <table>
            <thead><tr>{head.map((c, ci) => <th key={ci}>{renderInline(c, `${key}-th${ci}`)}</th>)}</tr></thead>
            <tbody>{body.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci}>{renderInline(c, `${key}-td${ri}-${ci}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    } else if (BULLET.test(line) || NUMBER.test(line)) {
      const ordered = NUMBER.test(line);
      const re = ordered ? NUMBER : BULLET;
      const items = [];
      const first = ordered ? parseInt(line, 10) : 1;
      while (i < lines.length && re.test(lines[i])) items.push(lines[i++].replace(re, ""));
      const List = ordered ? "ol" : "ul";
      // Numbered lists split by blank lines keep counting (3. stays 3.).
      out.push(<List key={`${key}-l${i}`} start={ordered && first > 1 ? first : undefined}>{items.map((it, li) => <li key={li}>{renderInline(it, `${key}-li${i}-${li}`)}</li>)}</List>);
    } else {
      const para = [];
      while (i < lines.length && !/^\s*#{1,6}\s/.test(lines[i]) && !TABLE_ROW.test(lines[i]) && !BULLET.test(lines[i]) && !NUMBER.test(lines[i])) {
        para.push(lines[i++]);
      }
      out.push(<p key={`${key}-p${i}`}>{para.map((l, li) => <span key={li}>{li > 0 && <br />}{renderInline(l, `${key}-p${i}-${li}`)}</span>)}</p>);
    }
  }
  return out;
}

export function Markdown({ text }) {
  const blocks = [];
  const chunks = text.split(/```[\w+#.-]*\n?/);
  chunks.forEach((chunk, ci) => {
    if (ci % 2 === 1) {
      blocks.push(<CodeView key={`c${ci}`} className="small" code={chunk.replace(/\n$/, "")} />);
      return;
    }
    chunk.split(/\n{2,}/).forEach((para, pi) => {
      const lines = para.split("\n").filter((l) => l.trim());
      if (lines.length) blocks.push(...renderLines(lines, `${ci}-${pi}`));
    });
  });
  return <div className="md">{blocks}</div>;
}

/**
 * Slide-out AI helper.
 * context: { key, label, kind: "mcq"|"frq"|"general", questionId?, studentChoice?, answered?, frqId?, draft?, graded?, ppr? }
 * starters: quick prompts shown as buttons.
 */
const threadCache = {};

export default function AiHelper({ open, onClose, course, context, starters = [], autoAsk = "", onAutoAsked }) {
  const { user, backend } = useApp();
  // Chats are shared by every helper on the page (e.g. the quiz and its review screen),
  // so a conversation about a question is still there when it's opened from somewhere else.
  const [threads, setThreadsState] = useState(() => ({ ...threadCache }));
  const setThreads = (update) => setThreadsState((t) => {
    const next = typeof update === "function" ? update({ ...threadCache, ...t }) : update;
    Object.assign(threadCache, next);
    return next;
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const messages = threads[context.key] || [];
  // Don't offer a follow-up the student already asked.
  const followUps = starters.filter((s) => !messages.some((m) => m.role === "user" && m.content === s));
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

  // Opened from "Ask why this was marked wrong": send that question right away.
  useEffect(() => {
    if (open && autoAsk && canUse && !busy) {
      send(autoAsk);
      onAutoAsked?.();
    }
  }, [open, autoAsk]); // eslint-disable-line react-hooks/exhaustive-deps

  async function send(text, base = messages) {
    const content = text.trim();
    if (!content || busy || outOfRequests) return;
    // A question that failed earlier and was never answered is replaced by the new one.
    const trimmed = base[base.length - 1]?.role === "user" ? base.slice(0, -1) : base;
    const history = [...trimmed, { role: "user", content }];
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
          {error && !outOfRequests && (
            <div className="error-box" role="alert">
              {error}
              {messages[messages.length - 1]?.role === "user" && !outOfRequests && (
                <button className="link-btn inline" onClick={() => send(messages[messages.length - 1].content, messages.slice(0, -1))}>Try again</button>
              )}
            </div>
          )}
          {outOfRequests && (
            <div className="info-box">You've used all {chats.limit} AI helper messages for today. They reset at midnight Eastern time; until then you can still practice and grade FRQs.</div>
          )}
        </div>
        {messages.length > 0 && followUps.length > 0 && !busy && !outOfRequests && (
          <div className="ai-starters compact">
            {followUps.slice(0, 3).map((s) => <button key={s} className="starter-chip" onClick={() => send(s)}>{s}</button>)}
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
            {messages.length > 0 && <button className="bar-btn" onClick={() => { setThreads((t) => ({ ...t, [context.key]: [] })); setError(""); requestAnimationFrame(() => inputRef.current?.focus()); }}>New chat</button>}
            <button className="icon-btn" onClick={onClose} aria-label="Close AI helper">✕</button>
          </div>
        </div>
        {context.label && <p className="muted small ai-context">Helping with: {context.label}</p>}
        {body}
      </aside>
    </>
  );
}
