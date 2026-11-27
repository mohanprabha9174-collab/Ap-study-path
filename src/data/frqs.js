export const pprChecklist = [
  {
    title: "Student-authored reference",
    items: [
      "The PPR is based on your own Create Task program.",
      "It contains screen captures of your code, not copied written explanations.",
      "You can use it to answer questions about your own program purpose, algorithm, testing, and abstractions."
    ]
  },
  {
    title: "Procedure requirement",
    items: [
      "Your PPR includes a student-developed procedure with a clear name.",
      "The procedure has at least one parameter that affects what the procedure does.",
      "The PPR also shows where that procedure is called in your program."
    ]
  },
  {
    title: "Algorithm requirement",
    items: [
      "Inside the selected procedure, the algorithm includes sequencing: steps happen in a meaningful order.",
      "Inside the selected procedure, the algorithm includes selection: an IF, ELSE, or condition changes what happens.",
      "Inside the selected procedure, the algorithm includes iteration: a loop or repeated traversal occurs."
    ]
  },
  {
    title: "List/data abstraction requirement",
    items: [
      "Your PPR shows a list, array, or collection that stores multiple related pieces of data.",
      "Your PPR shows code that uses the list, such as adding items, reading items, filtering items, or traversing it.",
      "You can explain how the list helps manage complexity compared with separate variables."
    ]
  },
  {
    title: "Readability and exam-day safety",
    items: [
      "The screen captures are readable, not blurry, and use at least 10-point font when possible.",
      "The PPR screen captures do not include comments or course notes.",
      "The code segments are not so wide or tiny that they become unreadable when printed or viewed in Bluebook."
    ]
  }
];

