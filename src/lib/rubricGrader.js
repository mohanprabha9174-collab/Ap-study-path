// Free, offline rubric estimate. Used by the server when no AI key is set,
// and by the browser when the site runs without a backend (guest / GitHub Pages mode).

export function rowPoints(row) {
  return Number(row.points ?? 1);
}

export function rubricTotal(frq) {
  return (frq.rubric || []).reduce((sum, row) => sum + rowPoints(row), 0);
}

// Free fallback: estimates rubric coverage from keywords. Clearly labeled as an estimate in the UI.
export function gradeWithRubric({ frq, response }) {
  const text = response.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean).length;
  const rows = frq.rubric.map((row) => {
    const max = rowPoints(row);
    const keywords = row.keywords || [];
    const matched = keywords.filter((k) => lower.includes(k.toLowerCase()));
    const ratio = keywords.length ? matched.length / Math.min(keywords.length, 3) : 0;
    const earned = words < 15 ? 0 : Math.min(max, Math.round(ratio * 1.5 * max * 2) / 2);
    return {
      point: row.point,
      earned,
      max,
      reason: matched.length
        ? `Found related terms: ${matched.slice(0, 4).join(", ")}. Check that your answer fully does this: ${row.lookFor}`
        : `Not detected. ${row.lookFor}`
    };
  });

  const improvements = [];
  if (words < 60 && !frq.code) improvements.push("Add more detail: explain cause and effect, not just vocabulary.");
  if (!/because|so that|therefore|since/.test(lower) && !frq.code) improvements.push("Use reasoning words like 'because' or 'therefore' to justify each claim.");
  rows.filter((r) => r.earned < r.max).forEach((r) => improvements.push(`Strengthen "${r.point}".`));

  return {
    grader: "rubric",
    rows,
    score: rows.reduce((s, r) => s + r.earned, 0),
    total: rubricTotal(frq),
    summary: "Keyword-based estimate (AI grading is not configured on this server). Use each rubric row to self-check.",
    strengths: [],
    improvements: improvements.slice(0, 6),
    examTip: frq.tip || ""
  };
}
