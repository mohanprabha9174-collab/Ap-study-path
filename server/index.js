import "./env.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { openDatabase } from "./db.js";
import { aiEnabled, aiProvider, gradeWithAI, gradeWithRubric } from "./grader.js";
import { aiSettingsSeen, estimateCostUsd, onUsage } from "./ai.js";
import { courses } from "../src/data/courses.js";
import { tutorReply } from "./tutor.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3001);
const IS_PROD = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET || (IS_PROD ? null : "dev-only-secret-change-me");
if (!JWT_SECRET) {
  console.error("JWT_SECRET must be set in production.");
  process.exit(1);
}

const db = await openDatabase();
const app = express();
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
// Most requests are small; the two AI routes may carry an uploaded project (PDF/images).
const smallJson = express.json({ limit: "200kb" });
const bigJson = express.json({ limit: "14mb" });
const BIG_ROUTES = new Set(["/api/frq/grade", "/api/ai/help"]);
app.use((req, res, next) => (BIG_ROUTES.has(req.path) ? bigJson : smallJson)(req, res, next));

// Allow a separately hosted frontend (e.g. GitHub Pages) to call this API.
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
if (allowedOrigins.length) {
  app.use("/api", cors({ origin: allowedOrigins }));
}

const now = () => new Date().toISOString();
const newId = () => crypto.randomUUID();

// ---------- password hashing (scrypt, built into Node) ----------
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}
function verifyPassword(password, stored) {
  const [, salt, hash] = String(stored).split("$");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64);
  const known = Buffer.from(hash, "hex");
  return known.length === test.length && crypto.timingSafeEqual(known, test);
}

function issueToken(user) {
  // pv ties the token to the current password, so changing the password signs out old sessions.
  return jwt.sign({ sub: user.id, email: user.email, pv: passwordVersion(user) }, JWT_SECRET, { expiresIn: "30d" });
}
function passwordVersion(user) {
  return crypto.createHash("sha256").update(String(user.password_hash)).digest("hex").slice(0, 12);
}
const courseFor = (id) => (typeof id === "string" && Object.hasOwn(courses, id) ? courses[id] : null);
function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name || "", createdAt: u.created_at };
}

async function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Please sign in." });
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Your session expired. Please sign in again." });
  }
  try {
    const user = await db.get("SELECT id, password_hash FROM users WHERE id = ?", [payload.sub]);
    if (!user || (payload.pv && payload.pv !== passwordVersion(user))) {
      return res.status(401).json({ error: "Your session expired. Please sign in again." });
    }
    req.userId = user.id;
    next();
  } catch (err) {
    next(err);
  }
}

// ---------- AI spending caps ----------
// Per-hour limits live in the rate limiters below. These daily caps are a hard ceiling on
// ---------- AI limits ----------
// Students get separate daily allowances for FRQ grading and for the chat helper, and the
// whole site has a dollar budget per month (and per day), so the API bill can't run away.
// Defaults are sized for about 1,000 students on Claude Haiku 5.5; change them in the host's
// environment settings without touching code.
const LIMITS = {
  grade: Number(process.env.AI_GRADES_PER_DAY || 8),
  help: Number(process.env.AI_CHATS_PER_DAY || 20)
};
const AI_DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT || 8000); // backstop on total calls a day
const MONTHLY_BUDGET = Number(process.env.AI_MONTHLY_BUDGET_USD || 100);
const DAILY_BUDGET = Math.min(MONTHLY_BUDGET, Number(process.env.AI_DAILY_BUDGET_USD || Math.max(1, MONTHLY_BUDGET / 15)));
// Daily limits reset at midnight in the students' time zone (US Eastern by default).
const AI_TIMEZONE = process.env.AI_TIMEZONE || "America/New_York";
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: AI_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

// Add the estimated cost of every AI call to today's spend.
onUsage((usage) => {
  const micro = Math.round(estimateCostUsd(usage) * 1e6);
  if (!micro) return;
  db.run(
    "INSERT INTO ai_spend (day, micro_usd) VALUES (?, ?) ON CONFLICT (day) DO UPDATE SET micro_usd = ai_spend.micro_usd + ?",
    [today(), micro, micro]
  ).catch((err) => console.error("Couldn't record AI spend:", err.message));
});

