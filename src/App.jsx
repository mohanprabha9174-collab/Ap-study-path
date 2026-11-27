import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { courses } from "./data/courses.js";
import { api, checkBackend, getToken, setToken } from "./lib/api.js";
import { createStore, migrateLegacyProgress } from "./lib/store.js";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CourseHub from "./pages/CourseHub.jsx";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

function parseHash() {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  return { page: parts[0] || "home", sub: parts[1] || null, extra: parts[2] || null };
}

// When a guest signs in or creates an account, move what they did as a guest into the account:
// unfinished exams the account doesn't already have, and finished scores.
async function carryOverGuestWork() {
  const PREFIX = "ap-study-path:";
  let moved = 0;
  try {
    const { progress: remote = {} } = await api("/progress");
    for (const k of Object.keys(localStorage).filter((x) => x.startsWith(`${PREFIX}progress:`))) {
      const key = k.slice(`${PREFIX}progress:`.length);
      if (remote[key]) continue;
      const state = JSON.parse(localStorage.getItem(k) || "null");
      if (!state?.started) continue;
      await api(`/progress/${encodeURIComponent(key)}`, { method: "PUT", body: { state } });
      moved += 1;
    }
    const attempts = JSON.parse(localStorage.getItem(`${PREFIX}attempts`) || "[]");
    if (Array.isArray(attempts) && attempts.length) {
      const left = [];
      for (const a of attempts.slice().reverse()) {
        try { await api("/attempts", { method: "POST", body: a }); moved += 1; } catch { left.unshift(a); }
      }
      localStorage.setItem(`${PREFIX}attempts`, JSON.stringify(left));
    }
  } catch { /* the guest copies stay on this device if anything fails */ }
  if (moved) window.dispatchEvent(new CustomEvent("ap-notice", { detail: "Your guest progress was added to your account." }));
}

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
export const scrollBehavior = () => (reducedMotion() ? "auto" : "smooth");

// Exam progress of a signed-in student also lives on the server; the local copy is removed on
// sign-out or session expiry so the next person on a shared computer doesn't inherit it.
function clearLocalProgress() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("ap-study-path:progress:"))
      .forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

export function navigate(path) {
  window.location.hash = path.startsWith("/") ? path : `/${path}`;
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
}

