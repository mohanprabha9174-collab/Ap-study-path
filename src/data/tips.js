// Tips & tricks for each course. Each section: { title, icon, tips: [ { title, text, example? } ] }

export const cspTips = [
  {
    title: "Exam strategy",
    icon: "🎯",
    tips: [
      { title: "Know the format", text: "The AP CSP exam has 70 multiple-choice questions in 120 minutes (about 1 minute 40 seconds each) and a written response section where you answer questions about your own Create Task program using your Personalized Project Reference (PPR)." },
      { title: "Never leave a blank", text: "There is no penalty for wrong answers. Flag hard questions in Bluebook, move on, and come back. Guess on anything left at the end." },
      { title: "Multi-select questions", text: "A few questions at the end ask you to pick exactly two answers. Read the instructions; picking only one earns nothing." },
      { title: "Use the reference sheet", text: "The exam reference sheet shows AP pseudocode for lists, procedures, and robot commands. Lists start at index 1, not 0. That single fact decides several questions every year." }
    ]
  },
  {
    title: "Pseudocode traps",
    icon: "🧩",
    tips: [
      { title: "Lists start at 1", text: "In AP pseudocode, aList[1] is the first element and LENGTH(aList) is the last valid index.", example: "list ← [10, 20, 30]\nDISPLAY(list[1])   → 10" },
      { title: "REPEAT UNTIL checks first", text: "REPEAT UNTIL (condition) stops as soon as the condition is true, and it checks before each pass, so the body can run zero times." },
      { title: "MOD is remainder", text: "a MOD b is the remainder. x MOD 2 = 0 means x is even. 17 MOD 5 = 2." },
      { title: "Trace with a table", text: "For loops and procedures, make a small table with one column per variable and one row per iteration. It is faster than holding values in your head and prevents most mistakes." },
      { title: "Robot questions", text: "Track the robot's direction after every ROTATE before you move it. Draw an arrow on scratch paper; most wrong answers come from forgetting which way the robot faces." }
    ]
  },
  {
    title: "Data and binary",
    icon: "🔢",
    tips: [
      { title: "Binary place values", text: "Memorize 128, 64, 32, 16, 8, 4, 2, 1. Convert binary to decimal by adding the place values that have a 1.", example: "10110 = 16 + 4 + 2 = 22" },
      { title: "Bits and values", text: "n bits can represent 2^n different values. Adding one bit doubles the number of values. Overflow happens when a number needs more bits than are available." },
      { title: "Lossless vs lossy", text: "Lossless compression can be perfectly reversed (needed for text and code). Lossy compression throws away detail for smaller files (fine for photos, audio, video)." },
      { title: "Metadata", text: "Metadata is data about data, such as a photo's date, location, and file size. Changing metadata does not change the primary data." }
    ]
  },
  {
    title: "Networks and impact",
    icon: "🌐",
    tips: [
      { title: "Fault tolerance = redundancy", text: "If a question asks why the Internet is fault tolerant, the answer is redundant paths: if one connection fails, packets can take another route." },
      { title: "Protocols in one line each", text: "IP addresses and routes packets; TCP makes delivery reliable and in order; UDP is faster with no guarantees; HTTP/HTTPS transfers web pages; DNS turns domain names into IP addresses." },
      { title: "Sequential vs parallel", text: "Parallel time is limited by the longest single task. Speedup = sequential time ÷ parallel time." },
      { title: "Impact questions", text: "For bias, privacy, and digital divide questions, choose the answer that names a specific mechanism (biased training data, unequal access, data collection without consent) instead of a vague statement." }
    ]
  },
  {
    title: "Written response (PPR)",
    icon: "✍️",
    tips: [
      { title: "Use your own code", text: "Every answer must point to specific parts of your own program: name your procedure, your parameter, your list. Generic answers do not earn points." },
      { title: "Say input AND output", text: "Testing questions need a specific argument value and the exact expected result. 'It should work' earns nothing." },
      { title: "Explain cause and effect", text: "Use 'because' and 'so that' to link your code to its behavior. Readers look for reasoning, not vocabulary lists." },
      { title: "Check your PPR rules", text: "The PPR must contain only screen captures of code with no comments, and must show a procedure with a parameter, where it is called, a list being created/stored, and the list being used." }
    ]
  }
];

