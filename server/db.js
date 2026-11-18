// Database adapter.
// - If DATABASE_URL is set, uses PostgreSQL (recommended for production: Neon, Supabase, Render Postgres).
// - Otherwise uses a local SQLite file via Node's built-in node:sqlite (Node 22.5+), no native build needed.
// All queries use "?" placeholders; they are converted to $1, $2... for Postgres.

import fs from "node:fs";
import path from "node:path";

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS test_progress (
    user_id TEXT NOT NULL,
    test_key TEXT NOT NULL,
    state TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, test_key)
  )`,
  `CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course TEXT NOT NULL,
    test_id TEXT NOT NULL,
    title TEXT,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    unit_breakdown TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS frq_submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course TEXT NOT NULL,
    frq_id TEXT NOT NULL,
    response TEXT NOT NULL,
    score REAL NOT NULL,
    total REAL NOT NULL,
    grader TEXT NOT NULL,
    feedback TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id, course)`,
  `CREATE INDEX IF NOT EXISTS idx_frq_user ON frq_submissions(user_id, course, frq_id)`
];

function toPg(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

async function createPg(url) {
  const { default: pg } = await import("pg");
  const pool = new pg.Pool({
    connectionString: url,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false }
  });
  for (const stmt of SCHEMA) await pool.query(stmt);
  return {
    kind: "postgres",
    async all(sql, params = []) { return (await pool.query(toPg(sql), params)).rows; },
    async get(sql, params = []) { return (await pool.query(toPg(sql), params)).rows[0] || null; },
    async run(sql, params = []) { await pool.query(toPg(sql), params); }
  };
}

async function createSqlite(file) {
  const { DatabaseSync } = await import("node:sqlite");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL;");
  for (const stmt of SCHEMA) db.exec(stmt);
  return {
    kind: "sqlite",
    async all(sql, params = []) { return db.prepare(sql).all(...params); },
    async get(sql, params = []) { return db.prepare(sql).get(...params) || null; },
    async run(sql, params = []) { db.prepare(sql).run(...params); }
  };
}

export async function openDatabase() {
  if (process.env.DATABASE_URL) return createPg(process.env.DATABASE_URL);
  const file = process.env.SQLITE_FILE || path.resolve("data", "ap-study-path.db");
  return createSqlite(file);
}
