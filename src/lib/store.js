// Progress + history storage. Signed-in users sync to the server; guests use this browser's localStorage.
import { api, getToken } from "./api.js";

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
  const uid = user?.id || null;
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
      // After sign-out (no token any more) an exam screen closing must not write the signed-in
      // student's progress into this browser for the next person.
      if (remote && !getToken()) return;
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
          pending.push({ ...attempt, uid });
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
        // Only upload scores this same account saved while offline.
        const pending = localList("pending-attempts");
        const mine = pending.filter((p) => p.uid === uid);
        if (mine.length) {
          const left = pending.filter((p) => p.uid !== uid);
          for (const { uid: _ignored, ...item } of mine) {
            try { await api("/attempts", { method: "POST", body: item }); } catch { left.push({ ...item, uid }); }
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
    },

    // One graded answer with its feedback, for "See this answer" on My Progress.
    async getFrqSubmission(id) {
      if (remote) return (await api(`/frq/submission/${encodeURIComponent(id)}`)).submission;
      return localList("frq-history").find((h) => h.id === id) || null;
    }
  };
}

// Drafts are always local so typing never waits on the network. Each account has its own drafts,
// so two students on one computer never see each other's answers.
let draftOwner = "guest";
export function setDraftOwner(uid) {
  draftOwner = uid ? `u-${uid}` : "guest";
}
export function loadDraft(key) {
  const mine = localGet(`drafts:${draftOwner}:${key}`, null);
  if (mine !== null) return mine;
  // Drafts saved before they were kept per account belong to the guest.
  return draftOwner === "guest" ? localGet(`draft:${key}`, "") : "";
}
export function saveDraft(key, text) {
  localSet(`drafts:${draftOwner}:${key}`, text);
}
// When a guest signs in, their drafts move to the account unless it already has one for that FRQ.
export function moveGuestDrafts(uid) {
  try {
    const target = `u-${uid}`;
    const keys = Object.keys(localStorage);
    const guest = keys.filter((k) => k.startsWith(`${LOCAL_PREFIX}drafts:guest:`) || k.startsWith(`${LOCAL_PREFIX}draft:`));
    for (const k of guest) {
      const key = k.startsWith(`${LOCAL_PREFIX}draft:`) ? k.slice(`${LOCAL_PREFIX}draft:`.length) : k.slice(`${LOCAL_PREFIX}drafts:guest:`.length);
      const value = localStorage.getItem(k);
      const dest = `${LOCAL_PREFIX}drafts:${target}:${key}`;
      let empty = true;
      try { empty = !String(JSON.parse(value || '""')).trim(); } catch { /* keep */ }
      if (!empty && !String(JSON.parse(localStorage.getItem(dest) || '""')).trim()) localStorage.setItem(dest, value);
      localStorage.removeItem(k);
    }
  } catch { /* drafts stay where they are */ }
}