async function spendUsd() {
  const day = today();
  const month = day.slice(0, 7);
  const d = await db.get("SELECT COALESCE(SUM(micro_usd), 0) AS n FROM ai_spend WHERE day = ?", [day]);
  const m = await db.get("SELECT COALESCE(SUM(micro_usd), 0) AS n FROM ai_spend WHERE day LIKE ?", [`${month}%`]);
  return { today: Number(d?.n || 0) / 1e6, month: Number(m?.n || 0) / 1e6 };
}

async function usageFor(userId) {
  const rows = await db.all("SELECT kind, calls FROM ai_quota WHERE day = ? AND user_id = ?", [today(), userId]);
  const used = { grade: 0, help: 0 };
  rows.forEach((r) => { if (r.kind in used) used[r.kind] = Number(r.calls); });
  const pack = (kind) => ({ used: used[kind], limit: LIMITS[kind], remaining: Math.max(0, LIMITS[kind] - used[kind]) });
  return { grades: pack("grade"), chats: pack("help") };
}

async function reserveAiCall(userId, kind) {
  const day = today();
  const spend = await spendUsd();
  if (spend.month >= MONTHLY_BUDGET) {
    return { ok: false, reason: "The site has used this month's AI budget. AI features come back next month; rubric scoring still works." };
  }
  if (spend.today >= DAILY_BUDGET) {
    return { ok: false, reason: "The site has reached today's AI limit. AI features come back tomorrow; rubric scoring still works." };
  }
  const site = await db.get("SELECT COALESCE(SUM(calls), 0) AS n FROM ai_quota WHERE day = ?", [day]);
  if (Number(site?.n || 0) >= AI_DAILY_LIMIT) {
    return { ok: false, reason: "The site has reached today's AI limit. AI features come back tomorrow; rubric scoring still works." };
  }
  const mine = await db.get("SELECT calls FROM ai_quota WHERE day = ? AND user_id = ? AND kind = ?", [day, userId, kind]);
  if (Number(mine?.calls || 0) >= LIMITS[kind]) {
    return {
      ok: false,
      reason: kind === "grade"
        ? `You've used all ${LIMITS.grade} AI grades for today. They reset at midnight Eastern time; until then you get the rubric estimate.`
        : `You've used all ${LIMITS.help} AI helper messages for today. They reset at midnight Eastern time.`
    };
  }
  await db.run(
    "INSERT INTO ai_quota (day, user_id, kind, calls) VALUES (?, ?, ?, 1) ON CONFLICT (day, user_id, kind) DO UPDATE SET calls = ai_quota.calls + 1",
    [day, userId, kind]
  );
  return { ok: true };
}

// Give a reserved call back when the request fails before the AI answered.
async function releaseAiCall(userId, kind) {
  await db.run("UPDATE ai_quota SET calls = calls - 1 WHERE day = ? AND user_id = ? AND kind = ? AND calls > 0", [today(), userId, kind]).catch(() => {});
}

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Login is limited per email + network, and only failed tries count, so a class on one
// school network can't lock each other out.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip)}|${String(req.body?.email || "").trim().toLowerCase()}`,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many wrong passwords for this email. Wait 15 minutes and try again." }
});
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many new accounts from this network. Try again in an hour." }
});
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => req.userId || ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many password changes. Wait 15 minutes and try again." }
});
const gradeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: Number(process.env.GRADE_LIMIT_PER_HOUR || 30),
  keyGenerator: (req) => req.userId || ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "You've reached the hourly AI grading limit. Take a break and try again soon." }
});

// ---------- health / config ----------
app.get("/api/health", (req, res) => {
  res.json({ ok: true, database: db.kind, aiGrading: aiEnabled() });
});

// ---------- auth ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post("/api/auth/register", registerLimiter, wrap(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const name = String(req.body.name || "").trim().slice(0, 60);
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Enter a valid email address." });
  if (password.trim().length < 8) return res.status(400).json({ error: "Password must be at least 8 characters (not counting spaces at the ends)." });
  if (await db.get("SELECT id FROM users WHERE email = ?", [email])) {
    return res.status(409).json({ error: "An account with this email already exists. Sign in instead." });
  }
  const user = { id: newId(), email, name, password_hash: hashPassword(password), created_at: now() };
  await db.run("INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    [user.id, user.email, user.name, user.password_hash, user.created_at]);
  res.status(201).json({ token: issueToken(user), user: publicUser(user) });
}));

