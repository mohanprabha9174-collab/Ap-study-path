// Site owner tool: make a one-time password reset link for a student who lost their recovery code.
//   DATABASE_URL=... APP_URL=https://ap-study-path.onrender.com node scripts/reset-link.mjs student@example.com
import "../server/env.js";
import crypto from "node:crypto";
import { openDatabase } from "../server/db.js";

const email = String(process.argv[2] || "").trim().toLowerCase();
if (!email) { console.error("Usage: node scripts/reset-link.mjs <email>"); process.exit(1); }
const db = await openDatabase();
const user = await db.get("SELECT id FROM users WHERE email = ?", [email]);
if (!user) { console.error("No account with that email."); process.exit(1); }
const token = crypto.randomBytes(24).toString("base64url");
const hash = crypto.createHash("sha256").update(token).digest("hex");
await db.run("INSERT INTO password_resets (token_hash, user_id, expires_at, used) VALUES (?, ?, ?, 0)",
  [hash, user.id, new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()]);
const base = (process.env.APP_URL || "https://ap-study-path.onrender.com").replace(/\/$/, "");
console.log(`Reset link (works once, for 24 hours):\n${base}/#/reset/${token}`);
process.exit(0);
