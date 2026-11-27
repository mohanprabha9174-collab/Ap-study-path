import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// If something on the page crashes (for example damaged saved data), show a way out instead of a blank page.
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.error(err); }
  reset = () => {
    try {
      Object.keys(localStorage).filter((k) => k.startsWith("ap-study-path:") && !k.endsWith(":token")).forEach((k) => localStorage.removeItem(k));
    } catch { /* ignore */ }
    window.location.hash = "/";
    window.location.reload();
  };
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="page"><div className="card results-card">
        <h1>This page hit a problem</h1>
        <p>Reload to try again. If it keeps happening, clear this browser's saved practice data (your account data is safe).</p>
        <div className="button-row">
          <button className="primary-btn" onClick={() => window.location.reload()}>Reload</button>
          <button className="secondary-btn" onClick={this.reset}>Clear saved data on this browser</button>
        </div>
      </div></div>
    );
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
