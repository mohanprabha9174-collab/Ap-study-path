import { useEffect, useRef, useState } from "react";

// AP CSP Create Task upload: code files are read as text; PDFs and screenshots are kept
// as files and sent to the AI grader. Everything is saved in this browser (IndexedDB),
// so a refresh doesn't lose the upload. Nothing is uploaded until the student grades.

const DB_NAME = "ap-study-path";
const STORE = "project";
const MAX_FILE = 8 * 1024 * 1024;
const MAX_TOTAL = 10 * 1024 * 1024;
const BINARY_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp", "image/gif"];
const TEXT_EXT = /\.(txt|md|js|jsx|ts|py|java|html|css|json|c|cpp|cs|swift|kt|rb|lua|scratch|csv)$/i;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbGet(key) {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const r = db.transaction(STORE).objectStore(STORE).get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => resolve(undefined);
    });
  } catch { return undefined; }
}
async function idbSet(key, value) {
  try {
    const db = await openDb();
    db.transaction(STORE, "readwrite").objectStore(STORE).put(value, key);
  } catch { /* storage unavailable: keep in memory only */ }
}

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
function readAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });
}
const sizeOf = (f) => Math.floor((f.data.length * 3) / 4);
const fmt = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/** Hook: the saved project { code, files } plus setters. */
export function useProject() {
  const [project, setProject] = useState({ code: "", files: [], codeFiles: [] });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    idbGet("csp").then((saved) => {
      if (saved) setProject({ code: saved.code || "", files: saved.files || [], codeFiles: saved.codeFiles || [] });
      setLoaded(true);
    });
  }, []);
  function update(next) {
    setProject(next);
    idbSet("csp", next);
  }
  return [project, update, loaded];
}

const MAX_CODE = 15000;
const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.md,.js,.jsx,.ts,.py,.java,.html,.css,.json,.c,.cpp,.cs,.swift,.kt,.rb,.lua,.scratch,.csv";

