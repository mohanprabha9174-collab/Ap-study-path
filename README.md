# AP Study Path

A beginner-friendly AP study website built with Vite and React. AP Computer Science Principles is the first full course section.

## What is included

- Student login screen with saved browser accounts
  - New email creates an account after password confirmation
  - Existing email must use the saved password
  - Wrong password shows Try Again / Forgot Password options
  - Forgot Password creates a 6-digit demo recovery code
- Home page with clear update banner
- Practice Tests page
  - 3 practice tests
  - 70 questions each
  - 210 total questions
  - Robot movement MCQs appear early in each test
  - Longer AP CSP pseudocode questions
  - Boolean, loop, list, procedure, and missing-line questions
  - Binary-to-decimal and decimal-to-binary questions
  - Instant feedback, explanations, saved progress, score screen, and wrong-answer review
- FRQ Practice page
  - Free, no API key required
  - 12 Create Task-style written response questions that can fit almost any PPR
  - Each question includes its own rubric, checklist, and exam tip
  - Paste PPR text
  - Attach a PPR file area
  - Free rubric feedback that helps students revise without using an AI API
  - PPR checklist based on College Board-style requirements and guidance
- Units & Deep Dives page
  - Expanded full-year-style notes for all five AP CSP units
  - Binary conversion lessons
  - Robot command lessons
  - Pseudocode, Boolean logic, loops, lists, procedures, networks, privacy, cybersecurity, IP, digital divide, and impact topics

## Run locally

1. Open Command Prompt in the project folder where `package.json` exists.

2. Install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm run dev
```

4. Open:

```text
http://localhost:5173
```

## No API key needed

The FRQ section now uses local rubrics and checklist feedback. You do not need an OpenAI API key, Gemini key, or any other AI key to run the website.

## Beginner login note

This project uses browser localStorage and a SHA-256 password hash for a beginner practice login. It is not a production account system. A real public site should use a secure backend database, server-side sessions, password reset emails, rate limiting, and a real email provider.

## PPR attachment note

The PPR attachment area can read text-based files directly. Browser-only PDF text extraction is limited, so students may still need to paste their PPR code/text into the PPR text box after attaching a PDF.