export const csaTips = [
  {
    title: "Exam strategy",
    icon: "🎯",
    tips: [
      { title: "Know the format", text: "The revised AP CSA exam is fully digital in Bluebook: 42 multiple-choice questions in 90 minutes (55%) and 4 free-response questions in 90 minutes (45%). You type FRQ code in Bluebook; it does not compile or run it." },
      { title: "Budget about 2 minutes per MCQ", text: "Skip long traces on the first pass, flag them, and come back. Each MCQ is worth the same." },
      { title: "Unit weights decide study time", text: "Data Collections (arrays, ArrayList, 2D arrays) is the largest unit at about 30-40%, and Selection and Iteration is about 25-35%. Two of the four FRQs are pure Data Collections." },
      { title: "Use the Java Quick Reference", text: "You get a reference with String, Math, Integer, ArrayList, and other method signatures. Know where to find them so you do not waste time guessing parameter order." }
    ]
  },
  {
    title: "Tracing tricks",
    icon: "🔍",
    tips: [
      { title: "Integer division and casting", text: "int / int truncates. Casting happens before division only if the cast is applied first.", example: "(double) 7 / 2  → 3.5\n(double) (7 / 2) → 3.0" },
      { title: "String + number", text: "+ goes left to right. Once one side is a String, everything after concatenates.", example: "1 + 2 + \"A\" + 1 + 2 → \"3A12\"" },
      { title: "substring(a, b) excludes b", text: "The length of s.substring(a, b) is b - a. s.substring(i, i + 1) is one character." },
      { title: "Dangling else", text: "Without braces, else belongs to the nearest if, no matter how the code is indented." },
      { title: "Aliases", text: "b = a for objects or arrays copies the reference. Changes through b show up in a." },
      { title: "Removing in a forward loop skips", text: "After list.remove(i), the next element is now at i. Going forward with i++ skips it. Go backward." }
    ]
  },
  {
    title: "FRQ points you can always get",
    icon: "✅",
    tips: [
      { title: "Write something for every part", text: "Points are awarded per rubric row. A correct loop header with a wrong condition can still earn the traversal point. A blank earns zero." },
      { title: "Call the method you are told to call", text: "If part (b) says to use part (a), call it even if your part (a) is wrong. Part (b) is graded as if part (a) works." },
      { title: "Don't change the header", text: "Copy the method header exactly. Changing the return type or parameters can cost multiple points." },
      { title: "Return, don't print", text: "If the method returns a value, use return. Printing inside the method instead of returning loses the point." },
      { title: "Use accessors", text: "Outside a class, use getters like getTemp(), never private fields like r.temp." },
      { title: "Guard 2D neighbors", text: "Write the bounds check before the array access with && so it short-circuits.", example: "if (r > 0 && grid[r - 1][c] > val)" }
    ]
  },
  {
    title: "Common mistakes",
    icon: "⚠️",
    tips: [
      { title: "Using == on Strings", text: "Use .equals for content comparison. == checks if two references are the same object." },
      { title: "length vs length() vs size()", text: "Arrays: arr.length. Strings: s.length(). ArrayList: list.size()." },
      { title: "Missing return on some path", text: "A method that returns inside if / else if with no final return will not compile." },
      { title: "Average with ints", text: "sum / count with two ints truncates. Make sum a double or cast." },
      { title: "Shadowed instance variables", text: "In a constructor with a parameter named the same as a field, use this.field = field." }
    ]
  }
];