export default function ProjectUpload({ project, onChange, checklist }) {
  const [errors, setErrors] = useState([]);
  const [dragging, setDragging] = useState(false);
  // Once a project is uploaded the panel folds to one line so the question comes first.
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);
  // Always read the newest project, and handle one batch of files at a time,
  // so two quick uploads can't overwrite each other.
  const latest = useRef(project);
  latest.current = project;
  const queue = useRef(Promise.resolve());
  const ready = project.code.trim().length > 20 || project.files.length > 0;
  const codeFiles = project.codeFiles || [];

  function addFiles(fileList) {
    const list = Array.from(fileList || []);
    queue.current = queue.current.then(() => addBatch(list)).catch(() => {});
  }

  async function addBatch(list) {
    const problems = [];
    const base = latest.current;
    let code = base.code;
    const files = [...base.files];
    const names = [...(base.codeFiles || [])];
    let total = files.reduce((sum, f) => sum + sizeOf(f), 0);
    for (const file of list) {
      try {
        if (BINARY_TYPES.includes(file.type)) {
          if (files.some((f) => f.name === file.name && Math.abs(sizeOf(f) - file.size) < 4)) { problems.push(`${file.name} is already attached.`); continue; }
          if (file.size > MAX_FILE) { problems.push(`${file.name} is over 8 MB. Export a smaller PDF or crop the screenshots.`); continue; }
          if (total + file.size > MAX_TOTAL) { problems.push(`${file.name} would take your files past 10 MB. Remove one or use smaller screenshots.`); continue; }
          if (files.length >= 6) { problems.push(`${file.name} wasn't added: you can attach up to 6 files.`); continue; }
          files.push({ name: file.name, type: file.type, data: await readAsBase64(file) });
          total += file.size;
        } else if (TEXT_EXT.test(file.name) || file.type.startsWith("text/")) {
          if (names.includes(file.name)) { problems.push(`${file.name} is already in your pasted code.`); continue; }
          const text = await readAsText(file);
          const next = `${code ? `${code}\n\n` : ""}// ===== ${file.name} =====\n${text}`;
          if (next.length > MAX_CODE) problems.push(`${file.name} was cut off: code is limited to 15,000 characters. Upload screenshots of the rest instead.`);
          code = next.slice(0, MAX_CODE);
          names.push(file.name);
        } else {
          problems.push(`${file.name} isn't a supported type. Use a PDF, screenshots (PNG/JPG), or code files.`);
        }
      } catch {
        problems.push(`Couldn't read ${file.name}. Try saving it again and re-uploading.`);
      }
    }
    setErrors(problems);
    const next = { code, files, codeFiles: names };
    latest.current = next;
    onChange(next);
  }

  function removeCodeFile(name) {
    // Drop that file's section from the pasted code.
    const parts = project.code.split(/(?=\/\/ ===== .+ =====\n)/);
    const code = parts.filter((part) => !part.startsWith(`// ===== ${name} =====`)).join("").trim();
    onChange({ ...project, code, codeFiles: codeFiles.filter((n) => n !== name) });
    setErrors([]);
  }

  return (
    <div className={`card ppr-panel ${ready ? "ready" : "missing"} ${ready && !expanded ? "collapsed" : ""}`}>
      <div className="ppr-head">
        <div>
          <h2>Step 1: Upload your Create Task project</h2>
          <p>
            The written response questions ask about <strong>your own program</strong>. Upload your Personalized Project Reference (PPR) so the AI can check every answer against your actual code, just like an AP reader would.
          </p>
        </div>
        <div className="ppr-head__side">
          <span className={`ppr-status ${ready ? "ok" : "todo"}`}>
            {ready ? "Project ready" : "Not uploaded yet"}
          </span>
          {ready && (
            <button className="link-btn" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
              {expanded ? "Hide upload" : "View or change files"}
            </button>
          )}
        </div>
      </div>

      <p className="privacy-warning" role="note">
        <strong>Before you upload:</strong> remove your name and any personal info from screenshots. Your project stays in this browser and is only sent when you grade or ask the AI helper.
      </p>

      <label
        className={`file-drop big ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); if (!dragging) setDragging(true); }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
      >
        <strong>Drop files here or click to choose</strong>
        <span>Your PPR as a PDF, screenshots of your code (PNG or JPG), or code files (.js, .py, .java, .txt…). Up to 6 files, 10 MB total.</span>
        <input ref={inputRef} type="file" multiple accept={ACCEPT} onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      </label>

      {(project.files.length > 0 || codeFiles.length > 0) && (
        <ul className="file-chips">
          {codeFiles.map((name) => (
            <li key={`code-${name}`}>
              <span className="file-kind">CODE</span>
              {name} <small>in pasted code</small>
              <button aria-label={`Remove ${name}`} onClick={() => removeCodeFile(name)}>Remove</button>
            </li>
          ))}
          {project.files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <span className="file-kind">{f.type === "application/pdf" ? "PDF" : "IMG"}</span>
              {f.name} <small>{fmt(sizeOf(f))}</small>
              <button aria-label={`Remove ${f.name}`} onClick={() => { onChange({ ...project, files: project.files.filter((_, j) => j !== i) }); setErrors([]); }}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <details className="ppr-paste" open={project.code.length > 0}>
        <summary>Or paste your code as text {project.code ? `(${project.code.split("\n").length} lines)` : ""}</summary>
        <textarea className="ppr-textarea mono" aria-label="Your project code" value={project.code} onChange={(e) => onChange({ ...project, code: e.target.value.slice(0, 15000) })} placeholder="Paste your PPR code here…" />
      </details>

      {errors.length > 0 && (
        <div className="error-box" role="alert">
          {errors.length === 1 ? errors[0] : <ul>{errors.map((m) => <li key={m}>{m}</li>)}</ul>}
        </div>
      )}


      <details className="ppr-checklist-details">
        <summary>What your PPR must include</summary>
        <div className="checklist-grid">
          {checklist.map((group) => (
            <div className="checklist-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
