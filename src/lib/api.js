// Small API client. VITE_API_URL lets a separately hosted frontend (e.g. GitHub Pages)
// talk to the backend; when empty, the API is assumed to be on the same origin.

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "ap-study-path:token";

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* storage unavailable */ }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "content-type": "application/json" };
  const token = getToken();
  if (auth && token) headers.authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(`${API_BASE}/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // A signed-in request that comes back 401 means the session ended (expired, password changed,
    // account removed). Sign out everywhere so the page doesn't pretend the student is still signed in.
    if (res.status === 401 && auth && token) {
      setToken(null);
      window.dispatchEvent(new CustomEvent("ap-session-expired"));
    }
    const fallback = res.status === 429 ? "Too many requests. Wait a few minutes and try again." : `Request failed (${res.status})`;
    throw new ApiError(data.error || fallback, res.status);
  }
  return data;
}

// Returns { available, aiGrading } — the site still works in offline/guest mode if the backend is absent.
export async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return { available: false, aiGrading: false };
    const data = await res.json();
    return { available: Boolean(data.ok), aiGrading: Boolean(data.aiGrading) };
  } catch {
    return { available: false, aiGrading: false };
  }
}