export const frqs = [
  {
    id: "frq-ppr-1",
    category: "Written Response 1: Program Design, Function, and Purpose",
    title: "Program Purpose, User, Input, and Output",
    prompt: "Using your Personalized Project Reference, describe the overall purpose of your program. Then identify one specific input and one specific output from your program, and explain how the output helps the user accomplish the program's purpose.",
    rubric: [
      { point: "Purpose", lookFor: "Clearly states what the program does and who or what it helps.", keywords: ["purpose", "user", "helps", "program"] },
      { point: "Input", lookFor: "Names a real input from the student's program, such as typed text, a button click, file data, sensor data, or list selection.", keywords: ["input", "enter", "click", "select", "type", "choose"] },
      { point: "Output", lookFor: "Names a real output, such as displayed text, score, recommendation, screen change, sound, image, or saved result.", keywords: ["output", "display", "shows", "result", "screen", "score"] },
      { point: "Connection", lookFor: "Explains how the output is connected to the purpose, not just what appears on the screen.", keywords: ["because", "so that", "therefore", "helps", "allows"] }
    ],
    checklist: ["I named the program purpose.", "I identified one input from my actual program.", "I identified one output from my actual program.", "I explained why the output matters."],
    tip: "Avoid saying only 'my program is a game.' Say what the user is trying to accomplish and how the program helps."
  },
  {
    id: "frq-ppr-2",
    category: "Written Response 2(a): Algorithm Development",
    title: "Trace Your Procedure With a Specific Input",
    prompt: "Choose the student-developed procedure shown in your PPR. Describe what the procedure does. Then choose one specific argument or input value and trace how the procedure processes that value, including at least one condition and one loop or repeated step.",
    rubric: [
      { point: "Procedure purpose", lookFor: "Explains the job of the selected procedure in the program.", keywords: ["procedure", "function", "method", "does", "purpose"] },
      { point: "Specific input", lookFor: "Uses one concrete value or argument instead of speaking only generally.", keywords: ["for example", "when", "if the input", "argument", "value"] },
      { point: "Selection", lookFor: "Explains how an IF/ELSE or Boolean condition affects the result.", keywords: ["if", "else", "condition", "true", "false", "boolean"] },
      { point: "Iteration", lookFor: "Explains how a loop, repeat, or traversal changes values over time.", keywords: ["loop", "repeat", "iterate", "traverse", "for each", "while"] }
    ],
    checklist: ["I chose a real procedure from my PPR.", "I used one specific input or argument.", "I explained a condition.", "I explained a loop or repeated step."],
    tip: "A strong trace follows the code in order. Do not skip straight from input to final answer."
  },
  {
    id: "frq-ppr-3",
    category: "Written Response 2(a): Algorithm Development",
    title: "Equivalent or Different Algorithm",
    prompt: "Look at the algorithm inside your selected procedure. Describe one possible change to the order of steps, condition, or loop. Explain whether the changed algorithm would produce the same result or a different result, and justify your answer using your PPR.",
    rubric: [
      { point: "Original algorithm", lookFor: "Accurately describes the original algorithm or important part of it.", keywords: ["algorithm", "original", "procedure", "steps"] },
      { point: "Change", lookFor: "Describes a concrete change, such as moving a line, changing a condition, or changing when a value updates.", keywords: ["change", "move", "replace", "condition", "loop"] },
      { point: "Result", lookFor: "States whether the result would stay the same or become different.", keywords: ["same", "different", "result", "output"] },
      { point: "Justification", lookFor: "Explains why the change affects or does not affect the algorithm's behavior.", keywords: ["because", "since", "therefore", "causes", "affects"] }
    ],
    checklist: ["I described the original logic.", "I described exactly what would change.", "I said same or different result.", "I explained why."],
    tip: "Good answers focus on program behavior, not just whether the code 'looks better.'"
  },
  {
    id: "frq-ppr-4",
    category: "Written Response 2(b): Errors and Testing",
    title: "Test Case for Expected Behavior",
    prompt: "Identify one input or situation that could be used to test the correctness of your program or selected procedure. State the expected output or behavior, and explain why this test helps prove that the program works correctly.",
    rubric: [
      { point: "Test input", lookFor: "Gives a clear input, argument, list, user action, or program state to test.", keywords: ["test", "input", "case", "when", "value"] },
      { point: "Expected output", lookFor: "States what should happen if the program is correct.", keywords: ["expected", "output", "should", "display", "return", "result"] },
      { point: "Reason", lookFor: "Explains why the test is meaningful, such as checking a boundary, normal case, or important branch.", keywords: ["because", "checks", "verifies", "branch", "condition", "edge"] },
      { point: "Specificity", lookFor: "Uses specific details from the student's program rather than a vague 'it should work.'", keywords: ["specific", "my program", "procedure", "list", "score", "user"] }
    ],
    checklist: ["I gave one exact test input or situation.", "I gave the expected result.", "I explained what the test checks.", "I used details from my own program."],
    tip: "A test is not complete unless you say both the input and expected output/behavior."
  },
  {
    id: "frq-ppr-5",
    category: "Written Response 2(b): Errors and Testing",
    title: "Identify and Correct an Error",
    prompt: "Describe one possible error that could occur in your program or selected procedure. Explain what incorrect behavior the error would cause, and describe how you would correct the error.",
    rubric: [
      { point: "Error identified", lookFor: "Names a plausible logic, condition, loop, list index, input validation, or calculation error.", keywords: ["error", "bug", "wrong", "incorrect", "issue"] },
      { point: "Incorrect behavior", lookFor: "Explains what the user would see or what result would be wrong.", keywords: ["would", "output", "display", "result", "behavior"] },
      { point: "Correction", lookFor: "Describes a specific fix, not only 'debug it.'", keywords: ["fix", "correct", "change", "replace", "move", "add"] },
      { point: "Why fix works", lookFor: "Connects the fix to the incorrect behavior.", keywords: ["because", "so", "prevents", "ensures", "therefore"] }
    ],
    checklist: ["I named a realistic error.", "I explained the wrong behavior.", "I gave a specific correction.", "I explained why the correction works."],
    tip: "The strongest error answers describe cause and effect: the code mistake causes a specific wrong behavior."
  },
  {
    id: "frq-ppr-6",
    category: "Written Response 2(c): Data Abstraction",
    title: "How Your List Manages Complexity",
    prompt: "Identify the list or collection shown in your PPR. Explain what data it stores, how your program uses that data, and how the list helps manage complexity compared with using many separate variables.",
    rubric: [
      { point: "List identified", lookFor: "Names the actual list, array, or collection from the PPR.", keywords: ["list", "array", "collection", "stores"] },
      { point: "Data stored", lookFor: "Explains what kind of data is stored in the list.", keywords: ["data", "items", "values", "names", "scores", "answers"] },
      { point: "Use of list", lookFor: "Explains how the program uses the list, such as traversal, lookup, filtering, adding, or removing.", keywords: ["use", "traverse", "append", "add", "remove", "search", "filter"] },
      { point: "Complexity", lookFor: "Explains why the list is simpler than many separate variables or repeated code.", keywords: ["complexity", "simpler", "instead", "separate variables", "manage", "easier"] }
    ],
    checklist: ["I named my actual list.", "I explained what it stores.", "I explained how the program uses it.", "I explained how it reduces complexity."],
    tip: "Do not only say 'lists store data.' Explain what would be harder without the list."
  },
  {
    id: "frq-ppr-7",
    category: "Written Response 2(c): Data Abstraction",
    title: "List Traversal and Result",
    prompt: "Describe a part of your program that traverses a list or collection. Explain what happens during each iteration and how the traversal affects the final result, output, or program state.",
    rubric: [
      { point: "Traversal named", lookFor: "Identifies a loop or repeated process that goes through list elements.", keywords: ["traverse", "loop", "for each", "while", "repeat", "each"] },
      { point: "Per-item action", lookFor: "Explains what happens to each item or selected items during traversal.", keywords: ["each", "item", "element", "check", "compare", "add"] },
      { point: "Final effect", lookFor: "Explains the final output, count, total, filtered list, chosen item, or state change.", keywords: ["final", "output", "result", "count", "total", "display"] },
      { point: "Condition or update", lookFor: "Mentions a condition or variable update used while traversing.", keywords: ["if", "condition", "update", "increase", "set", "change"] }
    ],
    checklist: ["I identified the loop/traversal.", "I explained what happens to each item.", "I explained the final result.", "I mentioned any condition or variable update."],
    tip: "Traversing means visiting items one by one. Make that order clear in your answer."
  },
  {
    id: "frq-ppr-8",
    category: "Written Response 2(c): Procedural Abstraction",
    title: "Procedure Abstraction and Managing Complexity",
    prompt: "Choose a student-developed procedure from your PPR. Explain how the procedure is an abstraction and how using the procedure helps manage complexity in your program. Include one example of how the procedure could be called.",
    rubric: [
      { point: "Procedure chosen", lookFor: "Identifies a real student-developed procedure from the PPR.", keywords: ["procedure", "function", "method", "called"] },
      { point: "Abstraction", lookFor: "Explains that the procedure hides details behind a name and reusable behavior.", keywords: ["abstraction", "hides", "details", "reuse", "name"] },
      { point: "Complexity", lookFor: "Explains how the procedure avoids repeated code, organizes logic, or makes updates easier.", keywords: ["complexity", "repeated", "organize", "easier", "maintain"] },
      { point: "Call example", lookFor: "Gives an example call with argument values or describes when the procedure is called.", keywords: ["call", "argument", "parameter", "example", "value"] }
    ],
    checklist: ["I named my procedure.", "I explained abstraction.", "I explained how it manages complexity.", "I gave a call example."],
    tip: "A procedure manages complexity when the rest of the program can use it without rewriting all its internal steps."
  },
  {
    id: "frq-ppr-9",
    category: "Written Response 1: Program Design Process",
    title: "Development Process and Improvement",
    prompt: "Describe one part of your development process for this program. Explain one difficulty, test result, or feedback item you discovered, and describe how you changed or could change the program in response.",
    rubric: [
      { point: "Development step", lookFor: "Mentions design, planning, coding, testing, debugging, feedback, or iteration.", keywords: ["design", "plan", "test", "debug", "feedback", "iteration"] },
      { point: "Problem or discovery", lookFor: "Describes a concrete difficulty, failed test, unexpected behavior, or user feedback.", keywords: ["problem", "difficulty", "error", "failed", "feedback", "unexpected"] },
      { point: "Change", lookFor: "Explains a change made or a realistic change that could be made.", keywords: ["changed", "improve", "fix", "add", "remove", "modify"] },
      { point: "Reason", lookFor: "Explains why the change improves the program.", keywords: ["because", "so that", "improves", "helps", "better"] }
    ],
    checklist: ["I named a development step.", "I described a specific difficulty or feedback.", "I explained a change.", "I explained why the change helps."],
    tip: "This question is about process. Do not only describe what the final program does."
  },
  {
    id: "frq-ppr-10",
    category: "Written Response 2(a): Boolean Logic and Selection",
    title: "Boolean Condition in Your Program",
    prompt: "Identify one Boolean expression or condition in your selected procedure. Explain when it evaluates to true, when it evaluates to false, and how the program behavior changes based on the result.",
    rubric: [
      { point: "Condition identified", lookFor: "Names or describes a real Boolean condition from the program.", keywords: ["condition", "boolean", "if", "true", "false"] },
      { point: "True case", lookFor: "Explains what makes the condition true and what code runs.", keywords: ["true", "when", "runs", "executes"] },
      { point: "False case", lookFor: "Explains what happens when the condition is false.", keywords: ["false", "otherwise", "else", "not"] },
      { point: "Behavior change", lookFor: "Explains how the program output, variable, list, or state changes differently.", keywords: ["changes", "output", "variable", "list", "result", "state"] }
    ],
    checklist: ["I identified a condition.", "I explained the true case.", "I explained the false case.", "I explained how behavior changes."],
    tip: "Boolean logic answers should not just say 'it checks something.' Say exactly what true and false mean."
  },
  {
    id: "frq-ppr-11",
    category: "Written Response 2(b): Boundary and Edge Testing",
    title: "Boundary or Edge Case",
    prompt: "Describe one boundary or edge case for your program. Explain the expected behavior for that case and why testing that case is important for correctness.",
    rubric: [
      { point: "Edge case", lookFor: "Identifies a special case such as empty input, first/last item, minimum/maximum value, duplicate value, or invalid input.", keywords: ["edge", "boundary", "empty", "first", "last", "minimum", "maximum", "invalid"] },
      { point: "Expected behavior", lookFor: "States what the program should do for the edge case.", keywords: ["should", "expected", "output", "message", "return"] },
      { point: "Importance", lookFor: "Explains why this test matters for correctness or avoiding crashes/wrong results.", keywords: ["important", "correct", "avoid", "prevent", "error", "crash"] },
      { point: "Program connection", lookFor: "Connects the edge case to a real part of the student's program.", keywords: ["program", "procedure", "list", "input", "user"] }
    ],
    checklist: ["I named a boundary/edge case.", "I gave expected behavior.", "I explained why it matters.", "I connected it to my own program."],
    tip: "Edge cases are often where bugs hide, so they make strong testing examples."
  },
  {
    id: "frq-ppr-12",
    category: "Written Response 2(c): Modification Using Abstractions",
    title: "Add a Feature Using Your List or Procedure",
    prompt: "Describe one new feature that could be added to your program. Explain how your existing list, procedure, or both could help implement the feature without rewriting the entire program.",
    rubric: [
      { point: "Feature", lookFor: "Describes a realistic new feature related to the program purpose.", keywords: ["feature", "add", "new", "could"] },
      { point: "Existing abstraction", lookFor: "Identifies an existing list or procedure that would help implement the feature.", keywords: ["list", "procedure", "function", "abstraction"] },
      { point: "Implementation idea", lookFor: "Explains how the abstraction would be used or modified.", keywords: ["use", "modify", "call", "append", "traverse", "parameter"] },
      { point: "Complexity", lookFor: "Explains why reuse is easier than rewriting large parts of the program.", keywords: ["complexity", "reuse", "rewrite", "easier", "maintain"] }
    ],
    checklist: ["I described a realistic feature.", "I named my list or procedure.", "I explained how I would use it.", "I explained how this reduces work or complexity."],
    tip: "This is a good way to show you understand why abstractions are useful beyond the first version of a program."
  }  ,
  {
    id: "frq-ppr-13",
    category: "Written Response 1: Program Design, Function, and Purpose",
    title: "Who Your Program Helps and One Design Choice",
    prompt: "Describe one specific group of users your program was made for. Then identify one design choice you made in your program, such as how input is collected or how output is shown, and explain how that choice makes the program work better for that group.",
    rubric: [
      { point: "Specific users", lookFor: "Names a specific group, such as 'students studying for a vocabulary quiz,' not just 'people.'", keywords: ["users", "students", "people who", "for", "players"] },
      { point: "Design choice", lookFor: "Names a concrete choice from the program, such as a dropdown instead of typing, a color warning, or a large button.", keywords: ["choice", "button", "dropdown", "display", "input", "chose", "design"] },
      { point: "Connection to users", lookFor: "Explains how that choice helps those users accomplish something, using cause and effect.", keywords: ["because", "so", "helps", "easier", "allows"] }
    ],
    checklist: ["I named a specific group of users.", "I named one real design choice from my program.", "I explained why it helps that group."],
    tip: "Be concrete. 'A dropdown of the 12 months so users can't mistype a date' beats 'it is user friendly.'"
  },
  {
    id: "frq-ppr-14",
    category: "Written Response 2(a): Algorithm Development",
    title: "What If the Loop Ran One Time Fewer?",
    prompt: "Look at the iteration in your selected procedure. Describe what would happen to the procedure's result if the loop ran one time fewer than it does now. Use a specific input to show the difference, and explain why the result changes or stays the same.",
    rubric: [
      { point: "Identifies the loop", lookFor: "Names the loop in the procedure and what it repeats over, such as each item in a list or a count.", keywords: ["loop", "for each", "repeat", "each item", "iteration"] },
      { point: "Specific input", lookFor: "Gives a specific input or list that would be used.", keywords: ["input", "list", "for example", "if the", "value"] },
      { point: "Effect on the result", lookFor: "States what the result would be with one fewer iteration compared to now, such as a missed last item or a lower total.", keywords: ["last", "miss", "skip", "would be", "instead of", "result"] },
      { point: "Explanation", lookFor: "Explains the cause: which step would not happen and why that changes or doesn't change the result.", keywords: ["because", "since", "never", "so"] }
    ],
    checklist: ["I named my loop.", "I used a specific input.", "I gave the result before and after.", "I explained why."],
    tip: "Off-by-one questions are about the last (or first) item. Say exactly which item would be skipped."
  },
  {
    id: "frq-ppr-15",
    category: "Written Response 2(b): Errors and Testing",
    title: "Two Calls That Run Different Code",
    prompt: "Write two different calls to your selected procedure, with different arguments, that cause different parts of the procedure's code to run. For each call, describe which part runs and what result the procedure produces.",
    rubric: [
      { point: "First call", lookFor: "Gives a specific call with real arguments, such as checkScore(85).", keywords: ["call", "(", "argument", "first"] },
      { point: "Second call", lookFor: "Gives a second call with different arguments.", keywords: ["second", "another", "call", "("] },
      { point: "Different code runs", lookFor: "Explains which branch or path of the code runs for each call, such as the IF part for one and the ELSE part for the other.", keywords: ["if", "else", "branch", "condition", "true", "false"] },
      { point: "Results", lookFor: "States the result or output for each call.", keywords: ["result", "returns", "displays", "output"] }
    ],
    checklist: ["I wrote two calls with real arguments.", "Each call runs a different part of the code.", "I gave the result of each call."],
    tip: "Pick one argument that makes your condition true and one that makes it false. That's the easiest way to get two different paths."
  },
  {
    id: "frq-ppr-16",
    category: "Written Response 2(c): Data Abstraction",
    title: "Rewriting Without Your List",
    prompt: "Explain how your program would need to be written differently if you could not use the list in your PPR. Describe at least one specific part of your code that would become longer or harder to change, and explain why.",
    rubric: [
      { point: "Names the list and its data", lookFor: "Identifies the list by name and what it stores.", keywords: ["list", "stores", "named", "contains"] },
      { point: "Alternative without a list", lookFor: "Describes the alternative, such as a separate variable for every item.", keywords: ["separate variables", "variable for each", "without", "instead"] },
      { point: "Specific code affected", lookFor: "Points to a specific part of the code, such as a loop, that would have to be repeated for each variable.", keywords: ["loop", "for each", "repeat", "each variable", "code"] },
      { point: "Why it's harder", lookFor: "Explains the cost: more code, can't use a loop, adding an item would mean changing code in many places.", keywords: ["because", "harder", "longer", "change", "add", "complex"] }
    ],
    checklist: ["I named my list and its data.", "I described the version without a list.", "I pointed to a specific part of my code.", "I explained why it would be worse."],
    tip: "The key idea is that a list lets one loop handle any number of items. Without it, every new item means new code."
  }

];