export const cyberTips = [
  {
    title: "Exam strategy",
    icon: "🎯",
    tips: [
      { title: "Know the format", text: "AP Cybersecurity is fully digital: 60 multiple-choice questions in 80 minutes (70%) and one multi-part free-response question in 50 minutes (30%). The first national exam is in May 2027." },
      { title: "Three skills, every unit", text: "Questions test three skills across all units: Analyze Risk, Mitigate Risk, and Detect Attacks. Ask yourself which skill a question is testing; it narrows the answer." },
      { title: "Set-based questions", text: "Many MCQs come in sets that share a scenario, log, or diagram. Read the stimulus once carefully and note key details (IPs, times, users, ports) before answering the set." },
      { title: "The FRQ is evidence-based", text: "The free response gives you several sources about one device (policy, firewall rules, file permissions, logs). Every claim you make should cite a specific line from a source." }
    ]
  },
  {
    title: "Analyze risk",
    icon: "📊",
    tips: [
      { title: "Threat vs vulnerability vs risk", text: "A vulnerability is a weakness (unpatched software). A threat is something that could exploit it (an attacker, malware). Risk is the likelihood and impact of that happening." },
      { title: "CIA triad shortcut", text: "Stolen or leaked data → confidentiality. Changed or tampered data → integrity. Systems down or files locked → availability." },
      { title: "Risk responses", text: "Mitigate (add controls), transfer (insurance or outsourcing), avoid (stop the risky activity), accept (cost of control exceeds the loss)." },
      { title: "Prioritize by likelihood × impact", text: "If asked which risk to address first, pick the one that is both likely and high impact, not just the scariest-sounding one." }
    ]
  },
  {
    title: "Mitigate risk",
    icon: "🛡️",
    tips: [
      { title: "Defense in depth", text: "The best answer usually adds layers: physical, network, device, and application controls, so one failure is not a breach." },
      { title: "Least privilege", text: "Give users and programs only the access they need. Daily accounts should be standard users, not administrators." },
      { title: "Control types", text: "Preventive stops an attack (lock, firewall). Detective finds it (camera review, IDS, logs). Deterrent discourages it (signs, visible cameras). Corrective fixes it (restore from backup)." },
      { title: "Firewall rules: first match wins", text: "Rules are read top to bottom and the first matching rule decides. A broad ALLOW near the top overrides later DENY rules. A secure list ends with deny-all." },
      { title: "Linux permissions", text: "Read each rwx triad as owner, group, others. Numbers: r = 4, w = 2, x = 1.", example: "chmod 640 file → owner rw-, group r--, others ---" }
    ]
  },
  {
    title: "Detect attacks",
    icon: "🚨",
    tips: [
      { title: "Read logs for patterns", text: "Many failed logins then a success → brute force that worked. One IP hitting many ports in seconds → port scan. Badge use at impossible times or places → stolen or cloned badge." },
      { title: "Know your ports", text: "22 SSH, 23 Telnet (insecure), 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS, 3389 RDP. Traffic on unexpected ports is a red flag." },
      { title: "Malware by behavior", text: "Spreads by itself → worm. Needs a host file/user action → virus. Looks useful but is harmful → trojan. Encrypts files for payment → ransomware." },
      { title: "First response", text: "When a device is infected, the first step is usually to isolate it from the network to stop spread, then investigate and recover." }
    ]
  },
  {
    title: "Applications and data",
    icon: "🔐",
    tips: [
      { title: "Injection fix", text: "SQL injection is fixed with parameterized queries (prepared statements) and server-side input validation." },
      { title: "Public vs private keys", text: "To keep a message secret for Bob, encrypt with Bob's public key. To prove you sent it, sign with your own private key." },
      { title: "Hashing is one-way", text: "Store passwords as salted hashes, never plain text or reversible encryption. Compare hashes to verify file integrity." },
      { title: "Backups beat ransomware", text: "Offline or off-site backups (3-2-1 rule: 3 copies, 2 media types, 1 off-site) are the best recovery from ransomware." }
    ]
  }
];
