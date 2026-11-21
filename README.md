# AP Study Path

Free practice for **AP Computer Science Principles**, **AP Computer Science A**, and **AP Cybersecurity**: full-length practice exams, unlimited custom quizzes, unit notes, tips & tricks, and FRQ practice that is **graded automatically by AI** against a rubric.

## Features

| | AP CSP | AP CSA | AP Cybersecurity |
|---|---|---|---|
| Practice exams | 3 × 70 questions | 2 × 42 questions (Java) | 2 × 40 questions |
| FRQs with rubrics | 12 written-response (uses your PPR) | 8 (two of each FRQ type) | 3 Device Security Analysis (6 sources each) |
| Unit notes | 5 units | 4 units (2025-26 course) | 5 units |
| Tips & tricks | ✓ | ✓ | ✓ |

- **Exam mode** (timed, flag questions, question navigator, score at the end) and **practice mode** (instant explanations).
- **Custom quiz builder**: pick units and question count for a new random quiz every time.
- **AI FRQ grading**: Claude scores each rubric row, explains why, lists strengths and fixes, and shows a reference solution. Scores are clamped to the rubric so the AI can't invent points, and student text is treated as data (it can't instruct the grader).
- **Accounts**: email + password (scrypt hashed), progress and scores sync across devices, a dashboard with unit-by-unit strengths and "focus next" recommendations.
- **Guest mode**: everything works without an account; progress saves in the browser and FRQs get a keyword-based rubric estimate.

## Tech

- Frontend: React 18 + Vite (`src/`)
- Backend: Express API (`server/`) with JWT auth, rate limiting, and Helmet
- Database: SQLite via Node's built-in `node:sqlite` by default; PostgreSQL when `DATABASE_URL` is set
- AI grading: Claude (Anthropic API) or Gemini (Google AI) in `server/grader.js`
- All course content lives in `src/data/` and is shared by the frontend and the server

## Run locally

Requires **Node.js 22.5+**.

```bash
npm install
cp .env.example .env     # optional: add ANTHROPIC_API_KEY to turn on AI grading
npm run dev              # API on :3001, site on http://localhost:5173
```

Windows: double-click `RUN-WEBSITE-WINDOWS.bat`.

Check the content (answer keys, rubrics, IDs) any time with `npm run check:content`.

## Publish it

### Option A: Render (recommended, frontend + backend together)

1. Push this repo to GitHub.
2. On [render.com](https://render.com): **New → Blueprint** and choose this repo. `render.yaml` sets everything up and generates `JWT_SECRET`.
3. In the service's **Environment** tab set:
   - `ANTHROPIC_API_KEY` — your key from [console.anthropic.com](https://console.anthropic.com) (enables AI grading)
   - `DATABASE_URL` — a Postgres connection string. Render's free disk is wiped on every deploy, so use a free hosted Postgres such as [Neon](https://neon.tech) to keep accounts permanently.
4. Deploy. Your site is at `https://<service-name>.onrender.com`.

### Option B: any Docker host (Railway, Fly.io, a VPS)

```bash
docker build -t ap-study-path .
docker run -p 3001:3001 -e JWT_SECRET=... -e ANTHROPIC_API_KEY=... -e DATABASE_URL=... ap-study-path
```

### GitHub Pages (frontend only)

The included workflow still publishes the frontend to GitHub Pages on every push to `main`. Pages can't run a server, so by default it runs in guest mode. To connect it to your backend:

1. Deploy the backend with option A or B.
2. In the backend, set `CORS_ORIGIN=https://mohanprabha9174-collab.github.io`.
3. In GitHub: **Settings → Secrets and variables → Actions → Variables**, add `API_URL` = your backend URL (for example `https://ap-study-path.onrender.com`).
4. Re-run the Pages workflow.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `JWT_SECRET` | in production | Signs login tokens |
| `ANTHROPIC_API_KEY` | for AI grading (Claude) | Paid per use |
| `GEMINI_API_KEY` | for AI grading (Gemini) | Has a free tier. Without either key, FRQs use the rubric estimate |
| `AI_PROVIDER` | no | `gemini` to prefer Gemini when both keys are set |
| `GEMINI_MODEL` | no | Default `gemini-flash-latest` |
| `ANTHROPIC_MODEL` | no | Grading model (default `claude-sonnet-5-5`) |
| `GRADE_LIMIT_PER_HOUR` | no | AI gradings per student per hour (default 30) |
| `DATABASE_URL` | recommended in production | Postgres; otherwise SQLite at `data/ap-study-path.db` |
| `CORS_ORIGIN` | only for a separate frontend | Comma-separated allowed origins |

## API

`GET /api/health` · `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me` · `POST /api/auth/change-password` · `GET/PUT/DELETE /api/progress/:key` · `GET/POST /api/attempts` · `POST /api/frq/grade` · `GET /api/frq/history`

## Not yet included

- Password reset by email (needs an email provider such as Resend or SendGrid)

AP® is a trademark registered by the College Board, which is not affiliated with and does not endorse this site. Practice scores are estimates, not official AP scores.
