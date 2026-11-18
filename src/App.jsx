import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

export function navigate(path) {
  window.location.hash = path.startsWith("/") ? path : `/${path}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function App() {
  const [route, setRoute] = useState(parseHash);
  const [backend, setBackend] = useState({ checked: false, available: false, aiGrading: false });
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

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
    signIn(token, nextUser) {
      setToken(token);
      setUser(nextUser);
    },
    signOut() {
      setToken(null);
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
    content = <AuthPage />;
  } else if (route.page === "dashboard") {
    content = <Dashboard />;
  } else if (courses[route.page]) {
    content = <CourseHub key={route.page} course={courses[route.page]} tab={route.sub || "tests"} extra={route.extra} />;
  } else {
    content = (
      <section className="page">
        <div className="card results-card">
          <h1>Page not found</h1>
          <button className="primary-btn" onClick={() => navigate("/")}>Go home</button>
        </div>
      </section>
    );
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className="app-shell">
        <Navbar route={route} />
        <main>{content}</main>
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

  return (
    <header className="topbar">
      <button className="brand" onClick={() => go("/")} aria-label="Go to home">
        <span className="brand-mark">AP</span>
        <span>AP Study Path</span>
      </button>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
      <div className={`nav-area ${open ? "open" : ""}`}>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <button key={link.id} className={route.page === link.id ? "active" : ""} onClick={() => go(link.path)}>
              {link.label}
            </button>
          ))}
        </nav>
        {user ? (
          <div className="user-chip">
            <span>{user.name || user.email}</span>
            <button onClick={signOut}>Sign out</button>
          </div>
        ) : backend.available ? (
          <button className="primary-btn small-btn" onClick={() => go("/login")}>Sign in</button>
        ) : null}
      </div>
    </header>
  );
}
