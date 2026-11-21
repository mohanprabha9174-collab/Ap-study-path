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
  const [project, setProject] = useState({ code: "", files: [] });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    idbGet("csp").then((saved) => {
      if (saved) setProject({ code: saved.code || "", files: saved.files || [] });
      setLoaded(true);
    });
  }, []);
  function update(next) {
    setProject(next);
    idbSet("csp", next);
  }
  return [project, update, loaded];
}

export default function ProjectUpload({ project, onChange, checklist }) {
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const ready = project.code.trim().length > 20 || project.files.length > 0;

  async function addFiles(fileList) {
    setError("");
    let code = project.code;
    const files = [...project.files];
    let total = files.reduce((s, f) => s + sizeOf(f), 0);
    for (const file of Array.from(fileList)) {
      try {
        if (BINARY_TYPES.includes(file.type)) {
          if (file.size > MAX_FILE) { setError(`${file.name} is over 8 MB. Export a smaller PDF or crop the screenshots.`); continue; }
          if (total + file.size > MAX_TOTAL) { setError("Your files add up to more than 10 MB. Remove one or use smaller screenshots."); continue; }
          if (files.length >= 6) { setError("You can attach up to 6 files."); continue; }
          files.push({ name: file.name, type: file.type, data: await readAsBase64(file) });
          total += file.size;
        } else if (TEXT_EXT.test(file.name) || file.type.startsWith("text/")) {
          const text = await readAsText(file);
          code = `${code ? `${code}\n\n` : ""}// ===== ${file.name} =====\n${text}`.slice(0, 15000);
        } else {
          setError(`${file.name} isn't a supported type. Use a PDF, screenshots (PNG/JPG), or code files.`);
        }
      } catch {
        setError(`Couldn't read ${file.name}. Try saving it again and re-uploading.`);
      }
    }
    onChange({ code, files });
  }

  return (
    <div className={`card ppr-panel ${ready ? "ready" : "missing"}`}>
      <div className="ppr-head">
        <div>
          <h2>Step 1: Upload your Create Task project</h2>
          <p>
            The written response questions ask about <strong>your own program</strong>. Upload your Personalized Project Reference (PPR) so the AI can check every answer against your actual code, just like an AP reader would.
          </p>
        </div>
        <span className={`ppr-status ${ready ? "ok" : "todo"}`}>
          {ready ? "Project ready" : "Not uploaded yet"}
        </span>
      </div>

      <label
        className={`file-drop big ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
      >
        <strong>Drop files here or click to choose</strong>
        <span>Your PPR as a PDF, screenshots of your code (PNG or JPG), or code files (.js, .py, .java, .txt…). Up to 6 files, 10 MB total.</span>
        <input ref={inputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.md,.js,.jsx,.ts,.py,.java,.html,.css,.json,.c,.cpp,.cs" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      </label>

      {project.files.length > 0 && (
        <ul className="file-chips">
          {project.files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <span className="file-kind">{f.type === "application/pdf" ? "PDF" : "IMG"}</span>
              {f.name} <small>{fmt(sizeOf(f))}</small>
              <button aria-label={`Remove ${f.name}`} onClick={() => onChange({ ...project, files: project.files.filter((_, j) => j !== i) })}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <details className="ppr-paste" open={project.code.length > 0}>
        <summary>Or paste your code as text {project.code ? `(${project.code.split("\n").length} lines)` : ""}</summary>
        <textarea className="ppr-textarea mono" value={project.code} onChange={(e) => onChange({ ...project, code: e.target.value.slice(0, 15000) })} placeholder="Paste your PPR code here…" />
      </details>

      {error && <div className="error-box">{error}</div>}
      <p className="muted small">Remove your name and any personal info from screenshots first. Your project stays saved in this browser and is only sent when you grade or ask the AI helper.</p>

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