app.post("/api/auth/login", loginLimiter, wrap(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: "Email or password is incorrect." });
  }
  res.json({ token: issueToken(user), user: publicUser(user) });
}));

app.get("/api/auth/me", requireAuth, wrap(async (req, res) => {
  const user = await db.get("SELECT * FROM users WHERE id = ?", [req.userId]);
  if (!user) return res.status(401).json({ error: "Account not found." });
  res.json({ user: publicUser(user) });
}));

app.post("/api/auth/change-password", requireAuth, passwordLimiter, wrap(async (req, res) => {
  const { currentPassword = "", newPassword = "" } = req.body;
  const user = await db.get("SELECT * FROM users WHERE id = ?", [req.userId]);
  if (!user || !verifyPassword(String(currentPassword), user.password_hash)) {
    // 400, not 401: a wrong current password must not look like an expired session.
    return res.status(400).json({ error: "Current password is incorrect." });
  }
  if (String(newPassword).trim().length < 8) return res.status(400).json({ error: "New password must be at least 8 characters (not counting spaces at the ends)." });
  if (verifyPassword(String(newPassword), user.password_hash)) return res.status(400).json({ error: "Choose a password that's different from your current one." });
  const passwordHash = hashPassword(String(newPassword));
  await db.run("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, user.id]);
  // Old sessions stop working; this device gets a fresh token.
  res.json({ ok: true, token: issueToken({ ...user, password_hash: passwordHash }) });
}));

// ---------- in-progress test state ----------
const KEY_RE = /^[a-z0-9:_-]{1,80}$/i;

app.get("/api/progress/:key", requireAuth, wrap(async (req, res) => {
  if (!KEY_RE.test(req.params.key)) return res.status(400).json({ error: "Bad key" });
  const row = await db.get("SELECT state FROM test_progress WHERE user_id = ? AND test_key = ?", [req.userId, req.params.key]);
  res.json({ state: row ? JSON.parse(row.state) : null });
}));

app.get("/api/progress", requireAuth, wrap(async (req, res) => {
  const rows = await db.all("SELECT test_key, state FROM test_progress WHERE user_id = ?", [req.userId]);
  const out = {};
  rows.forEach((r) => { out[r.test_key] = JSON.parse(r.state); });
  res.json({ progress: out });
}));

app.put("/api/progress/:key", requireAuth, wrap(async (req, res) => {
  if (!KEY_RE.test(req.params.key)) return res.status(400).json({ error: "Bad key" });
  const state = JSON.stringify(req.body.state ?? null);
  // Refuse oversized saves instead of cutting them, which would store broken JSON.
  if (state.length > 200000) return res.status(413).json({ error: "This saved exam is too large. Remove some highlights and try again." });
  await db.run("DELETE FROM test_progress WHERE user_id = ? AND test_key = ?", [req.userId, req.params.key]);
  await db.run("INSERT INTO test_progress (user_id, test_key, state, updated_at) VALUES (?, ?, ?, ?)",
    [req.userId, req.params.key, state, now()]);
  res.json({ ok: true });
}));

app.delete("/api/progress/:key", requireAuth, wrap(async (req, res) => {
  await db.run("DELETE FROM test_progress WHERE user_id = ? AND test_key = ?", [req.userId, req.params.key]);
  res.json({ ok: true });
}));

// ---------- completed attempts ----------
app.post("/api/attempts", requireAuth, wrap(async (req, res) => {
  const { course, testId, title, score, total, unitBreakdown } = req.body;
  if (!courseFor(course)) return res.status(400).json({ error: "Unknown course" });
  const cleanTotal = Math.min(500, Math.max(1, Number(total) | 0));
  const attempt = {
    id: newId(), course, testId: String(testId || "unknown").slice(0, 80), title: String(title || "").slice(0, 120),
    score: Math.min(cleanTotal, Math.max(0, Number(score) | 0)), total: cleanTotal
  };
  await db.run(
    "INSERT INTO attempts (id, user_id, course, test_id, title, score, total, unit_breakdown, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [attempt.id, req.userId, attempt.course, attempt.testId, attempt.title, attempt.score, attempt.total, JSON.stringify(cleanBreakdown(unitBreakdown)), now()]
  );
  res.status(201).json({ ok: true, id: attempt.id });
}));

app.get("/api/attempts", requireAuth, wrap(async (req, res) => {
  const rows = await db.all(
    "SELECT id, course, test_id, title, score, total, unit_breakdown, created_at FROM attempts WHERE user_id = ? ORDER BY created_at DESC LIMIT 200",
    [req.userId]
  );
  res.json({ attempts: rows.map((r) => ({
    id: r.id, course: r.course, testId: r.test_id, title: r.title, score: r.score, total: r.total,
    unitBreakdown: JSON.parse(r.unit_breakdown || "{}"), createdAt: r.created_at
  })) });
}));

// ---------- FRQ grading ----------
// Uploaded project files (AP CSP Create Task): images or a PDF, sent as base64.
const FILE_TYPES = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp", "image/gif"]);
function cleanFiles(list) {
  if (!Array.isArray(list)) return [];
  let total = 0;
  const out = [];
  for (const f of list.slice(0, 6)) {
    if (!f || !FILE_TYPES.has(f.type) || typeof f.data !== "string" || !/^[A-Za-z0-9+/=]+$/.test(f.data)) continue;
    const bytes = Math.floor((f.data.length * 3) / 4);
    if (bytes > 8 * 1024 * 1024 || total + bytes > 10 * 1024 * 1024) continue;
    total += bytes;
    out.push({ name: String(f.name || "file").slice(0, 120), type: f.type, data: f.data });
  }
  return out;
}

const MAX_RESPONSE = 12000;
// Keep only well-formed unit rows ({unit, name, correct, total}) so a bad save can't break My Progress.
function cleanBreakdown(raw) {
  const out = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [k, v] of Object.entries(raw).slice(0, 20)) {
    if (!v || typeof v !== "object") continue;
    const total = Math.max(0, Number(v.total) | 0);
    const correct = Math.min(total, Math.max(0, Number(v.correct) | 0));
    const unit = Number(v.unit) | 0;
    if (!total || !unit) continue;
    out[String(k).slice(0, 10)] = { unit, name: String(v.name || "").slice(0, 80), correct, total };
  }
  return out;
}

