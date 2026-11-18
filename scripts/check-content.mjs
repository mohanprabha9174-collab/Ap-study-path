// Sanity-checks all course content: answer keys in range, unique choices, rubric points, unique IDs.
import { courseList } from "../src/data/courses.js";

let problems = 0;
const fail = (msg) => { problems++; console.error("✗ " + msg); };

for (const course of courseList) {
  const ids = new Set();
  const unitIds = new Set(course.unitMeta.map((u) => u.id));
  let count = 0;
  for (const test of course.tests) {
    for (const q of test.questions) {
      count++;
      if (ids.has(q.id)) fail(`${course.id}: duplicate question id ${q.id}`);
      ids.add(q.id);
      if (!unitIds.has(q.unit)) fail(`${course.id} ${q.id}: unknown unit ${q.unit}`);
      if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer >= q.choices.length) fail(`${course.id} ${q.id}: bad correctAnswer`);
      if (new Set(q.choices).size !== q.choices.length) fail(`${course.id} ${q.id}: duplicate choices`);
      if (!q.explanation) fail(`${course.id} ${q.id}: missing explanation`);
    }
  }
  for (const frq of course.frqs) {
    if (!frq.rubric?.length) fail(`${course.id} ${frq.id}: missing rubric`);
    frq.rubric?.forEach((r) => { if (!r.point || !r.lookFor) fail(`${course.id} ${frq.id}: incomplete rubric row`); });
  }
  console.log(`✓ ${course.short}: ${course.tests.length} tests, ${count} questions, ${course.frqs.length} FRQs, ${course.units.length} units, ${course.tips.length} tip sections`);
}
if (problems) { console.error(`${problems} problem(s) found`); process.exit(1); }
