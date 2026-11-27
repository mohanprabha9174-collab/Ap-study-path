// Progress + history storage. Signed-in users sync to the server; guests use this browser's localStorage.
import { api } from "./api.js";

const LOCAL_PREFIX = "ap-study-path:";

function localGet(key, fallback) {
  try {
    const raw = localStorage.getItem(LOCAL_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
// Lists from storage are checked so a damaged entry can't crash the page.
function localList(key) {
  const value = localGet(key, []);
  return Array.isArray(value) ? value.filter((x) => x && typeof x === "object") : [];
}
function localSet(key, value) {
  try { localStorage.setItem(LOCAL_PREFIX + key, JSON.stringify(value)); } catch { /* ignore */ }
}
function localRemove(key) {
  try { localStorage.removeItem(LOCAL_PREFIX + key); } catch { /* ignore */ }
}

// One-time migration of progress saved by the original single-course version of the site.
export function migrateLegacyProgress() {
  try {
    ["practice-1", "practice-2", "practice-3"].forEach((testId) => {
      const oldKey = `ap-study-path-ap-csp-progress-${testId}`;
      const old = localStorage.getItem(oldKey);
      if (old && !localStorage.getItem(`${LOCAL_PREFIX}progress:csp:${testId}`)) {
        const parsed = JSON.parse(old);
        localSet(`progress:csp:${testId}`, { mode: "practice", status: parsed.mode === "results" ? "done" : "active", currentIndex: parsed.currentIndex || 0, answers: parsed.answers || [] });
      }
    });
  } catch { /* ignore */ }
}

export function createStore(user) {
  const remote = Boolean(user);
  return {
    remote,

    async loadAllProgress() {
      if (remote) return (await api("/progress")).progress || {};
      const out = {};
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith(`${LOCAL_PREFIX}progress:`))
          .forEach((k) => { out[k.slice(`${LOCAL_PREFIX}progress:`.length)] = JSON.parse(localStorage.getItem(k)); });
      } catch { /* ignore */ }
      return out;
    },

    async saveProgress(key, state) {
      if (remote) {
        api(`/progress/${encodeURIComponent(key)}`, { method: "PUT", body: { state } }).catch(() => {});
        localSet(`progress:${key}`, state); // keep a local copy for instant resume
        return;
      }
      localSet(`progress:${key}`, state);
    },

    async clearProgress(key) {
      localRemove(`progress:${key}`);
      if (remote) await api(`/progress/${encodeURIComponent(key)}`, { method: "DELETE" }).catch(() => {});
    },

    async addAttempt(attempt) {
      if (remote) {
        try {
          await api("/attempts", { method: "POST", body: attempt });
        } catch {
          // Keep it on this device and send it next time the history loads.
          const pending = localList("pending-attempts");
          pending.push(attempt);
          localSet("pending-attempts", pending.slice(-50));
          window.dispatchEvent(new CustomEvent("ap-notice", { detail: "Your score couldn't reach your account, so it's kept on this device. It uploads the next time you open My Progress while signed in." }));
          return { saved: false };
        }
        return { saved: true };
      }
      const list = localList("attempts");
      list.unshift({ ...attempt, id: String(Date.now()), createdAt: new Date().toISOString() });
      localSet("attempts", list.slice(0, 200));
    },

    async listAttempts() {
      if (remote) {
        const pending = localList("pending-attempts");
        if (pending.length) {
          const left = [];
          for (const item of pending) {
            try { await api("/attempts", { method: "POST", body: item }); } catch { left.push(item); }
          }
          localSet("pending-attempts", left);
        }
        return (await api("/attempts")).attempts || [];
      }
      return localList("attempts");
    },

    async addFrqResult(entry) {
      if (remote) return; // the server saves graded submissions itself
      const list = localList("frq-history");
      list.unshift({ ...entry, id: String(Date.now()), createdAt: new Date().toISOString() });
      localSet("frq-history", list.slice(0, 200));
    },

    async listFrqHistory() {
      if (remote) return (await api("/frq/history")).submissions || [];
      return localList("frq-history");
    }
  };
}

// Drafts are always local so typing never waits on the network.
export function loadDraft(key) {
  return localGet(`draft:${key}`, "");
}
export function saveDraft(key, text) {
  localSet(`draft:${key}`, text);
}