function findFrq(course, frqId) {
  return courseFor(course)?.frqs?.find((f) => f.id === frqId) || null;
}

app.post("/api/frq/grade", requireAuth, gradeLimiter, wrap(async (req, res) => {
  const { course, frqId } = req.body;
  if (typeof req.body.response !== "string") return res.status(400).json({ error: "Write a response before grading." });
  const frq = findFrq(course, frqId);
  if (!frq) return res.status(404).json({ error: "FRQ not found." });
  if (req.body.response.length > MAX_RESPONSE) {
    return res.status(413).json({ error: `Your answer is ${req.body.response.length.toLocaleString()} characters. The limit is ${MAX_RESPONSE.toLocaleString()}; shorten it and grade again.` });
  }
  const response = req.body.response;
  const ppr = String(req.body.ppr || "").slice(0, 15000);
  if (response.trim().length < 10) return res.status(400).json({ error: "Write a response before grading." });

  let result;
  // Grading the exact same answer again returns the earlier AI grade for free.
  // For CSP the uploaded project is part of what was graded, so it has to match too.
  const files = frq.usesPpr ? cleanFiles(req.body.pprFiles) : [];
  const projectHash = frq.usesPpr
    ? crypto.createHash("sha256").update(ppr).update(files.map((f) => `${f.name}:${f.data.length}:${f.data.slice(0, 64)}`).join("|")).digest("hex").slice(0, 16)
    : "";
  const previous = aiEnabled() ? await db.get(
    "SELECT id, feedback FROM frq_submissions WHERE user_id = ? AND frq_id = ? AND response = ? AND grader = 'ai' ORDER BY created_at DESC LIMIT 1",
    [req.userId, frqId, response]
  ) : null;
  let previousResult = null;
  try { previousResult = previous ? JSON.parse(previous.feedback) : null; } catch { previousResult = null; }
  const reusable = previousResult && (!frq.usesPpr || previousResult.projectHash === projectHash);
  const reservation = !reusable && aiEnabled() ? await reserveAiCall(req.userId, "grade") : { ok: false };
  if (reusable) {
    // Same answer as before: return that grade without saving another copy to the history.
    return res.json({ ...previousResult, id: previous.id, solution: frq.solution || null, notice: "Same answer as last time, so this is your earlier AI grade (it didn't use one of today's grades)." });
  } else if (aiEnabled() && !reservation.ok) {
    result = { ...gradeWithRubric({ frq, response }), notice: reservation.reason };
  } else if (aiEnabled()) {
    try {
      result = { ...(await gradeWithAI({ frq, courseName: courses[course].name, response, ppr: frq.usesPpr ? ppr : "", pprFiles: files })), projectHash };
    } catch (err) {
      console.error(err.message);
      await releaseAiCall(req.userId, "grade");
      result = { ...gradeWithRubric({ frq, response }), notice: "The AI grader was unavailable, so this is a keyword estimate. Try again in a minute." };
    }
  } else {
    result = gradeWithRubric({ frq, response });
  }

  const id = newId();
  await db.run(
    "INSERT INTO frq_submissions (id, user_id, course, frq_id, response, score, total, grader, feedback, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, req.userId, course, frqId, response, result.score, result.total, result.grader, JSON.stringify(result), now()]
  );
  res.json({ ...result, id, solution: frq.solution || null });
}));

