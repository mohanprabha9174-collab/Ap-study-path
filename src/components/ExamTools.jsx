import { useEffect, useMemo, useRef, useState } from "react";

export const HIGHLIGHT_COLORS = {
  yellow: "#ffe45c",
  blue: "#a8d4ff",
  pink: "#ffc2dd",
  green: "#b8f0c8"
};

// ---------------------------------------------------------------- highlighting
// Renders plain text with saved highlight ranges. When `active`, selecting text adds a highlight.
// Clicking an existing highlight removes it.
export function HighlightText({ text, ranges = [], active, color = "yellow", onChange, as: Tag = "p", className = "" }) {
  const ref = useRef(null);
  // Set when a drag just made a highlight, so the click that follows the drag doesn't remove it.
  const justSelected = useRef(false);

  function onMouseUp() {
    if (!active) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const box = ref.current;
    if (!box || !box.contains(range.startContainer) || !box.contains(range.endContainer)) return;
    const before = document.createRange();
    before.selectNodeContents(box);
    before.setEnd(range.startContainer, range.startOffset);
    const s = before.toString().length;
    const e = s + range.toString().length;
    sel.removeAllRanges();
    if (e <= s) return;
    justSelected.current = true;
    setTimeout(() => { justSelected.current = false; }, 0);
    // Merge with any highlights the new one touches, so nothing already marked is lost.
    let ns = s;
    let ne = e;
    const kept = [];
    ranges.forEach((r) => {
      if (r.e < s || r.s > e) kept.push(r);
      else { ns = Math.min(ns, r.s); ne = Math.max(ne, r.e); }
    });
    onChange([...kept, { s: ns, e: ne, c: color }].sort((a, b) => a.s - b.s));
  }

  const parts = useMemo(() => {
    const out = [];
    let pos = 0;
    [...ranges].sort((a, b) => a.s - b.s).forEach((r, i) => {
      if (r.s > pos) out.push({ text: text.slice(pos, r.s) });
      out.push({ text: text.slice(Math.max(r.s, pos), r.e), range: r, key: i });
      pos = Math.max(pos, r.e);
    });
    if (pos < text.length) out.push({ text: text.slice(pos) });
    return out;
  }, [text, ranges]);

  return (
    <Tag ref={ref} className={`${className} ${active ? "highlighting" : ""}`} onMouseUp={onMouseUp} onTouchEnd={onMouseUp}>
      {parts.map((p, i) =>
        p.range ? (
          <mark
            key={i}
            className="hl"
            style={{ background: HIGHLIGHT_COLORS[p.range.c] || HIGHLIGHT_COLORS.yellow }}
            title={active ? "Click to remove highlight" : undefined}
            onClick={() => {
              // Only a plain click with the highlighter on removes a highlight.
              if (!active || justSelected.current) return;
              const sel = window.getSelection();
              if (sel && !sel.isCollapsed) return;
              onChange(ranges.filter((r) => r !== p.range));
            }}
          >
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </Tag>
  );
}

// ---------------------------------------------------------------- reference drawer
export function ReferenceDrawer({ reference, open, onClose }) {
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return undefined;
    // Focus the search box on open and give focus back to the opener on close.
    const opener = document.activeElement;
    const onKey = (e) => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => searchRef.current?.focus(), 200);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, [open]);

  if (!reference) return null;
  const q = query.trim().toLowerCase();
  const sections = reference.sections
    .map((s) => ({ ...s, rows: s.rows.filter((r) => !q || s.title.toLowerCase().includes(q) || r.join(" ").toLowerCase().includes(q)) }))
    .filter((s) => s.rows.length);

  return (
    <>
      <div className={`drawer-scrim ${open ? "open" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside className={`reference-drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open} aria-label={reference.title}>
        <div className="drawer-head">
          <h2>{reference.title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close reference">✕</button>
        </div>
        <p className="muted small">{reference.note}</p>
        <input ref={searchRef} className="drawer-search" type="text" aria-label="Search the reference" placeholder="Search the reference" value={query} onChange={(e) => setQuery(e.target.value)} tabIndex={open ? 0 : -1} />
        <div className="drawer-body">
          {sections.length === 0 && <p className="muted">Nothing matches “{query}”.</p>}
          {sections.map((s) => (
            <section key={s.title} className="ref-section">
              <h3>{s.title}</h3>
              <dl>
                {s.rows.map(([code, desc]) => (
                  <div className="ref-row" key={code}>
                    <dt><code>{code}</code></dt>
                    <dd>{desc}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
}

// ---------------------------------------------------------------- small helpers
export function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (document.documentElement.classList.contains("reduce-motion") || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [message, onDone]);
  if (!message) return null;
  return <div className="toast" role="status">{message}</div>;
}

export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}
