// Free, offline rubric estimate. Used by the server when no AI key is set,
// and by the browser when the site runs without a backend (guest / GitHub Pages mode).

export function rowPoints(row) {
  return Number(row.points ?? 1);
}

export function rubricTotal(frq) {
  return (frq.rubric || []).reduce((sum, row) => sum + rowPoints(row), 0);
}

// Free fallback: estimates rubric coverage from keywords. Clearly labeled as an estimate in the UI.
// Tiny words ("so", "for", "if") match almost any answer, so they don't count as evidence.
const meaningful = (k) => k.length >= 4 || /[^a-z\s]/i.test(k);

export function gradeWithRubric({ frq, response }) {
  const text = response.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean).length;
  const isCode = Boolean(frq.code) || /[{};]/.test(text);
  const rows = frq.rubric.map((row) => {
    const max = rowPoints(row);
    const keywords = (row.keywords || []).filter(meaningful);
    const matched = keywords.filter((k) => lower.includes(k.toLowerCase()));
    // Two distinct matching terms (or all of them, if fewer) earn the row.
    const needed = Math.min(keywords.length, 2) || 1;
    const ratio = Math.min(1, matched.length / needed);
    const earned = words < 15 ? 0 : Math.round(ratio * max * 2) / 2;
    return {
      point: row.point,
      earned,
      max,
      reason: matched.length
        ? `Found related terms: ${matched.slice(0, 4).join(", ")}. Check that your answer fully does this: ${row.lookFor}`
        : `Not detected. ${row.lookFor}`
    };
  });
  // Written answers need enough explanation to earn points: about 20 words per point.
  // This stops a list of keywords from scoring full marks.
  if (!isCode) {
    let budget = Math.floor(words / 20);
    rows.forEach((r) => {
      const take = Math.min(r.earned, budget);
      if (take < r.earned) r.reason = `Too short to earn this point yet. ${r.reason}`;
      r.earned = take;
      budget -= take;
    });
  }

  const improvements = [];
  if (words < 60 && !frq.code) improvements.push("Add more detail: explain cause and effect, not just vocabulary.");
  if (!/because|so that|therefore|since/.test(lower) && !frq.code) improvements.push("Use reasoning words like 'because' or 'therefore' to justify each claim.");
  rows.filter((r) => r.earned < r.max).forEach((r) => improvements.push(`Strengthen "${r.point}".`));

  return {
    grader: "rubric",
    rows,
    score: rows.reduce((s, r) => s + r.earned, 0),
    total: rubricTotal(frq),
    summary: "Keyword-based estimate, not an AI grade. Use each rubric row to check your own answer.",
    strengths: [],
    improvements: improvements.slice(0, 6),
    examTip: frq.tip || ""
  };
}
