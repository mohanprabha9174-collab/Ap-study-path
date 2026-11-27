import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { navigate, useApp } from "../App.jsx";

// Reset a forgotten password with the account's recovery code, or with an emailed link
// (#/reset/<token>) when the site has email set up.
export default function ResetPage({ token }) {
  const { signIn, backend, user } = useApp();
  const [method, setMethod] = useState("code");
  const [emailOn, setEmailOn] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!backend.available) return;
    api("/auth/reset-options", { auth: false }).then((d) => setEmailOn(Boolean(d.email))).catch(() => setEmailOn(false));
  }, [backend.available]);

  if (user) {
    return (
      <section className="page">
        <div className="card results-card">
          <h1>You're signed in</h1>
          <p className="muted">To change your password, use Change password on My Progress.</p>
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
          <p className="muted">The server isn't reachable right now, so passwords can't be reset. Try again in a few minutes.</p>
          <button className="primary-btn" onClick={() => navigate("/")}>Keep practicing</button>
        </div>
      </section>
    );
  }

  async function reset(event) {
    event.preventDefault();
    setError("");
    if (password !== confirm) { setError("The two passwords don't match."); return; }
    setBusy(true);
    try {
      const body = token ? { token, newPassword: password } : { email, recoveryCode: code, newPassword: password };
      const data = await api("/auth/reset-password", { method: "POST", auth: false, body });
      await signIn(data.token, data.user, data.recoveryCode);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function sendLink(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await api("/auth/forgot", { method: "POST", auth: false, body: { email } });
      setSent(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const passwordFields = (
    <>
      <label htmlFor="reset-password">New password</label>
      <input id="reset-password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" />
      <label htmlFor="reset-confirm">New password again</label>
      <input id="reset-confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
    </>
  );

  return (
    <div className="auth-page">
      <section className="card auth-card">
        <div className="auth-copy">
          <h1>Reset your password</h1>
          {token ? (
            <p>Choose a new password. Signing in on other devices will need the new one.</p>
          ) : (
            <p>Use the <strong>recovery code</strong> you saved when you made your account. It looks like <code>ABCD-EF23-GH45</code>. After the reset you get a new code to save.</p>
          )}
        </div>

        {token ? (
          <form className="login-form" onSubmit={reset}>
            {passwordFields}
            {error && <div className="error-box" role="alert">{error}</div>}
            <button className="primary-btn" type="submit" disabled={busy}>{busy ? "Please wait…" : "Set new password"}</button>
            {error && <button type="button" className="link-btn" onClick={() => navigate("/reset")}>Get a new reset link</button>}
          </form>
        ) : method === "email" ? (
          <form className="login-form" onSubmit={sendLink}>
            <label htmlFor="reset-email">Email</label>
            <input id="reset-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            {error && <div className="error-box" role="alert">{error}</div>}
            {sent && <div className="success-box" role="status">{sent}</div>}
            <button className="primary-btn" type="submit" disabled={busy}>{busy ? "Sending…" : "Email me a reset link"}</button>
            <button type="button" className="link-btn" onClick={() => { setError(""); setMethod("code"); }}>Use my recovery code instead</button>
            <button type="button" className="link-btn" onClick={() => navigate("/login")}>Back to sign in</button>
          </form>
        ) : (
          <form className="login-form" onSubmit={reset}>
            <label htmlFor="reset-email">Email</label>
            <input id="reset-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <label htmlFor="reset-code">Recovery code</label>
            <input id="reset-code" required value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" spellCheck={false} placeholder="ABCD-EF23-GH45" className="code-input" />
            {passwordFields}
            {error && <div className="error-box" role="alert">{error}</div>}
            <button className="primary-btn" type="submit" disabled={busy}>{busy ? "Please wait…" : "Reset password"}</button>
            {emailOn && <button type="button" className="link-btn" onClick={() => { setError(""); setMethod("email"); }}>No code? Email me a reset link</button>}
            {!emailOn && <p className="muted small-note">Lost your code too? Contact the site owner and they can send you a reset link.</p>}
            <button type="button" className="link-btn" onClick={() => navigate("/login")}>Back to sign in</button>
          </form>
        )}
      </section>
    </div>
  );
}