export default function App() {
  const [route, setRoute] = useState(parseHash);
  const [backend, setBackend] = useState({ checked: false, available: false, aiGrading: false });
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const expired = () => {
      clearLocalProgress();
      setUser(null);
      setNotice("Your session ended, so you've been signed out. Sign in again to keep saving to your account.");
    };
    const note = (e) => setNotice(String(e.detail || ""));
    window.addEventListener("ap-session-expired", expired);
    window.addEventListener("ap-notice", note);
    return () => {
      window.removeEventListener("ap-session-expired", expired);
      window.removeEventListener("ap-notice", note);
    };
  }, []);

  // After moving to another page, put keyboard and screen-reader focus at the top of the new content.
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) { firstRoute.current = false; return; }
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [route.page, route.sub]);

  useEffect(() => {
    const course = courses[route.page];
    const names = { home: "", login: route.sub === "register" ? "Create an account" : "Sign in", dashboard: "My progress" };
    const tabNames = { tests: "Practice exams", quiz: "Custom quiz", frq: "FRQ practice", notes: "Unit notes", tips: "Tips" };
    const part = course ? `${course.short} ${tabNames[route.sub] || "Practice exams"}` : names[route.page] ?? "Page not found";
    document.title = part ? `${part} | AP Study Path` : "AP Study Path: AP CSP, CSA and Cyber practice";
  }, [route]);

  useEffect(() => {
    migrateLegacyProgress();
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const status = await checkBackend();
      if (cancelled) return;
      setBackend({ checked: true, ...status });
      if (status.available && getToken()) {
        try {
          const { user: me } = await api("/auth/me");
          if (!cancelled) setUser(me);
        } catch {
          setToken(null);
        }
      }
      if (!cancelled) setAuthChecked(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const store = useMemo(() => createStore(user), [user]);

  const ctx = {
    backend,
    user,
    store,
    async signIn(token, nextUser) {
      setToken(token);
      await carryOverGuestWork();
      setUser(nextUser);
    },
    signOut() {
      setToken(null);
      // Exam progress is also kept on the server; remove the local copy here so the next person
      // on a shared or school computer doesn't see them.
      clearLocalProgress();
      setUser(null);
      navigate("/");
    }
  };

  let content;
  if (!authChecked) {
    content = <div className="page"><div className="card loading-card">Loading AP Study Path…</div></div>;
  } else if (route.page === "home") {
    content = <Home />;
  } else if (route.page === "login") {
    content = <AuthPage key={route.sub || "login"} initialMode={route.sub === "register" ? "register" : "login"} />;
  } else if (route.page === "dashboard") {
    content = <Dashboard />;
  } else if (Object.hasOwn(courses, route.page)) {
    content = <CourseHub key={route.page} course={courses[route.page]} tab={route.sub || "tests"} extra={route.extra} />;
  } else {
    content = (
      <section className="page">
        <div className="card results-card not-found">
          <h1>Page not found</h1>
          <p className="muted">That link doesn't go anywhere. Pick a course or go back to the home page.</p>
          <div className="button-row">
            <button className="primary-btn" onClick={() => navigate("/csp")}>AP CSP</button>
            <button className="primary-btn" onClick={() => navigate("/csa")}>AP CSA</button>
            <button className="primary-btn" onClick={() => navigate("/cyber")}>AP Cyber</button>
            <button className="ghost-btn" onClick={() => navigate("/")}>Go home</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className="app-shell">
        <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>Skip to content</a>
        <Navbar route={route} />
        {notice && (
          <div className="site-notice" role="status">
            <p>{notice}</p>
            {!user && backend.available && notice.includes("signed out") && (
              <button className="primary-btn small-btn" onClick={() => { setNotice(""); navigate("/login"); }}>Sign in</button>
            )}
            <button className="link-btn" onClick={() => setNotice("")}>Dismiss</button>
          </div>
        )}
        <main id="main" tabIndex={-1}>{content}</main>
        <footer className="site-footer">
          <p>AP Study Path: free practice for AP CSP, AP CSA, and AP Cybersecurity. AP® is a trademark registered by the College Board, which is not affiliated with and does not endorse this site.</p>
        </footer>
      </div>
    </AppContext.Provider>
  );
}

function Navbar({ route }) {
  const { user, backend, signOut } = useApp();
  const [open, setOpen] = useState(false);
  const links = [
    { path: "/", id: "home", label: "Home" },
    { path: "/csp", id: "csp", label: "AP CSP" },
    { path: "/csa", id: "csa", label: "AP CSA" },
    { path: "/cyber", id: "cyber", label: "AP Cyber" },
    { path: "/dashboard", id: "dashboard", label: "My Progress" }
  ];
  const go = (path) => { setOpen(false); navigate(path); };
  const toggleRef = useRef(null);
  const areaRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); toggleRef.current?.focus(); } };
    const onDown = (e) => {
      if (!areaRef.current?.contains(e.target) && !toggleRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [open]);

  return (
    <header className="topbar">
      <button className="brand" onClick={() => go("/")} aria-label="Go to home">
        <span className="brand-mark">AP</span>
        <span>AP Study Path</span>
      </button>
      <button ref={toggleRef} className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} aria-controls="site-nav">☰</button>
      <div id="site-nav" ref={areaRef} className={`nav-area ${open ? "open" : ""}`}>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <button key={link.id} className={route.page === link.id ? "active" : ""} aria-current={route.page === link.id ? "page" : undefined} onClick={() => go(link.path)}>
              {link.label}
            </button>
          ))}
        </nav>
        {user ? (
          <div className="user-chip">
            <span>{user.name || user.email}</span>
            <button onClick={signOut}>Sign out</button>
          </div>
        ) : backend.available && route.page !== "login" ? (
          <button className="primary-btn small-btn" onClick={() => go("/login")}>Sign in</button>
        ) : null}
      </div>
    </header>
  );
}
