// Test-taking preferences, remembered in this browser.
import { useEffect, useState } from "react";

const KEY = "ap-study-path:prefs";

export const DEFAULT_PREFS = {
  textScale: 1,          // 0.9 | 1 | 1.15 | 1.3
  showTimer: true,
  eliminator: true,
  highlightColor: "yellow", // yellow | blue | pink | green
  reduceMotion: false,
  confirmSubmit: true
};

function load() {
  try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return { ...DEFAULT_PREFS }; }
}

const listeners = new Set();
let current = null;

export function usePrefs() {
  const [prefs, setPrefsState] = useState(() => current || (current = load()));
  useEffect(() => {
    listeners.add(setPrefsState);
    return () => listeners.delete(setPrefsState);
  }, []);
  function setPrefs(patch) {
    current = { ...current, ...patch };
    try { localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* ignore */ }
    listeners.forEach((fn) => fn(current));
    document.documentElement.classList.toggle("reduce-motion", Boolean(current.reduceMotion));
  }
  useEffect(() => { document.documentElement.classList.toggle("reduce-motion", Boolean(prefs.reduceMotion)); }, [prefs.reduceMotion]);
  return [prefs, setPrefs];
}