app.get("/api/ai/usage", requireAuth, wrap(async (req, res) => {
  res.json(await usageFor(req.userId));
}));

// ---------- AI study helper ----------
const helpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: Number(process.env.HELP_LIMIT_PER_HOUR || 60),
  keyGenerator: (req) => req.userId || ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "You've used the AI helper a lot this hour. Take a short break and try again soon." }
});

app.post("/api/ai/help", requireAuth, helpLimiter, wrap(async (req, res) => {
  if (!aiEnabled()) return res.status(503).json({ error: "The AI helper isn't set up on this server yet." });
  const course = courseFor(req.body.course);
  if (!course) return res.status(400).json({ error: "Unknown course" });
  const kind = ["mcq", "frq", "general"].includes(req.body.kind) ? req.body.kind : "general";
  const history = (Array.isArray(req.body.history) ? req.body.history : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-8);
  if (!history.length || history[history.length - 1].role !== "user") {
    return res.status(400).json({ error: "Ask a question first." });
  }
  const reservation = await reserveAiCall(req.userId, "help");
  if (!reservation.ok) return res.status(429).json({ error: reservation.reason });
  try {
    const reply = await tutorReply({
      course,
      kind,
      questionId: String(req.body.questionId || ""),
      frqId: String(req.body.frqId || ""),
      studentChoice: Number.isInteger(req.body.studentChoice) ? req.body.studentChoice : null,
      answered: Boolean(req.body.answered),
      draft: String(req.body.draft || "").slice(0, 8000),
      graded: Boolean(req.body.graded),
      ppr: String(req.body.ppr || "").slice(0, 8000),
      pprFiles: cleanFiles(req.body.pprFiles),
      history
    });
    res.json({ reply });
  } catch (err) {
    await releaseAiCall(req.userId, "help");
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error(err.message);
    res.status(502).json({ error: "The AI helper couldn't answer right now. Try again in a minute." });
  }
}));

app.get("/api/frq/history", requireAuth, wrap(async (req, res) => {
  const rows = await db.all(
    "SELECT id, course, frq_id, score, total, grader, created_at FROM frq_submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT 200",
    [req.userId]
  );
  res.json({ submissions: rows.map((r) => ({
    id: r.id, course: r.course, frqId: r.frq_id, score: Number(r.score), total: Number(r.total), grader: r.grader, createdAt: r.created_at
  })) });
}));

app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

// ---------- serve the built React app ----------
const dist = path.resolve(__dirname, "..", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { index: false, maxAge: "1h" }));
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "That request wasn't valid JSON." });
  if (err.type === "entity.too.large") {
    const big = req.path === "/api/frq/grade" || req.path === "/api/ai/help";
    return res.status(413).json({ error: big ? "That upload is too large. Keep project files under 10 MB in total." : "That request is too large." });
  }
  if (err.status >= 400 && err.status < 500) return res.status(err.status).json({ error: err.message || "Bad request." });
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  const seen = aiSettingsSeen();
  console.log(`AI settings found: ${seen.length ? seen.join(", ") : "none"}`);
  if (!aiEnabled()) console.log("AI is off: add OPENAI_API_KEY (or ANTHROPIC_API_KEY / GEMINI_API_KEY) in your host's environment settings.");
  console.log(`AP Study Path server on http://localhost:${PORT}  (db: ${db.kind}, AI grading: ${aiEnabled() ? aiProvider() : "off"})`);
});
