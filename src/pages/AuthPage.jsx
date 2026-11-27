import { useState } from "react";
import { api } from "../lib/api.js";
import { navigate, useApp } from "../App.jsx";

export default function AuthPage({ initialMode = "login" }) {
  const { signIn, backend, user } = useApp();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    return (
      <section className="page">
        <div className="card results-card">
          <h1>You're signed in</h1>
          <p className="muted">Signed in as {user.email}.</p>
          <button className="primary-btn" onClick={() => navigate("/dashboard")}>Go to my progress</button>
        </div>
      </section>
    );
  }

  if (!backend.available) {
    return (
      <section className="page">
        <div className="card results-card">
          <h1>Accounts are offline</h1>
          <p className="muted">This copy of the site is running without its server, so accounts and AI grading are unavailable. You can still practice everything as a guest; progress saves in this browser.</p>
          <button className="primary-btn" onClick={() => navigate("/")}>Keep practicing</button>
        </div>
      </section>
    );
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (mode === "register" && password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const path = mode === "register" ? "/auth/register" : "/auth/login";
      const data = await api(path, { method: "POST", auth: false, body: { email, password, name } });
      await signIn(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="card auth-card">
        <div className="auth-copy">
          <h1>{mode === "register" ? "Create your account" : "Welcome back"}</h1>
          <p>An account saves your exam progress and scores on any device and unlocks AI grading for free-response questions.</p>
          <div className="auth-highlights">
            <span>Progress sync</span>
            <span>Score history</span>
            <span>{backend.aiGrading ? "AI FRQ grading" : "FRQ rubric scoring"}</span>
          </div>
        </div>

        <form className="login-form" onSubmit={submit}>
          {mode === "register" && (
            <>
              <label htmlFor="auth-name">First name (optional)</label>
              <input id="auth-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" maxLength={60} />
            </>
          )}
          <label htmlFor="auth-email">Email</label>
          <input id="auth-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="student@example.com" />
          <label htmlFor="auth-password">Password</label>
          <input id="auth-password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} placeholder={mode === "register" ? "At least 8 characters" : ""} />
          {mode === "register" && (
            <>
              <label htmlFor="auth-confirm">Confirm password</label>
              <input id="auth-confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            </>
          )}
          {error && <div className="error-box" role="alert">{error}</div>}
          <button className="primary-btn" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}</button>
          <button type="button" className="link-btn" onClick={() => { setError(""); navigate(mode === "register" ? "/login" : "/login/register"); }}>
            {mode === "register" ? "Already have an account? Sign in" : "New here? Create a free account"}
          </button>
          <button type="button" className="link-btn" onClick={() => navigate("/")}>Continue as guest</button>
        </form>
      </section>
    </div>
  );
}
