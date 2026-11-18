// Central registry of every course on the site. Used by both the React app and the API server.
import { practiceTests as cspTests, unitMeta as cspUnitMeta } from "./practiceTests.js";
import { frqs as cspFrqsRaw, pprChecklist } from "./frqs.js";
import { units as cspUnits } from "./units.js";
import { csaPracticeTests, csaUnitMeta } from "./csa/tests.js";
import { csaFrqs } from "./csa/frqs.js";
import { csaUnits } from "./csa/units.js";
import { cyberPracticeTests, cyberUnitMeta } from "./cyber/tests.js";
import { cyberFrqs } from "./cyber/frqs.js";
import { cyberUnits } from "./cyber/units.js";
import { cspTips, csaTips, cyberTips } from "./tips.js";

const cspFrqs = cspFrqsRaw.map((frq) => ({ ...frq, usesPpr: true }));

export const courses = {
  csp: {
    id: "csp",
    name: "AP Computer Science Principles",
    short: "AP CSP",
    accent: "blue",
    tagline: "Pseudocode, data, networks, impact, and the Create Task written response.",
    examFormat: [
      "70 multiple-choice questions in 120 minutes",
      "Written response questions about your own Create Task program, answered using your Personalized Project Reference (PPR)"
    ],
    unitMeta: cspUnitMeta,
    tests: cspTests.map((t) => ({ ...t, minutes: 120 })),
    frqs: cspFrqs,
    units: cspUnits,
    tips: cspTips,
    pprChecklist
  },
  csa: {
    id: "csa",
    name: "AP Computer Science A",
    short: "AP CSA",
    accent: "purple",
    tagline: "Java: objects, loops, classes, arrays, ArrayLists, 2D arrays, and the four FRQ types.",
    examFormat: [
      "42 multiple-choice questions in 90 minutes (55% of score)",
      "4 free-response questions in 90 minutes (45%): Methods & Control Structures, Class Design, Data Analysis with ArrayList, 2D Array",
      "Fully digital in Bluebook, aligned to the revised 4-unit course"
    ],
    unitMeta: csaUnitMeta,
    tests: csaPracticeTests,
    frqs: csaFrqs,
    units: csaUnits,
    tips: csaTips
  },
  cyber: {
    id: "cyber",
    name: "AP Cybersecurity",
    short: "AP Cyber",
    accent: "coral",
    tagline: "Analyze risk, mitigate risk, and detect attacks across spaces, networks, devices, and data.",
    examFormat: [
      "60 multiple-choice questions in 80 minutes (70% of score)",
      "1 multi-part free-response question in 50 minutes (30%): a Device Security Analysis using several sources",
      "New AP Career Kickstart course; first national exam May 2027"
    ],
    unitMeta: cyberUnitMeta,
    tests: cyberPracticeTests,
    frqs: cyberFrqs,
    units: cyberUnits,
    tips: cyberTips
  }
};

export const courseList = Object.values(courses);
