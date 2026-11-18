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
        await api("/attempts", { method: "POST", body: attempt }).catch(() => {});
        return;
      }
      const list = localGet("attempts", []);
      list.unshift({ ...attempt, id: String(Date.now()), createdAt: new Date().toISOString() });
      localSet("attempts", list.slice(0, 200));
    },

    async listAttempts() {
      if (remote) return (await api("/attempts")).attempts || [];
      return localGet("attempts", []);
    },

    async addFrqResult(entry) {
      if (remote) return; // the server saves graded submissions itself
      const list = localGet("frq-history", []);
      list.unshift({ ...entry, id: String(Date.now()), createdAt: new Date().toISOString() });
      localSet("frq-history", list.slice(0, 200));
    },

    async listFrqHistory() {
      if (remote) return (await api("/frq/history")).submissions || [];
      return localGet("frq-history", []);
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
