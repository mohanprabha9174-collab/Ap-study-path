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
app.use(express.json({ limit: "200kb" }));

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
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
}
function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name || "", createdAt: u.created_at };
}

function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Please sign in." });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Your session expired. Please sign in again." });
  }
}

// ---------- AI spending caps ----------
// Per-hour limits live in the rate limiters below. These daily caps are a hard ceiling on
// how many AI calls the whole site (and each student) can make per day, so the API bill
// can't run away. Defaults: 300 calls/day for the whole site, 40 per student.
const AI_DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT || 300);
const AI_USER_DAILY_LIMIT = Number(process.env.AI_USER_DAILY_LIMIT || 40);
const today = () => new Date().toISOString().slice(0, 10);

async function reserveAiCall(userId) {
  const day = today();
  const site = await db.get("SELECT COALESCE(SUM(calls), 0) AS n FROM ai_usage WHERE day = ?", [day]);
  if (Number(site?.n || 0) >= AI_DAILY_LIMIT) {
    return { ok: false, reason: "The site has reached today's AI limit. AI features come back tomorrow; you can still use rubric scoring." };
  }
  const mine = await db.get("SELECT calls FROM ai_usage WHERE day = ? AND user_id = ?", [day, userId]);
  if (Number(mine?.calls || 0) >= AI_USER_DAILY_LIMIT) {
    return { ok: false, reason: `You've used all ${AI_USER_DAILY_LIMIT} of your AI requests for today. They reset tomorrow.` };
  }
  await db.run(
    "INSERT INTO ai_usage (day, user_id, calls) VALUES (?, ?, 1) ON CONFLICT (day, user_id) DO UPDATE SET calls = ai_usage.calls + 1",
    [day, userId]
  );
  return { ok: true };
}

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
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

app.post("/api/auth/register", authLimiter, wrap(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const name = String(req.body.name || "").trim().slice(0, 60);
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Enter a valid email address." });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
  if (await db.get("SELECT id FROM users WHERE email = ?", [email])) {
    return res.status(409).json({ error: "An account with this email already exists. Sign in instead." });
  }
  const user = { id: newId(), email, name, password_hash: hashPassword(password), created_at: now() };
  await db.run("INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    [user.id, user.email, user.name, user.password_hash, user.created_at]);
  res.status(201).json({ token: issueToken(user), user: publicUser(user) });
}));

app.post("/api/auth/login", authLimiter, wrap(async (req, res) => {
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

app.post("/api/auth/change-password", requireAuth, authLimiter, wrap(async (req, res) => {
  const { currentPassword = "", newPassword = "" } = req.body;
  const user = await db.get("SELECT * FROM users WHERE id = ?", [req.userId]);
  if (!user || !verifyPassword(String(currentPassword), user.password_hash)) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }
  if (String(newPassword).length < 8) return res.status(400).json({ error: "New password must be at least 8 characters." });
  await db.run("UPDATE users SET password_hash = ? WHERE id = ?", [hashPassword(String(newPassword)), user.id]);
  res.json({ ok: true });
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
  const state = JSON.stringify(req.body.state ?? null).slice(0, 100000);
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
  if (!courses[course]) return res.status(400).json({ error: "Unknown course" });
  const attempt = {
    id: newId(), course, testId: String(testId).slice(0, 80), title: String(title || "").slice(0, 120),
    score: Math.max(0, Number(score) | 0), total: Math.max(1, Number(total) | 0)
  };
  await db.run(
    "INSERT INTO attempts (id, user_id, course, test_id, title, score, total, unit_breakdown, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [attempt.id, req.userId, attempt.course, attempt.testId, attempt.title, attempt.score, attempt.total, JSON.stringify(unitBreakdown || {}), now()]
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
function findFrq(course, frqId) {
  return courses[course]?.frqs.find((f) => f.id === frqId) || null;
}

app.post("/api/frq/grade", requireAuth, gradeLimiter, wrap(async (req, res) => {
  const { course, frqId } = req.body;
  const response = String(req.body.response || "").slice(0, 12000);
  const ppr = String(req.body.ppr || "").slice(0, 15000);
  const frq = findFrq(course, frqId);
  if (!frq) return res.status(404).json({ error: "FRQ not found." });
  if (response.trim().length < 10) return res.status(400).json({ error: "Write a response before grading." });

  let result;
  const reservation = aiEnabled() ? await reserveAiCall(req.userId) : { ok: false };
  if (aiEnabled() && !reservation.ok) {
    result = { ...gradeWithRubric({ frq, response }), notice: reservation.reason };
  } else if (aiEnabled()) {
    try {
      result = await gradeWithAI({ frq, courseName: courses[course].name, response, ppr: frq.usesPpr ? ppr : "" });
    } catch (err) {
      console.error(err.message);
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
  const mine = await db.get("SELECT calls FROM ai_usage WHERE day = ? AND user_id = ?", [today(), req.userId]);
  const used = Number(mine?.calls || 0);
  res.json({ used, limit: AI_USER_DAILY_LIMIT, remaining: Math.max(0, AI_USER_DAILY_LIMIT - used) });
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
  const course = courses[req.body.course];
  if (!course) return res.status(400).json({ error: "Unknown course" });
  const kind = ["mcq", "frq", "general"].includes(req.body.kind) ? req.body.kind : "general";
  const history = (Array.isArray(req.body.history) ? req.body.history : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))
    .slice(-12);
  if (!history.length || history[history.length - 1].role !== "user") {
    return res.status(400).json({ error: "Ask a question first." });
  }
  const reservation = await reserveAiCall(req.userId);
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
      history
    });
    res.json({ reply });
  } catch (err) {
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
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`AP Study Path server on http://localhost:${PORT}  (db: ${db.kind}, AI grading: ${aiEnabled() ? aiProvider() : "off"})`);
});
