export const unitMeta = [
  {
    "id": 1,
    "name": "Creative Development",
    "color": "blue"
  },
  {
    "id": 2,
    "name": "Data",
    "color": "teal"
  },
  {
    "id": 3,
    "name": "Algorithms and Programming",
    "color": "purple"
  },
  {
    "id": 4,
    "name": "Computer Systems and Networks",
    "color": "amber"
  },
  {
    "id": 5,
    "name": "Impact of Computing",
    "color": "coral"
  }
];

export const practiceTests = [
  {
    "id": "practice-1",
    "title": "Practice Test 1",
    "description": "A 70-question AP CSP practice exam covering all five units, with early robot path MCQs, binary conversion, Boolean logic, loops, lists, procedures, and longer code tracing.",
    "questions": [
      {
        "question": "Practice Test 1, Question 1: ROBOT SEQUENCE QUESTION: A robot starts at S facing up/north. The goal G is two squares to the robot's right/east.\n\nWhich sequence reaches the goal?",
        "choices": [
          "MOVE_FORWARD()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "ROTATE_LEFT()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nROTATE_RIGHT()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 1,
        "explanation": "The robot must first turn right to face east and then move forward two squares.",
        "unit": 3,
        "id": "T1-Q01"
      },
      {
        "question": "Practice Test 1, Question 2: BINARY CONVERSION: What decimal value is represented by the binary number 10110?",
        "choices": [
          "16",
          "20",
          "22",
          "26"
        ],
        "correctAnswer": 2,
        "explanation": "10110₂ equals 16 + 0 + 4 + 2 + 0, which is 22.",
        "unit": 2,
        "id": "T1-Q02"
      },
      {
        "question": "Practice Test 1, Question 3: BINARY CONVERSION: What is the binary representation of the decimal number 19?",
        "choices": [
          "10011",
          "10101",
          "11001",
          "11100"
        ],
        "correctAnswer": 0,
        "explanation": "19 = 16 + 2 + 1, so the bits are 10011.",
        "unit": 2,
        "id": "T1-Q03"
      },
      {
        "question": "Practice Test 1, Question 4: CODE QUESTION: What is displayed?\n\na ← 7\nb ← 12\nresult ← (a < 10) AND (b MOD 5 = 2)\nDISPLAY(result)",
        "choices": [
          "true",
          "false",
          "7",
          "12"
        ],
        "correctAnswer": 0,
        "explanation": "Both comparisons are true because 7 < 10 and 12 MOD 5 is 2, so true AND true is true.",
        "unit": 3,
        "id": "T1-Q04"
      },
      {
        "question": "Practice Test 1, Question 5: LONGER CODE TRACE: What is displayed?\n\ntotal ← 0\ni ← 1\nREPEAT 4 TIMES\n{\n  total ← total + i\n  i ← i + 2\n}\nDISPLAY(total)",
        "choices": [
          "10",
          "12",
          "16",
          "20"
        ],
        "correctAnswer": 2,
        "explanation": "The loop adds 1, 3, 5, and 7, so the total is 16.",
        "unit": 3,
        "id": "T1-Q05"
      },
      {
        "question": "Practice Test 1, Question 6: MISSING LINE CODE QUESTION: The code should count how many even numbers are in the list. Which line should replace <MISSING LINE>?\n\nnumbers ← [3, 8, 10, 5, 2]\ncount ← 0\nFOR EACH n IN numbers\n{\n  IF(<MISSING LINE>)\n  {\n    count ← count + 1\n  }\n}\nDISPLAY(count)",
        "choices": [
          "n MOD 2 = 0",
          "n MOD 2 = 1",
          "n > count",
          "numbers[n] = 2"
        ],
        "correctAnswer": 0,
        "explanation": "A number is even when the remainder after dividing by 2 is 0.",
        "unit": 3,
        "id": "T1-Q06"
      },
      {
        "question": "Practice Test 1, Question 7: PROCEDURE TRACE: What is displayed?\n\nPROCEDURE scoreBonus(score, late)\n{\n  IF(late)\n  {\n    RETURN(score - 5)\n  }\n  IF(score ≥ 90)\n  {\n    RETURN(score + 10)\n  }\n  ELSE\n  {\n    RETURN(score)\n  }\n}\nDISPLAY(scoreBonus(92, false))",
        "choices": [
          "87",
          "92",
          "97",
          "102"
        ],
        "correctAnswer": 3,
        "explanation": "late is false, score is at least 90, so the procedure returns 92 + 10 = 102.",
        "unit": 3,
        "id": "T1-Q07"
      },
      {
        "question": "Practice Test 1, Question 8: ROBOT SAFETY CODE: A robot should move forward only when the square ahead is open. Which code avoids a program-terminating blocked move?",
        "choices": [
          "MOVE_FORWARD()",
          "IF(CAN_MOVE(forward))\n{\n  MOVE_FORWARD()\n}",
          "IF(NOT CAN_MOVE(forward))\n{\n  MOVE_FORWARD()\n}",
          "ROTATE_LEFT()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 1,
        "explanation": "CAN_MOVE(forward) checks the square ahead before MOVE_FORWARD is attempted.",
        "unit": 3,
        "id": "T1-Q08"
      },
      {
        "question": "Practice Test 1, Question 9: LIST TRACE: What is displayed?\n\nnums ← [2, 4, 6]\nAPPEND(nums, 8)\nINSERT(nums, 2, 3)\nREMOVE(nums, 4)\nDISPLAY(nums[2] + LENGTH(nums))",
        "choices": [
          "5",
          "6",
          "7",
          "8"
        ],
        "correctAnswer": 2,
        "explanation": "The list becomes [2, 3, 4, 8], so nums[2] is 3 and LENGTH(nums) is 4; 3 + 4 = 7.",
        "unit": 3,
        "id": "T1-Q09"
      },
      {
        "question": "Practice Test 1, Question 10: REPEAT UNTIL TRACE: What is displayed?\n\nx ← 1\nsum ← 0\nREPEAT UNTIL(x > 5)\n{\n  sum ← sum + x\n  x ← x + 1\n}\nDISPLAY(sum)",
        "choices": [
          "10",
          "15",
          "20",
          "21"
        ],
        "correctAnswer": 1,
        "explanation": "The loop adds 1 + 2 + 3 + 4 + 5 before x becomes 6, so the sum is 15.",
        "unit": 3,
        "id": "T1-Q10"
      },
      {
        "question": "Practice Test 1, Question 11: ROBOT SEQUENCE QUESTION: A robot is facing up/north. The square directly ahead is blocked, the square to the right/east is open, and the goal is one square east. Which sequence reaches the goal without hitting the blocked square?",
        "choices": [
          "MOVE_FORWARD()",
          "ROTATE_LEFT()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nROTATE_RIGHT()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 2,
        "explanation": "The robot must turn right to face the open east square, then move forward.",
        "unit": 3,
        "id": "T1-Q11"
      },
      {
        "question": "Practice Test 1, Question 12: BOOLEAN CODE QUESTION: What is displayed?\n\nhasTicket ← false\nisMember ← true\nIF(hasTicket OR isMember)\n{\n  DISPLAY(\"enter\")\n}\nELSE\n{\n  DISPLAY(\"wait\")\n}",
        "choices": [
          "enter",
          "wait",
          "true",
          "false"
        ],
        "correctAnswer": 0,
        "explanation": "OR is true when at least one condition is true, and isMember is true.",
        "unit": 3,
        "id": "T1-Q12"
      },
      {
        "question": "Practice Test 1, Question 13: BINARY CONVERSION: What decimal value is represented by 111001?",
        "choices": [
          "49",
          "55",
          "57",
          "61"
        ],
        "correctAnswer": 2,
        "explanation": "111001₂ equals 32 + 16 + 8 + 1 = 57.",
        "unit": 2,
        "id": "T1-Q13"
      },
      {
        "question": "Practice Test 1, Question 14: BINARY CONVERSION: What is decimal 34 in binary?",
        "choices": [
          "100010",
          "100100",
          "101000",
          "110010"
        ],
        "correctAnswer": 0,
        "explanation": "34 = 32 + 2, so the binary form is 100010.",
        "unit": 2,
        "id": "T1-Q14"
      },
      {
        "question": "Practice Test 1, Question 15: LONGER CODE TRACE: What is displayed?\n\nvalues ← [1, 4, 7, 10]\nanswer ← 0\nFOR EACH item IN values\n{\n  IF(item > 5)\n  {\n    answer ← answer + item\n  }\n  ELSE\n  {\n    answer ← answer + 1\n  }\n}\nDISPLAY(answer)",
        "choices": [
          "14",
          "16",
          "19",
          "22"
        ],
        "correctAnswer": 2,
        "explanation": "For 1 and 4, the program adds 1 each; for 7 and 10, it adds those values, giving 1 + 1 + 7 + 10 = 19.",
        "unit": 3,
        "id": "T1-Q15"
      },
      {
        "question": "Practice Test 1, Question 16: A prototype of a study timer app is shown to a few users before the final version is built. What is the best reason to do this?",
        "choices": [
          "To make the source code impossible to copy",
          "To collect feedback while changes are still easier to make",
          "To prove the app has no privacy concerns",
          "To avoid documenting the project"
        ],
        "correctAnswer": 1,
        "explanation": "Early prototypes help developers learn from users before investing too much time in the wrong design.",
        "unit": 1,
        "id": "T1-Q16"
      },
      {
        "question": "Practice Test 1, Question 17: In sound recordings from a microphone, the decimal value 12 must be stored in binary. Which statement is true about binary representation?",
        "choices": [
          "Binary can represent text but not numbers",
          "Binary uses only 0s and 1s to represent information",
          "Binary prevents all data from being copied",
          "Binary stores every number using exactly two bits"
        ],
        "correctAnswer": 1,
        "explanation": "Computers represent all digital information using patterns of bits, which are 0s and 1s.",
        "unit": 2,
        "id": "T1-Q17"
      },
      {
        "question": "Practice Test 1, Question 18: CODE QUESTION: What is the final value of total?\n\ntotal ← 0\nREPEAT 4 TIMES\n{\n  total ← total + 3\n}",
        "choices": [
          "3",
          "4",
          "7",
          "12"
        ],
        "correctAnswer": 3,
        "explanation": "The loop adds 3 four times, so total becomes 12.",
        "unit": 3,
        "id": "T1-Q18"
      },
      {
        "question": "Practice Test 1, Question 19: In an email system, fault tolerance is important. Which design best supports fault tolerance?",
        "choices": [
          "Having multiple possible paths or backup systems if one component fails",
          "Deleting all network protocols",
          "Using exactly one server with no backup",
          "Making every password the same"
        ],
        "correctAnswer": 0,
        "explanation": "Fault tolerance keeps systems working by using redundancy and alternate paths when failures occur.",
        "unit": 4,
        "id": "T1-Q19"
      },
      {
        "question": "Practice Test 1, Question 20: A student wants to reuse an image in a presentation about translation apps. What should the student check first?",
        "choices": [
          "Whether the image uses loops",
          "The license or permission terms for using the image",
          "Whether the image was stored in a list",
          "Whether the image has an IP address"
        ],
        "correctAnswer": 1,
        "explanation": "Intellectual property rules and licenses determine whether and how creative works can be reused.",
        "unit": 5,
        "id": "T1-Q20"
      },
      {
        "question": "Practice Test 1, Question 21: A team is building a club event calendar. Which action best shows iterative development?",
        "choices": [
          "Skipping planning so the final product is finished faster",
          "Writing every feature once and never changing it",
          "Building a small version, testing it with users, and improving it based on feedback",
          "Letting one student make all design choices without review"
        ],
        "correctAnswer": 2,
        "explanation": "Iterative development means creating, testing, receiving feedback, and refining through repeated cycles.",
        "unit": 1,
        "id": "T1-Q21"
      },
      {
        "question": "Practice Test 1, Question 22: A graph created from restaurant review ratings makes a sudden spike easy to see. What is the main advantage of visualization?",
        "choices": [
          "It changes analog data into digital data automatically",
          "It removes outliers from the dataset",
          "It helps people identify patterns, trends, and unusual values",
          "It always proves the data is correct"
        ],
        "correctAnswer": 2,
        "explanation": "Visualizations can make patterns and outliers easier to notice than raw tables alone.",
        "unit": 2,
        "id": "T1-Q22"
      },
      {
        "question": "Practice Test 1, Question 23: CODE QUESTION: What is displayed by this list code?\n\nnums ← [5, 10, 15, 20]\nDISPLAY(nums[2])",
        "choices": [
          "5",
          "10",
          "15",
          "An error occurs because lists start at index 0"
        ],
        "correctAnswer": 1,
        "explanation": "AP CSP lists start at index 1, so nums[2] is the second item, 10.",
        "unit": 3,
        "id": "T1-Q23"
      },
      {
        "question": "Practice Test 1, Question 24: Why are open protocols important for a classroom Wi-Fi network?",
        "choices": [
          "They remove the need for IP addresses",
          "They allow different devices and software systems to communicate using shared rules",
          "They guarantee every message is private",
          "They make all data lossy"
        ],
        "correctAnswer": 1,
        "explanation": "Open protocols support interoperability because many systems can follow the same communication rules.",
        "unit": 4,
        "id": "T1-Q24"
      },
      {
        "question": "Practice Test 1, Question 25: Which security threat could affect users of smart home assistants?",
        "choices": [
          "A binary number with four bits",
          "A loop that runs exactly five times",
          "Phishing messages that trick users into giving away account information",
          "A chart with a missing title"
        ],
        "correctAnswer": 2,
        "explanation": "Phishing is a cybersecurity threat that uses deception to steal sensitive information.",
        "unit": 5,
        "id": "T1-Q25"
      },
      {
        "question": "Practice Test 1, Question 26: Before coding a homework tracker, the team writes user stories and sketches screen layouts. What is the main purpose of this planning?",
        "choices": [
          "To make the program run faster on every device",
          "To guarantee there will be no errors",
          "To clarify goals, users, and features before implementation",
          "To remove the need for testing later"
        ],
        "correctAnswer": 2,
        "explanation": "Planning helps developers understand requirements and design decisions before they begin writing code.",
        "unit": 1,
        "id": "T1-Q26"
      },
      {
        "question": "Practice Test 1, Question 27: A file made from sports team statistics is compressed by replacing repeated values with shorter codes. What is the likely benefit?",
        "choices": [
          "The file no longer contains data",
          "The file becomes impossible to open",
          "The file may require less storage or bandwidth",
          "The file changes from digital to analog"
        ],
        "correctAnswer": 2,
        "explanation": "Compression reduces file size by representing data more efficiently.",
        "unit": 2,
        "id": "T1-Q27"
      },
      {
        "question": "Practice Test 1, Question 28: CODE QUESTION: Which statement should replace <MISSING LINE> to add 12 to the end of the list?\n\nvalues ← [3, 6, 9]\n<MISSING LINE>",
        "choices": [
          "APPEND(values, 12)",
          "INSERT(values, 12, 4)",
          "REMOVE(values, 12)",
          "LENGTH(values, 12)"
        ],
        "correctAnswer": 0,
        "explanation": "APPEND(list, value) adds the value to the end of a list.",
        "unit": 3,
        "id": "T1-Q28"
      },
      {
        "question": "Practice Test 1, Question 29: A router involved in a search engine request has which main responsibility?",
        "choices": [
          "Creating intellectual property licenses",
          "Sampling analog sound",
          "Forwarding packets toward their destinations",
          "Writing JavaScript code for the browser"
        ],
        "correctAnswer": 2,
        "explanation": "Routers inspect addressing information and forward packets across networks.",
        "unit": 4,
        "id": "T1-Q29"
      },
      {
        "question": "Practice Test 1, Question 30: Which design choice would improve privacy for automated license-plate readers?",
        "choices": [
          "Collecting only the data needed for the stated purpose",
          "Using the same password for all users",
          "Sharing every user's data by default",
          "Hiding the privacy policy from users"
        ],
        "correctAnswer": 0,
        "explanation": "Data minimization reduces privacy risk by limiting collection to what is necessary.",
        "unit": 5,
        "id": "T1-Q30"
      },
      {
        "question": "Practice Test 1, Question 31: A bug in a volunteer hour logger happens only when a user enters a blank value. Which testing approach is most likely to find this bug?",
        "choices": [
          "Only testing the most common valid input",
          "Changing the app colors before release",
          "Testing edge cases such as empty, very small, or very large inputs",
          "Deleting comments from the program"
        ],
        "correctAnswer": 2,
        "explanation": "Edge-case testing checks unusual or boundary inputs that often reveal hidden errors.",
        "unit": 1,
        "id": "T1-Q31"
      },
      {
        "question": "Practice Test 1, Question 32: When using public health case counts, which question is most directly about data privacy?",
        "choices": [
          "Which programming language was used?",
          "What color should the chart use?",
          "How many pixels are in the app icon?",
          "Who can access the data and how will it be protected?"
        ],
        "correctAnswer": 3,
        "explanation": "Privacy focuses on the collection, access, sharing, and protection of personal or sensitive data.",
        "unit": 2,
        "id": "T1-Q32"
      },
      {
        "question": "Practice Test 1, Question 33: CODE QUESTION: What does this procedure return?\n\nPROCEDURE doubleAndAddOne(n)\n{\n  result ← n * 2\n  RETURN(result + 1)\n}\n\nanswer ← doubleAndAddOne(6)",
        "choices": [
          "6",
          "7",
          "12",
          "13"
        ],
        "correctAnswer": 3,
        "explanation": "The procedure doubles 6 to get 12, then returns 12 + 1, which is 13.",
        "unit": 3,
        "id": "T1-Q33"
      },
      {
        "question": "Practice Test 1, Question 34: A task for a multiplayer quiz is divided across many computers at the same time. This is an example of what concept?",
        "choices": [
          "Distributed computing",
          "Phishing",
          "Binary overflow",
          "Single-factor authentication"
        ],
        "correctAnswer": 0,
        "explanation": "Distributed computing uses multiple connected computers to work on parts of a task.",
        "unit": 4,
        "id": "T1-Q34"
      },
      {
        "question": "Practice Test 1, Question 35: A harmful bias in generative AI tools is discovered after launch. What is the best next step?",
        "choices": [
          "Delete all documentation",
          "Increase the font size only",
          "Investigate the data and design choices, then revise and retest the system",
          "Ignore it because all computing innovations are neutral"
        ],
        "correctAnswer": 2,
        "explanation": "Responsible computing includes identifying harmful impacts, revising systems, and testing improvements.",
        "unit": 5,
        "id": "T1-Q35"
      },
      {
        "question": "Practice Test 1, Question 36: Two students disagree about the best design for a campus map app. Which response supports effective collaboration?",
        "choices": [
          "Compare the ideas against user needs and test a simple prototype",
          "Pick the idea from the student with the loudest opinion",
          "Combine both ideas even if they conflict with the project goal",
          "Stop discussing the feature until the project is due"
        ],
        "correctAnswer": 0,
        "explanation": "Good collaboration uses evidence, user needs, and prototypes instead of personal preference alone.",
        "unit": 1,
        "id": "T1-Q36"
      },
      {
        "question": "Practice Test 1, Question 37: Sound from GPS coordinates from a delivery route is captured many times per second and stored as numbers. What is this process called?",
        "choices": [
          "Routing",
          "Sampling",
          "Phishing",
          "Compiling"
        ],
        "correctAnswer": 1,
        "explanation": "Sampling records measurements of analog information at intervals so it can be represented digitally.",
        "unit": 2,
        "id": "T1-Q37"
      },
      {
        "question": "Practice Test 1, Question 38: CODE QUESTION: What is displayed by this traversal?\n\nwords ← [\"AP\", \"CSP\", \"Exam\"]\ncount ← 0\nFOR EACH item IN words\n{\n  count ← count + 1\n}\nDISPLAY(count)",
        "choices": [
          "0",
          "1",
          "3",
          "AP CSP Exam"
        ],
        "correctAnswer": 2,
        "explanation": "The list has three items, so the loop runs three times and count becomes 3.",
        "unit": 3,
        "id": "T1-Q38"
      },
      {
        "question": "Practice Test 1, Question 39: Which statement about bandwidth is most relevant to a remote backup system?",
        "choices": [
          "Bandwidth only affects printed documents",
          "Bandwidth is the same as a computer's battery life",
          "Bandwidth replaces the need for protocols",
          "Higher bandwidth can allow more data to be transmitted per unit of time"
        ],
        "correctAnswer": 3,
        "explanation": "Bandwidth describes the data transmission capacity of a network connection.",
        "unit": 4,
        "id": "T1-Q39"
      },
      {
        "question": "Practice Test 1, Question 40: When evaluating online voting discussions, which pair best shows both a benefit and a harm?",
        "choices": [
          "Better color choices, but larger fonts",
          "More storage, but fewer file names",
          "Improved convenience, but possible misuse or unequal impact",
          "Faster loops, but more syntax comments"
        ],
        "correctAnswer": 2,
        "explanation": "AP CSP impact questions often require considering both positive effects and possible negative consequences.",
        "unit": 5,
        "id": "T1-Q40"
      },
      {
        "question": "Practice Test 1, Question 41: A developer changes one feature in a library book recommender and then checks whether older features still work. What kind of testing is this closest to?",
        "choices": [
          "Lossy encoding",
          "Regression testing",
          "Data compression",
          "Parallel computing"
        ],
        "correctAnswer": 1,
        "explanation": "Regression testing checks that new changes did not break behavior that previously worked.",
        "unit": 1,
        "id": "T1-Q41"
      },
      {
        "question": "Practice Test 1, Question 42: A lossy compression method is applied to student attendance data. Which result is most likely?",
        "choices": [
          "The data will be encrypted with a private key",
          "The file will become larger in every case",
          "Some original detail may be permanently removed to reduce file size",
          "The internet will route the file through one fixed path"
        ],
        "correctAnswer": 2,
        "explanation": "Lossy compression reduces size by discarding some information, often in a way users may not easily notice.",
        "unit": 2,
        "id": "T1-Q42"
      },
      {
        "question": "Practice Test 1, Question 43: CODE QUESTION: The code should count only values greater than 10. Which change fixes the error?\n\ncount ← 0\nFOR EACH value IN scores\n{\n  IF(value > 10)\n  {\n    DISPLAY(value)\n  }\n  count ← count + 1\n}",
        "choices": [
          "Move count ← count + 1 inside the IF block",
          "Change value > 10 to value < 10",
          "Remove the FOR EACH loop",
          "Set count to LENGTH(scores) before the loop"
        ],
        "correctAnswer": 0,
        "explanation": "The counter must increase only when the condition is true, so it belongs inside the IF block.",
        "unit": 3,
        "id": "T1-Q43"
      },
      {
        "question": "Practice Test 1, Question 44: During a map directions app, data is split into smaller pieces that may travel across different routes. What are these pieces usually called?",
        "choices": [
          "Variables",
          "Packets",
          "Pixels",
          "Licenses"
        ],
        "correctAnswer": 1,
        "explanation": "Internet data is commonly divided into packets that can be routed independently across networks.",
        "unit": 4,
        "id": "T1-Q44"
      },
      {
        "question": "Practice Test 1, Question 45: Which issue related to facial recognition in schools is an example of the digital divide?",
        "choices": [
          "A router sends packets to another network",
          "Some people cannot benefit because they lack reliable devices or internet access",
          "A compressed file becomes smaller",
          "A variable changes value during execution"
        ],
        "correctAnswer": 1,
        "explanation": "The digital divide refers to unequal access to computing technology, internet service, or digital skills.",
        "unit": 5,
        "id": "T1-Q45"
      },
      {
        "question": "Practice Test 1, Question 46: The team for a classroom quiz game keeps a written list of known bugs, assigned owners, and fix status. Why is this useful?",
        "choices": [
          "It makes collaboration and debugging more organized",
          "It prevents users from requesting new features",
          "It automatically corrects syntax errors",
          "It converts the program into binary code"
        ],
        "correctAnswer": 0,
        "explanation": "Tracking issues helps a team communicate what is broken, who is responsible, and what remains to be fixed.",
        "unit": 1,
        "id": "T1-Q46"
      },
      {
        "question": "Practice Test 1, Question 47: A student notices that energy usage readings includes missing values. What should the student consider before drawing conclusions?",
        "choices": [
          "Missing values are the same as binary overflow",
          "Missing values automatically improve accuracy",
          "Missing values can bias analysis or make conclusions less reliable",
          "Missing values prove the dataset is always useless"
        ],
        "correctAnswer": 2,
        "explanation": "Incomplete data can distort results, so analysts should consider how missing values affect conclusions.",
        "unit": 2,
        "id": "T1-Q47"
      },
      {
        "question": "Practice Test 1, Question 48: CODE QUESTION: What value is displayed?\n\na ← 5\nb ← 9\nIF(a < b AND b < 12)\n{\n  DISPLAY(\"yes\")\n}\nELSE\n{\n  DISPLAY(\"no\")\n}",
        "choices": [
          "yes",
          "no",
          "5",
          "9"
        ],
        "correctAnswer": 0,
        "explanation": "Both a < b and b < 12 are true, so the AND condition is true and yes is displayed.",
        "unit": 3,
        "id": "T1-Q48"
      },
      {
        "question": "Practice Test 1, Question 49: For a video call, DNS is used before a connection is made. What does DNS mainly do?",
        "choices": [
          "It translates a domain name into an IP address",
          "It compresses images with lossy compression",
          "It writes the program's source code",
          "It prevents every cyberattack automatically"
        ],
        "correctAnswer": 0,
        "explanation": "DNS maps human-readable domain names to IP addresses used by computers on networks.",
        "unit": 4,
        "id": "T1-Q49"
      },
      {
        "question": "Practice Test 1, Question 50: A company collecting data through a ride-share app should be most transparent about what?",
        "choices": [
          "The number of comments in its source code",
          "The exact color of every button in its app",
          "The binary value of every character on screen",
          "What data is collected, why it is collected, and how it may be shared"
        ],
        "correctAnswer": 3,
        "explanation": "Transparency about collection and sharing helps users make informed privacy decisions.",
        "unit": 5,
        "id": "T1-Q50"
      },
      {
        "question": "Practice Test 1, Question 51: A prototype of a science fair registration page is shown to a few users before the final version is built. What is the best reason to do this?",
        "choices": [
          "To collect feedback while changes are still easier to make",
          "To make the source code impossible to copy",
          "To prove the app has no privacy concerns",
          "To avoid documenting the project"
        ],
        "correctAnswer": 0,
        "explanation": "Early prototypes help developers learn from users before investing too much time in the wrong design.",
        "unit": 1,
        "id": "T1-Q51"
      },
      {
        "question": "Practice Test 1, Question 52: In online store click data, the decimal value 19 must be stored in binary. Which statement is true about binary representation?",
        "choices": [
          "Binary stores every number using exactly two bits",
          "Binary prevents all data from being copied",
          "Binary can represent text but not numbers",
          "Binary uses only 0s and 1s to represent information"
        ],
        "correctAnswer": 3,
        "explanation": "Computers represent all digital information using patterns of bits, which are 0s and 1s.",
        "unit": 2,
        "id": "T1-Q52"
      },
      {
        "question": "Practice Test 1, Question 53: ROBOT SEQUENCE QUESTION: A robot starts on S facing right/east. The goal G is three open squares straight ahead.\n\nGrid: S  _  _  G\n\nWhich sequence moves the robot from S to G?",
        "choices": [
          "MOVE_FORWARD()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "MOVE_FORWARD()\nROTATE_LEFT()\nMOVE_FORWARD()",
          "ROTATE_LEFT()\nMOVE_FORWARD()\nMOVE_FORWARD()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 0,
        "explanation": "Because the robot is already facing the goal, it only needs to move forward three times.",
        "unit": 3,
        "id": "T1-Q53"
      },
      {
        "question": "Practice Test 1, Question 54: In an online game match, fault tolerance is important. Which design best supports fault tolerance?",
        "choices": [
          "Using exactly one server with no backup",
          "Making every password the same",
          "Deleting all network protocols",
          "Having multiple possible paths or backup systems if one component fails"
        ],
        "correctAnswer": 3,
        "explanation": "Fault tolerance keeps systems working by using redundancy and alternate paths when failures occur.",
        "unit": 4,
        "id": "T1-Q54"
      },
      {
        "question": "Practice Test 1, Question 55: A student wants to reuse an image in a presentation about online learning platforms. What should the student check first?",
        "choices": [
          "Whether the image was stored in a list",
          "The license or permission terms for using the image",
          "Whether the image has an IP address",
          "Whether the image uses loops"
        ],
        "correctAnswer": 1,
        "explanation": "Intellectual property rules and licenses determine whether and how creative works can be reused.",
        "unit": 5,
        "id": "T1-Q55"
      },
      {
        "question": "Practice Test 1, Question 56: A team is building a bus arrival notifier. Which action best shows iterative development?",
        "choices": [
          "Writing every feature once and never changing it",
          "Letting one student make all design choices without review",
          "Building a small version, testing it with users, and improving it based on feedback",
          "Skipping planning so the final product is finished faster"
        ],
        "correctAnswer": 2,
        "explanation": "Iterative development means creating, testing, receiving feedback, and refining through repeated cycles.",
        "unit": 1,
        "id": "T1-Q56"
      },
      {
        "question": "Practice Test 1, Question 57: A graph created from a fitness tracker dataset makes a sudden spike easy to see. What is the main advantage of visualization?",
        "choices": [
          "It removes outliers from the dataset",
          "It always proves the data is correct",
          "It helps people identify patterns, trends, and unusual values",
          "It changes analog data into digital data automatically"
        ],
        "correctAnswer": 2,
        "explanation": "Visualizations can make patterns and outliers easier to notice than raw tables alone.",
        "unit": 2,
        "id": "T1-Q57"
      },
      {
        "question": "Practice Test 1, Question 58: CODE QUESTION: What is the final value of n?\n\nn ← 1\nREPEAT UNTIL(n > 20)\n{\n  n ← n * 2\n}",
        "choices": [
          "16",
          "20",
          "32",
          "64"
        ],
        "correctAnswer": 2,
        "explanation": "The values are 2, 4, 8, 16, and then 32; the loop stops once n > 20 is true.",
        "unit": 3,
        "id": "T1-Q58"
      },
      {
        "question": "Practice Test 1, Question 59: Why are open protocols important for a school website?",
        "choices": [
          "They guarantee every message is private",
          "They make all data lossy",
          "They remove the need for IP addresses",
          "They allow different devices and software systems to communicate using shared rules"
        ],
        "correctAnswer": 3,
        "explanation": "Open protocols support interoperability because many systems can follow the same communication rules.",
        "unit": 4,
        "id": "T1-Q59"
      },
      {
        "question": "Practice Test 1, Question 60: Which security threat could affect users of smartphone location sharing?",
        "choices": [
          "Phishing messages that trick users into giving away account information",
          "A binary number with four bits",
          "A chart with a missing title",
          "A loop that runs exactly five times"
        ],
        "correctAnswer": 0,
        "explanation": "Phishing is a cybersecurity threat that uses deception to steal sensitive information.",
        "unit": 5,
        "id": "T1-Q60"
      },
      {
        "question": "Practice Test 1, Question 61: Before coding a student planner app, the team writes user stories and sketches screen layouts. What is the main purpose of this planning?",
        "choices": [
          "To guarantee there will be no errors",
          "To remove the need for testing later",
          "To make the program run faster on every device",
          "To clarify goals, users, and features before implementation"
        ],
        "correctAnswer": 3,
        "explanation": "Planning helps developers understand requirements and design decisions before they begin writing code.",
        "unit": 1,
        "id": "T1-Q61"
      },
      {
        "question": "Practice Test 1, Question 62: A file made from weather sensor readings is compressed by replacing repeated values with shorter codes. What is the likely benefit?",
        "choices": [
          "The file changes from digital to analog",
          "The file may require less storage or bandwidth",
          "The file no longer contains data",
          "The file becomes impossible to open"
        ],
        "correctAnswer": 1,
        "explanation": "Compression reduces file size by representing data more efficiently.",
        "unit": 2,
        "id": "T1-Q62"
      },
      {
        "question": "Practice Test 1, Question 63: ROBOT SEQUENCE QUESTION: A robot starts facing up/north. The goal is one square to the robot's right/east.\n\nWhich sequence reaches the goal?",
        "choices": [
          "MOVE_FORWARD()\nROTATE_RIGHT()",
          "ROTATE_LEFT()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nROTATE_RIGHT()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 2,
        "explanation": "The robot must turn right to face east, then move forward one square to reach the goal.",
        "unit": 3,
        "id": "T1-Q63"
      },
      {
        "question": "Practice Test 1, Question 64: A router involved in a file download has which main responsibility?",
        "choices": [
          "Writing JavaScript code for the browser",
          "Forwarding packets toward their destinations",
          "Creating intellectual property licenses",
          "Sampling analog sound"
        ],
        "correctAnswer": 1,
        "explanation": "Routers inspect addressing information and forward packets across networks.",
        "unit": 4,
        "id": "T1-Q64"
      },
      {
        "question": "Practice Test 1, Question 65: Which design choice would improve privacy for AI resume screening?",
        "choices": [
          "Collecting only the data needed for the stated purpose",
          "Hiding the privacy policy from users",
          "Using the same password for all users",
          "Sharing every user's data by default"
        ],
        "correctAnswer": 0,
        "explanation": "Data minimization reduces privacy risk by limiting collection to what is necessary.",
        "unit": 5,
        "id": "T1-Q65"
      },
      {
        "question": "Practice Test 1, Question 66: A bug in a recycling reminder website happens only when a user enters a blank value. Which testing approach is most likely to find this bug?",
        "choices": [
          "Deleting comments from the program",
          "Only testing the most common valid input",
          "Testing edge cases such as empty, very small, or very large inputs",
          "Changing the app colors before release"
        ],
        "correctAnswer": 2,
        "explanation": "Edge-case testing checks unusual or boundary inputs that often reveal hidden errors.",
        "unit": 1,
        "id": "T1-Q66"
      },
      {
        "question": "Practice Test 1, Question 67: When using school survey responses, which question is most directly about data privacy?",
        "choices": [
          "Which programming language was used?",
          "What color should the chart use?",
          "How many pixels are in the app icon?",
          "Who can access the data and how will it be protected?"
        ],
        "correctAnswer": 3,
        "explanation": "Privacy focuses on the collection, access, sharing, and protection of personal or sensitive data.",
        "unit": 2,
        "id": "T1-Q67"
      },
      {
        "question": "Practice Test 1, Question 68: CODE QUESTION: A robot is facing forward. Which code avoids terminating the program when the square ahead is blocked?\n\nThe robot commands available include MOVE_FORWARD() and CAN_MOVE(forward).",
        "choices": [
          "IF(CAN_MOVE(forward)) { MOVE_FORWARD() }",
          "MOVE_FORWARD()",
          "REPEAT 10 TIMES { MOVE_FORWARD() }",
          "IF(NOT CAN_MOVE(forward)) { MOVE_FORWARD() }"
        ],
        "correctAnswer": 0,
        "explanation": "Checking CAN_MOVE(forward) before moving prevents the robot from trying to move into a blocked square.",
        "unit": 3,
        "id": "T1-Q68"
      },
      {
        "question": "Practice Test 1, Question 69: A task for a messaging app is divided across many computers at the same time. This is an example of what concept?",
        "choices": [
          "Distributed computing",
          "Phishing",
          "Single-factor authentication",
          "Binary overflow"
        ],
        "correctAnswer": 0,
        "explanation": "Distributed computing uses multiple connected computers to work on parts of a task.",
        "unit": 4,
        "id": "T1-Q69"
      },
      {
        "question": "Practice Test 1, Question 70: A harmful bias in social media recommendation feeds is discovered after launch. What is the best next step?",
        "choices": [
          "Ignore it because all computing innovations are neutral",
          "Increase the font size only",
          "Investigate the data and design choices, then revise and retest the system",
          "Delete all documentation"
        ],
        "correctAnswer": 2,
        "explanation": "Responsible computing includes identifying harmful impacts, revising systems, and testing improvements.",
        "unit": 5,
        "id": "T1-Q70"
      }
    ]
  },
  {
    "id": "practice-2",
    "title": "Practice Test 2",
    "description": "A 70-question AP CSP practice exam covering all five units, with early robot path MCQs, binary conversion, Boolean logic, loops, lists, procedures, and longer code tracing.",
    "questions": [
      {
        "question": "Practice Test 2, Question 1: ROBOT SEQUENCE QUESTION: A robot starts facing right/east. The goal is one square below/south of the robot. Which sequence reaches the goal?",
        "choices": [
          "ROTATE_LEFT()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nMOVE_FORWARD()",
          "MOVE_FORWARD()\nROTATE_RIGHT()",
          "ROTATE_RIGHT()\nROTATE_RIGHT()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 1,
        "explanation": "Facing east, a right turn points the robot south, then MOVE_FORWARD reaches the square below.",
        "unit": 3,
        "id": "T2-Q01"
      },
      {
        "question": "Practice Test 2, Question 2: BINARY CONVERSION: What decimal value is represented by 100101?",
        "choices": [
          "35",
          "37",
          "39",
          "41"
        ],
        "correctAnswer": 1,
        "explanation": "100101₂ equals 32 + 4 + 1 = 37.",
        "unit": 2,
        "id": "T2-Q02"
      },
      {
        "question": "Practice Test 2, Question 3: BINARY CONVERSION: What is decimal 27 in binary?",
        "choices": [
          "11011",
          "10111",
          "11101",
          "10011"
        ],
        "correctAnswer": 0,
        "explanation": "27 = 16 + 8 + 2 + 1, so the bits are 11011.",
        "unit": 2,
        "id": "T2-Q03"
      },
      {
        "question": "Practice Test 2, Question 4: BOOLEAN TRACE: What is displayed?\n\nx ← 5\ny ← 8\nDISPLAY((x > 3) AND NOT(y < 8))",
        "choices": [
          "true",
          "false",
          "5",
          "8"
        ],
        "correctAnswer": 0,
        "explanation": "x > 3 is true; y < 8 is false; NOT false is true; true AND true is true.",
        "unit": 3,
        "id": "T2-Q04"
      },
      {
        "question": "Practice Test 2, Question 5: LOOP TRACE: What is displayed?\n\ncount ← 0\nREPEAT 3 TIMES\n{\n  count ← count + 2\n}\nREPEAT 2 TIMES\n{\n  count ← count * 2\n}\nDISPLAY(count)",
        "choices": [
          "10",
          "12",
          "18",
          "24"
        ],
        "correctAnswer": 3,
        "explanation": "The first loop makes count 6, then the second loop doubles it twice: 12 then 24.",
        "unit": 3,
        "id": "T2-Q05"
      },
      {
        "question": "Practice Test 2, Question 6: MISSING LINE CODE QUESTION: The procedure should return true when num is between 10 and 20 inclusive. Which condition belongs in <MISSING LINE>?\n\nPROCEDURE inRange(num)\n{\n  IF(<MISSING LINE>)\n  {\n    RETURN(true)\n  }\n  RETURN(false)\n}",
        "choices": [
          "num > 10 OR num < 20",
          "num ≥ 10 AND num ≤ 20",
          "num ≤ 10 AND num ≥ 20",
          "num MOD 10 = 0"
        ],
        "correctAnswer": 1,
        "explanation": "Inclusive range checks require num ≥ 10 and num ≤ 20 at the same time.",
        "unit": 3,
        "id": "T2-Q06"
      },
      {
        "question": "Practice Test 2, Question 7: LIST AND LOOP TRACE: What is displayed?\n\nwords ← [\"a\", \"bb\", \"ccc\", \"dddd\"]\ntotal ← 0\nFOR EACH w IN words\n{\n  IF(LENGTH(w) > 2)\n  {\n    total ← total + LENGTH(w)\n  }\n}\nDISPLAY(total)",
        "choices": [
          "4",
          "5",
          "7",
          "10"
        ],
        "correctAnswer": 2,
        "explanation": "Only \"ccc\" and \"dddd\" have length greater than 2, so 3 + 4 = 7.",
        "unit": 3,
        "id": "T2-Q07"
      },
      {
        "question": "Practice Test 2, Question 8: ROBOT SEQUENCE QUESTION: A robot starts facing up/north. The goal is two squares above and then one square left/west. Which sequence reaches the goal?",
        "choices": [
          "MOVE_FORWARD()\nMOVE_FORWARD()\nROTATE_LEFT()\nMOVE_FORWARD()",
          "MOVE_FORWARD()\nROTATE_LEFT()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "ROTATE_LEFT()\nMOVE_FORWARD()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "MOVE_FORWARD()\nMOVE_FORWARD()\nROTATE_RIGHT()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 0,
        "explanation": "The robot moves north twice, turns left to face west, and moves once.",
        "unit": 3,
        "id": "T2-Q08"
      },
      {
        "question": "Practice Test 2, Question 9: PROCEDURE TRACE: What is displayed?\n\nPROCEDURE mystery(a, b)\n{\n  result ← 0\n  REPEAT b TIMES\n  {\n    result ← result + a\n  }\n  RETURN(result)\n}\nDISPLAY(mystery(4, 3))",
        "choices": [
          "7",
          "12",
          "16",
          "43"
        ],
        "correctAnswer": 1,
        "explanation": "The procedure adds 4 three times, so it returns 12.",
        "unit": 3,
        "id": "T2-Q09"
      },
      {
        "question": "Practice Test 2, Question 10: REPEAT UNTIL TRACE: What is displayed?\n\nx ← 20\nsteps ← 0\nREPEAT UNTIL(x < 3)\n{\n  x ← x / 2\n  steps ← steps + 1\n}\nDISPLAY(steps)",
        "choices": [
          "2",
          "3",
          "4",
          "5"
        ],
        "correctAnswer": 1,
        "explanation": "x becomes 10, 5, then 2.5, so the loop runs 3 times before x < 3 is true.",
        "unit": 3,
        "id": "T2-Q10"
      },
      {
        "question": "Practice Test 2, Question 11: BINARY CONVERSION: A color value uses the binary number 01111111. What is its decimal value?",
        "choices": [
          "63",
          "100",
          "127",
          "255"
        ],
        "correctAnswer": 2,
        "explanation": "01111111₂ equals 64 + 32 + 16 + 8 + 4 + 2 + 1 = 127.",
        "unit": 2,
        "id": "T2-Q11"
      },
      {
        "question": "Practice Test 2, Question 12: DECIMAL TO BINARY: Which binary number represents decimal 45?",
        "choices": [
          "101101",
          "101011",
          "110101",
          "111001"
        ],
        "correctAnswer": 0,
        "explanation": "45 = 32 + 8 + 4 + 1, so the binary form is 101101.",
        "unit": 2,
        "id": "T2-Q12"
      },
      {
        "question": "Practice Test 2, Question 13: LONGER CODE TRACE WITH BOOLEAN: What is displayed?\n\nscore ← 76\nmissing ← 1\nIF(score ≥ 70 AND missing = 0)\n{\n  DISPLAY(\"pass\")\n}\nELSE\n{\n  IF(score ≥ 70 AND missing ≤ 2)\n  {\n    DISPLAY(\"review\")\n  }\n  ELSE\n  {\n    DISPLAY(\"redo\")\n  }\n}",
        "choices": [
          "pass",
          "review",
          "redo",
          "true"
        ],
        "correctAnswer": 1,
        "explanation": "The first condition is false because missing is not 0, but the nested condition is true because 76 ≥ 70 and 1 ≤ 2.",
        "unit": 3,
        "id": "T2-Q13"
      },
      {
        "question": "Practice Test 2, Question 14: MISSING LINE CODE QUESTION: Which line should replace <MISSING LINE> so the list becomes [5, 10, 15, 20]?\n\nnums ← [5, 10, 20]\n<MISSING LINE>",
        "choices": [
          "APPEND(nums, 15)",
          "INSERT(nums, 3, 15)",
          "INSERT(nums, 4, 15)",
          "REMOVE(nums, 3)"
        ],
        "correctAnswer": 1,
        "explanation": "INSERT(nums, 3, 15) puts 15 at index 3 and shifts 20 to index 4.",
        "unit": 3,
        "id": "T2-Q14"
      },
      {
        "question": "Practice Test 2, Question 15: ROBOT WITH CAN_MOVE: Which code makes the robot turn left if it cannot move forward, otherwise move forward?",
        "choices": [
          "IF(CAN_MOVE(forward))\n{\n  ROTATE_LEFT()\n}\nELSE\n{\n  MOVE_FORWARD()\n}",
          "IF(CAN_MOVE(forward))\n{\n  MOVE_FORWARD()\n}\nELSE\n{\n  ROTATE_LEFT()\n}",
          "MOVE_FORWARD()\nROTATE_LEFT()",
          "ROTATE_LEFT()\nIF(CAN_MOVE(forward))\n{\n  MOVE_FORWARD()\n}"
        ],
        "correctAnswer": 1,
        "explanation": "The IF branch handles the open case with MOVE_FORWARD; the ELSE branch handles the blocked case with ROTATE_LEFT.",
        "unit": 3,
        "id": "T2-Q15"
      },
      {
        "question": "Practice Test 2, Question 16: Before coding a club event calendar, the team writes user stories and sketches screen layouts. What is the main purpose of this planning?",
        "choices": [
          "To make the program run faster on every device",
          "To guarantee there will be no errors",
          "To remove the need for testing later",
          "To clarify goals, users, and features before implementation"
        ],
        "correctAnswer": 3,
        "explanation": "Planning helps developers understand requirements and design decisions before they begin writing code.",
        "unit": 1,
        "id": "T2-Q16"
      },
      {
        "question": "Practice Test 2, Question 17: A file made from restaurant review ratings is compressed by replacing repeated values with shorter codes. What is the likely benefit?",
        "choices": [
          "The file no longer contains data",
          "The file becomes impossible to open",
          "The file may require less storage or bandwidth",
          "The file changes from digital to analog"
        ],
        "correctAnswer": 2,
        "explanation": "Compression reduces file size by representing data more efficiently.",
        "unit": 2,
        "id": "T2-Q17"
      },
      {
        "question": "Practice Test 2, Question 18: CODE QUESTION: What is displayed by this code?\n\nx ← 4\ny ← 10\nIF(NOT(x > y))\n{\n  DISPLAY(\"true path\")\n}\nELSE\n{\n  DISPLAY(\"false path\")\n}",
        "choices": [
          "true path",
          "false path",
          "4",
          "10"
        ],
        "correctAnswer": 0,
        "explanation": "x > y is false, and NOT false is true, so the IF block runs.",
        "unit": 3,
        "id": "T2-Q18"
      },
      {
        "question": "Practice Test 2, Question 19: A router involved in a classroom Wi-Fi network has which main responsibility?",
        "choices": [
          "Writing JavaScript code for the browser",
          "Creating intellectual property licenses",
          "Forwarding packets toward their destinations",
          "Sampling analog sound"
        ],
        "correctAnswer": 2,
        "explanation": "Routers inspect addressing information and forward packets across networks.",
        "unit": 4,
        "id": "T2-Q19"
      },
      {
        "question": "Practice Test 2, Question 20: Which design choice would improve privacy for smart home assistants?",
        "choices": [
          "Using the same password for all users",
          "Collecting only the data needed for the stated purpose",
          "Hiding the privacy policy from users",
          "Sharing every user's data by default"
        ],
        "correctAnswer": 1,
        "explanation": "Data minimization reduces privacy risk by limiting collection to what is necessary.",
        "unit": 5,
        "id": "T2-Q20"
      },
      {
        "question": "Practice Test 2, Question 21: A bug in a homework tracker happens only when a user enters a blank value. Which testing approach is most likely to find this bug?",
        "choices": [
          "Testing edge cases such as empty, very small, or very large inputs",
          "Only testing the most common valid input",
          "Changing the app colors before release",
          "Deleting comments from the program"
        ],
        "correctAnswer": 0,
        "explanation": "Edge-case testing checks unusual or boundary inputs that often reveal hidden errors.",
        "unit": 1,
        "id": "T2-Q21"
      },
      {
        "question": "Practice Test 2, Question 22: When using sports team statistics, which question is most directly about data privacy?",
        "choices": [
          "Which programming language was used?",
          "What color should the chart use?",
          "Who can access the data and how will it be protected?",
          "How many pixels are in the app icon?"
        ],
        "correctAnswer": 2,
        "explanation": "Privacy focuses on the collection, access, sharing, and protection of personal or sensitive data.",
        "unit": 2,
        "id": "T2-Q22"
      },
      {
        "question": "Practice Test 2, Question 23: CODE QUESTION: The procedure should return the average of two numbers. Which line is correct?\n\nPROCEDURE average(a, b)\n{\n  <MISSING LINE>\n}",
        "choices": [
          "RETURN((a + b) / 2)",
          "RETURN(a + b / 2)",
          "DISPLAY((a + b) / 2)",
          "RETURN(a * b / 2)"
        ],
        "correctAnswer": 0,
        "explanation": "Parentheses are needed so the sum of a and b is divided by 2, and RETURN sends the value back.",
        "unit": 3,
        "id": "T2-Q23"
      },
      {
        "question": "Practice Test 2, Question 24: A task for a search engine request is divided across many computers at the same time. This is an example of what concept?",
        "choices": [
          "Phishing",
          "Binary overflow",
          "Distributed computing",
          "Single-factor authentication"
        ],
        "correctAnswer": 2,
        "explanation": "Distributed computing uses multiple connected computers to work on parts of a task.",
        "unit": 4,
        "id": "T2-Q24"
      },
      {
        "question": "Practice Test 2, Question 25: A harmful bias in automated license-plate readers is discovered after launch. What is the best next step?",
        "choices": [
          "Increase the font size only",
          "Investigate the data and design choices, then revise and retest the system",
          "Ignore it because all computing innovations are neutral",
          "Delete all documentation"
        ],
        "correctAnswer": 1,
        "explanation": "Responsible computing includes identifying harmful impacts, revising systems, and testing improvements.",
        "unit": 5,
        "id": "T2-Q25"
      },
      {
        "question": "Practice Test 2, Question 26: Two students disagree about the best design for a volunteer hour logger. Which response supports effective collaboration?",
        "choices": [
          "Combine both ideas even if they conflict with the project goal",
          "Stop discussing the feature until the project is due",
          "Pick the idea from the student with the loudest opinion",
          "Compare the ideas against user needs and test a simple prototype"
        ],
        "correctAnswer": 3,
        "explanation": "Good collaboration uses evidence, user needs, and prototypes instead of personal preference alone.",
        "unit": 1,
        "id": "T2-Q26"
      },
      {
        "question": "Practice Test 2, Question 27: Sound from public health case counts is captured many times per second and stored as numbers. What is this process called?",
        "choices": [
          "Routing",
          "Compiling",
          "Sampling",
          "Phishing"
        ],
        "correctAnswer": 2,
        "explanation": "Sampling records measurements of analog information at intervals so it can be represented digitally.",
        "unit": 2,
        "id": "T2-Q27"
      },
      {
        "question": "Practice Test 2, Question 28: CODE QUESTION: What is displayed?\n\nsum ← 0\nnums ← [1, 3, 5]\nFOR EACH n IN nums\n{\n  sum ← sum + n\n}\nDISPLAY(sum)",
        "choices": [
          "3",
          "5",
          "9",
          "15"
        ],
        "correctAnswer": 2,
        "explanation": "The traversal adds 1 + 3 + 5, so sum is 9.",
        "unit": 3,
        "id": "T2-Q28"
      },
      {
        "question": "Practice Test 2, Question 29: Which statement about bandwidth is most relevant to a multiplayer quiz?",
        "choices": [
          "Bandwidth replaces the need for protocols",
          "Higher bandwidth can allow more data to be transmitted per unit of time",
          "Bandwidth only affects printed documents",
          "Bandwidth is the same as a computer's battery life"
        ],
        "correctAnswer": 1,
        "explanation": "Bandwidth describes the data transmission capacity of a network connection.",
        "unit": 4,
        "id": "T2-Q29"
      },
      {
        "question": "Practice Test 2, Question 30: When evaluating generative AI tools, which pair best shows both a benefit and a harm?",
        "choices": [
          "Improved convenience, but possible misuse or unequal impact",
          "More storage, but fewer file names",
          "Better color choices, but larger fonts",
          "Faster loops, but more syntax comments"
        ],
        "correctAnswer": 0,
        "explanation": "AP CSP impact questions often require considering both positive effects and possible negative consequences.",
        "unit": 5,
        "id": "T2-Q30"
      },
      {
        "question": "Practice Test 2, Question 31: A developer changes one feature in a campus map app and then checks whether older features still work. What kind of testing is this closest to?",
        "choices": [
          "Regression testing",
          "Parallel computing",
          "Lossy encoding",
          "Data compression"
        ],
        "correctAnswer": 0,
        "explanation": "Regression testing checks that new changes did not break behavior that previously worked.",
        "unit": 1,
        "id": "T2-Q31"
      },
      {
        "question": "Practice Test 2, Question 32: A lossy compression method is applied to GPS coordinates from a delivery route. Which result is most likely?",
        "choices": [
          "Some original detail may be permanently removed to reduce file size",
          "The data will be encrypted with a private key",
          "The file will become larger in every case",
          "The internet will route the file through one fixed path"
        ],
        "correctAnswer": 0,
        "explanation": "Lossy compression reduces size by discarding some information, often in a way users may not easily notice.",
        "unit": 2,
        "id": "T2-Q32"
      },
      {
        "question": "Practice Test 2, Question 33: CODE QUESTION: Which line correctly replaces the second item in scores with 100?\n\nscores ← [70, 80, 90]\n<MISSING LINE>",
        "choices": [
          "scores[2] ← 100",
          "scores[1] ← 100",
          "APPEND(scores, 2, 100)",
          "LENGTH(scores) ← 100"
        ],
        "correctAnswer": 0,
        "explanation": "AP CSP list index 2 refers to the second element, so scores[2] ← 100 updates the 80.",
        "unit": 3,
        "id": "T2-Q33"
      },
      {
        "question": "Practice Test 2, Question 34: During a remote backup system, data is split into smaller pieces that may travel across different routes. What are these pieces usually called?",
        "choices": [
          "Pixels",
          "Variables",
          "Packets",
          "Licenses"
        ],
        "correctAnswer": 2,
        "explanation": "Internet data is commonly divided into packets that can be routed independently across networks.",
        "unit": 4,
        "id": "T2-Q34"
      },
      {
        "question": "Practice Test 2, Question 35: Which issue related to online voting discussions is an example of the digital divide?",
        "choices": [
          "Some people cannot benefit because they lack reliable devices or internet access",
          "A router sends packets to another network",
          "A compressed file becomes smaller",
          "A variable changes value during execution"
        ],
        "correctAnswer": 0,
        "explanation": "The digital divide refers to unequal access to computing technology, internet service, or digital skills.",
        "unit": 5,
        "id": "T2-Q35"
      },
      {
        "question": "Practice Test 2, Question 36: The team for a library book recommender keeps a written list of known bugs, assigned owners, and fix status. Why is this useful?",
        "choices": [
          "It automatically corrects syntax errors",
          "It converts the program into binary code",
          "It prevents users from requesting new features",
          "It makes collaboration and debugging more organized"
        ],
        "correctAnswer": 3,
        "explanation": "Tracking issues helps a team communicate what is broken, who is responsible, and what remains to be fixed.",
        "unit": 1,
        "id": "T2-Q36"
      },
      {
        "question": "Practice Test 2, Question 37: A student notices that student attendance data includes missing values. What should the student consider before drawing conclusions?",
        "choices": [
          "Missing values can bias analysis or make conclusions less reliable",
          "Missing values prove the dataset is always useless",
          "Missing values automatically improve accuracy",
          "Missing values are the same as binary overflow"
        ],
        "correctAnswer": 0,
        "explanation": "Incomplete data can distort results, so analysts should consider how missing values affect conclusions.",
        "unit": 2,
        "id": "T2-Q37"
      },
      {
        "question": "Practice Test 2, Question 38: CODE QUESTION: What is displayed after this code runs?\n\ncount ← 1\nREPEAT UNTIL(count = 4)\n{\n  DISPLAY(count)\n  count ← count + 1\n}",
        "choices": [
          "1 2 3",
          "1 2 3 4",
          "2 3 4",
          "4 only"
        ],
        "correctAnswer": 0,
        "explanation": "The loop displays 1, 2, and 3, then stops when count becomes 4.",
        "unit": 3,
        "id": "T2-Q38"
      },
      {
        "question": "Practice Test 2, Question 39: For a map directions app, DNS is used before a connection is made. What does DNS mainly do?",
        "choices": [
          "It compresses images with lossy compression",
          "It writes the program's source code",
          "It translates a domain name into an IP address",
          "It prevents every cyberattack automatically"
        ],
        "correctAnswer": 2,
        "explanation": "DNS maps human-readable domain names to IP addresses used by computers on networks.",
        "unit": 4,
        "id": "T2-Q39"
      },
      {
        "question": "Practice Test 2, Question 40: A company collecting data through facial recognition in schools should be most transparent about what?",
        "choices": [
          "What data is collected, why it is collected, and how it may be shared",
          "The number of comments in its source code",
          "The exact color of every button in its app",
          "The binary value of every character on screen"
        ],
        "correctAnswer": 0,
        "explanation": "Transparency about collection and sharing helps users make informed privacy decisions.",
        "unit": 5,
        "id": "T2-Q40"
      },
      {
        "question": "Practice Test 2, Question 41: A prototype of a classroom quiz game is shown to a few users before the final version is built. What is the best reason to do this?",
        "choices": [
          "To make the source code impossible to copy",
          "To collect feedback while changes are still easier to make",
          "To avoid documenting the project",
          "To prove the app has no privacy concerns"
        ],
        "correctAnswer": 1,
        "explanation": "Early prototypes help developers learn from users before investing too much time in the wrong design.",
        "unit": 1,
        "id": "T2-Q41"
      },
      {
        "question": "Practice Test 2, Question 42: In energy usage readings, the decimal value 19 must be stored in binary. Which statement is true about binary representation?",
        "choices": [
          "Binary can represent text but not numbers",
          "Binary uses only 0s and 1s to represent information",
          "Binary prevents all data from being copied",
          "Binary stores every number using exactly two bits"
        ],
        "correctAnswer": 1,
        "explanation": "Computers represent all digital information using patterns of bits, which are 0s and 1s.",
        "unit": 2,
        "id": "T2-Q42"
      },
      {
        "question": "Practice Test 2, Question 43: CODE QUESTION: What is the purpose of this procedure?\n\nPROCEDURE hasLongWord(words)\n{\n  FOR EACH w IN words\n  {\n    IF(LENGTH(w) > 8)\n    {\n      RETURN(true)\n    }\n  }\n  RETURN(false)\n}",
        "choices": [
          "It returns true if any word has more than 8 characters",
          "It counts all words in the list",
          "It removes words with more than 8 characters",
          "It always returns false"
        ],
        "correctAnswer": 0,
        "explanation": "The procedure returns true immediately when it finds a word whose length is greater than 8.",
        "unit": 3,
        "id": "T2-Q43"
      },
      {
        "question": "Practice Test 2, Question 44: In a video call, fault tolerance is important. Which design best supports fault tolerance?",
        "choices": [
          "Using exactly one server with no backup",
          "Having multiple possible paths or backup systems if one component fails",
          "Making every password the same",
          "Deleting all network protocols"
        ],
        "correctAnswer": 1,
        "explanation": "Fault tolerance keeps systems working by using redundancy and alternate paths when failures occur.",
        "unit": 4,
        "id": "T2-Q44"
      },
      {
        "question": "Practice Test 2, Question 45: A student wants to reuse an image in a presentation about a ride-share app. What should the student check first?",
        "choices": [
          "Whether the image uses loops",
          "Whether the image was stored in a list",
          "Whether the image has an IP address",
          "The license or permission terms for using the image"
        ],
        "correctAnswer": 3,
        "explanation": "Intellectual property rules and licenses determine whether and how creative works can be reused.",
        "unit": 5,
        "id": "T2-Q45"
      },
      {
        "question": "Practice Test 2, Question 46: A team is building a science fair registration page. Which action best shows iterative development?",
        "choices": [
          "Building a small version, testing it with users, and improving it based on feedback",
          "Writing every feature once and never changing it",
          "Letting one student make all design choices without review",
          "Skipping planning so the final product is finished faster"
        ],
        "correctAnswer": 0,
        "explanation": "Iterative development means creating, testing, receiving feedback, and refining through repeated cycles.",
        "unit": 1,
        "id": "T2-Q46"
      },
      {
        "question": "Practice Test 2, Question 47: A graph created from online store click data makes a sudden spike easy to see. What is the main advantage of visualization?",
        "choices": [
          "It always proves the data is correct",
          "It helps people identify patterns, trends, and unusual values",
          "It changes analog data into digital data automatically",
          "It removes outliers from the dataset"
        ],
        "correctAnswer": 1,
        "explanation": "Visualizations can make patterns and outliers easier to notice than raw tables alone.",
        "unit": 2,
        "id": "T2-Q47"
      },
      {
        "question": "Practice Test 2, Question 48: CODE QUESTION: Which code correctly swaps the values of a and b using temp?",
        "choices": [
          "temp ← a; a ← b; b ← temp",
          "a ← b; b ← a",
          "temp ← b; b ← a; a ← b",
          "a ← temp; b ← a; temp ← b"
        ],
        "correctAnswer": 0,
        "explanation": "A temporary variable stores the original value of a before a is overwritten.",
        "unit": 3,
        "id": "T2-Q48"
      },
      {
        "question": "Practice Test 2, Question 49: Why are open protocols important for an online game match?",
        "choices": [
          "They remove the need for IP addresses",
          "They make all data lossy",
          "They guarantee every message is private",
          "They allow different devices and software systems to communicate using shared rules"
        ],
        "correctAnswer": 3,
        "explanation": "Open protocols support interoperability because many systems can follow the same communication rules.",
        "unit": 4,
        "id": "T2-Q49"
      },
      {
        "question": "Practice Test 2, Question 50: Which security threat could affect users of online learning platforms?",
        "choices": [
          "A binary number with four bits",
          "A loop that runs exactly five times",
          "A chart with a missing title",
          "Phishing messages that trick users into giving away account information"
        ],
        "correctAnswer": 3,
        "explanation": "Phishing is a cybersecurity threat that uses deception to steal sensitive information.",
        "unit": 5,
        "id": "T2-Q50"
      },
      {
        "question": "Practice Test 2, Question 51: Before coding a bus arrival notifier, the team writes user stories and sketches screen layouts. What is the main purpose of this planning?",
        "choices": [
          "To guarantee there will be no errors",
          "To make the program run faster on every device",
          "To clarify goals, users, and features before implementation",
          "To remove the need for testing later"
        ],
        "correctAnswer": 2,
        "explanation": "Planning helps developers understand requirements and design decisions before they begin writing code.",
        "unit": 1,
        "id": "T2-Q51"
      },
      {
        "question": "Practice Test 2, Question 52: A file made from a fitness tracker dataset is compressed by replacing repeated values with shorter codes. What is the likely benefit?",
        "choices": [
          "The file may require less storage or bandwidth",
          "The file changes from digital to analog",
          "The file no longer contains data",
          "The file becomes impossible to open"
        ],
        "correctAnswer": 0,
        "explanation": "Compression reduces file size by representing data more efficiently.",
        "unit": 2,
        "id": "T2-Q52"
      },
      {
        "question": "Practice Test 2, Question 53: ROBOT SEQUENCE QUESTION: A robot starts at the lower-left square facing up/north. The goal is two squares above the start and then one square to the right.\n\nWhich sequence reaches the goal?",
        "choices": [
          "MOVE_FORWARD()\nMOVE_FORWARD()\nROTATE_RIGHT()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nMOVE_FORWARD()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "MOVE_FORWARD()\nROTATE_LEFT()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "MOVE_FORWARD()\nMOVE_FORWARD()\nROTATE_LEFT()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 0,
        "explanation": "The robot moves north two squares, turns right to face east, and then moves forward one square.",
        "unit": 3,
        "id": "T2-Q53"
      },
      {
        "question": "Practice Test 2, Question 54: A router involved in a school website has which main responsibility?",
        "choices": [
          "Creating intellectual property licenses",
          "Writing JavaScript code for the browser",
          "Sampling analog sound",
          "Forwarding packets toward their destinations"
        ],
        "correctAnswer": 3,
        "explanation": "Routers inspect addressing information and forward packets across networks.",
        "unit": 4,
        "id": "T2-Q54"
      },
      {
        "question": "Practice Test 2, Question 55: Which design choice would improve privacy for smartphone location sharing?",
        "choices": [
          "Collecting only the data needed for the stated purpose",
          "Using the same password for all users",
          "Hiding the privacy policy from users",
          "Sharing every user's data by default"
        ],
        "correctAnswer": 0,
        "explanation": "Data minimization reduces privacy risk by limiting collection to what is necessary.",
        "unit": 5,
        "id": "T2-Q55"
      },
      {
        "question": "Practice Test 2, Question 56: A bug in a student planner app happens only when a user enters a blank value. Which testing approach is most likely to find this bug?",
        "choices": [
          "Testing edge cases such as empty, very small, or very large inputs",
          "Deleting comments from the program",
          "Changing the app colors before release",
          "Only testing the most common valid input"
        ],
        "correctAnswer": 0,
        "explanation": "Edge-case testing checks unusual or boundary inputs that often reveal hidden errors.",
        "unit": 1,
        "id": "T2-Q56"
      },
      {
        "question": "Practice Test 2, Question 57: When using weather sensor readings, which question is most directly about data privacy?",
        "choices": [
          "Which programming language was used?",
          "How many pixels are in the app icon?",
          "What color should the chart use?",
          "Who can access the data and how will it be protected?"
        ],
        "correctAnswer": 3,
        "explanation": "Privacy focuses on the collection, access, sharing, and protection of personal or sensitive data.",
        "unit": 2,
        "id": "T2-Q57"
      },
      {
        "question": "Practice Test 2, Question 58: CODE QUESTION: Which line should replace <MISSING LINE> to count how many values are negative?\n\ncount ← 0\nFOR EACH value IN nums\n{\n  IF(value < 0)\n  {\n    <MISSING LINE>\n  }\n}",
        "choices": [
          "count ← count + 1",
          "count ← value",
          "value ← count + 1",
          "DISPLAY(nums)"
        ],
        "correctAnswer": 0,
        "explanation": "Each time a negative value is found, the counter should increase by 1.",
        "unit": 3,
        "id": "T2-Q58"
      },
      {
        "question": "Practice Test 2, Question 59: A task for a file download is divided across many computers at the same time. This is an example of what concept?",
        "choices": [
          "Binary overflow",
          "Distributed computing",
          "Phishing",
          "Single-factor authentication"
        ],
        "correctAnswer": 1,
        "explanation": "Distributed computing uses multiple connected computers to work on parts of a task.",
        "unit": 4,
        "id": "T2-Q59"
      },
      {
        "question": "Practice Test 2, Question 60: A harmful bias in AI resume screening is discovered after launch. What is the best next step?",
        "choices": [
          "Investigate the data and design choices, then revise and retest the system",
          "Delete all documentation",
          "Ignore it because all computing innovations are neutral",
          "Increase the font size only"
        ],
        "correctAnswer": 0,
        "explanation": "Responsible computing includes identifying harmful impacts, revising systems, and testing improvements.",
        "unit": 5,
        "id": "T2-Q60"
      },
      {
        "question": "Practice Test 2, Question 61: Two students disagree about the best design for a recycling reminder website. Which response supports effective collaboration?",
        "choices": [
          "Stop discussing the feature until the project is due",
          "Compare the ideas against user needs and test a simple prototype",
          "Pick the idea from the student with the loudest opinion",
          "Combine both ideas even if they conflict with the project goal"
        ],
        "correctAnswer": 1,
        "explanation": "Good collaboration uses evidence, user needs, and prototypes instead of personal preference alone.",
        "unit": 1,
        "id": "T2-Q61"
      },
      {
        "question": "Practice Test 2, Question 62: Sound from school survey responses is captured many times per second and stored as numbers. What is this process called?",
        "choices": [
          "Compiling",
          "Routing",
          "Phishing",
          "Sampling"
        ],
        "correctAnswer": 3,
        "explanation": "Sampling records measurements of analog information at intervals so it can be represented digitally.",
        "unit": 2,
        "id": "T2-Q62"
      },
      {
        "question": "Practice Test 2, Question 63: ROBOT SEQUENCE QUESTION: A robot starts facing right/east. The goal is one square below the robot.\n\nWhich sequence reaches the goal?",
        "choices": [
          "ROTATE_LEFT()\nMOVE_FORWARD()",
          "MOVE_FORWARD()\nROTATE_RIGHT()",
          "ROTATE_RIGHT()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nROTATE_RIGHT()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 2,
        "explanation": "When facing east, rotating right makes the robot face south, so one forward move reaches the square below.",
        "unit": 3,
        "id": "T2-Q63"
      },
      {
        "question": "Practice Test 2, Question 64: Which statement about bandwidth is most relevant to a messaging app?",
        "choices": [
          "Bandwidth only affects printed documents",
          "Higher bandwidth can allow more data to be transmitted per unit of time",
          "Bandwidth is the same as a computer's battery life",
          "Bandwidth replaces the need for protocols"
        ],
        "correctAnswer": 1,
        "explanation": "Bandwidth describes the data transmission capacity of a network connection.",
        "unit": 4,
        "id": "T2-Q64"
      },
      {
        "question": "Practice Test 2, Question 65: When evaluating social media recommendation feeds, which pair best shows both a benefit and a harm?",
        "choices": [
          "Faster loops, but more syntax comments",
          "Improved convenience, but possible misuse or unequal impact",
          "More storage, but fewer file names",
          "Better color choices, but larger fonts"
        ],
        "correctAnswer": 1,
        "explanation": "AP CSP impact questions often require considering both positive effects and possible negative consequences.",
        "unit": 5,
        "id": "T2-Q65"
      },
      {
        "question": "Practice Test 2, Question 66: A developer changes one feature in a school lunch ordering tool and then checks whether older features still work. What kind of testing is this closest to?",
        "choices": [
          "Data compression",
          "Parallel computing",
          "Regression testing",
          "Lossy encoding"
        ],
        "correctAnswer": 2,
        "explanation": "Regression testing checks that new changes did not break behavior that previously worked.",
        "unit": 1,
        "id": "T2-Q66"
      },
      {
        "question": "Practice Test 2, Question 67: A lossy compression method is applied to image files for a yearbook. Which result is most likely?",
        "choices": [
          "The file will become larger in every case",
          "The data will be encrypted with a private key",
          "Some original detail may be permanently removed to reduce file size",
          "The internet will route the file through one fixed path"
        ],
        "correctAnswer": 2,
        "explanation": "Lossy compression reduces size by discarding some information, often in a way users may not easily notice.",
        "unit": 2,
        "id": "T2-Q67"
      },
      {
        "question": "Practice Test 2, Question 68: CODE QUESTION: What is displayed?\n\na ← [10, 20, 30, 40]\nREMOVE(a, 2)\nDISPLAY(a[2])",
        "choices": [
          "10",
          "20",
          "30",
          "40"
        ],
        "correctAnswer": 2,
        "explanation": "Removing index 2 removes 20 and shifts 30 into index 2.",
        "unit": 3,
        "id": "T2-Q68"
      },
      {
        "question": "Practice Test 2, Question 69: During a cloud document, data is split into smaller pieces that may travel across different routes. What are these pieces usually called?",
        "choices": [
          "Variables",
          "Packets",
          "Licenses",
          "Pixels"
        ],
        "correctAnswer": 1,
        "explanation": "Internet data is commonly divided into packets that can be routed independently across networks.",
        "unit": 4,
        "id": "T2-Q69"
      },
      {
        "question": "Practice Test 2, Question 70: Which issue related to digital payment apps is an example of the digital divide?",
        "choices": [
          "A router sends packets to another network",
          "Some people cannot benefit because they lack reliable devices or internet access",
          "A compressed file becomes smaller",
          "A variable changes value during execution"
        ],
        "correctAnswer": 1,
        "explanation": "The digital divide refers to unequal access to computing technology, internet service, or digital skills.",
        "unit": 5,
        "id": "T2-Q70"
      }
    ]
  },
  {
    "id": "practice-3",
    "title": "Practice Test 3",
    "description": "A 70-question AP CSP practice exam covering all five units, with early robot path MCQs, binary conversion, Boolean logic, loops, lists, procedures, and longer code tracing.",
    "questions": [
      {
        "question": "Practice Test 3, Question 1: ROBOT SEQUENCE QUESTION: A robot starts facing down/south. The goal is one square to the robot's right/west. Which sequence reaches the goal?",
        "choices": [
          "ROTATE_RIGHT()\nMOVE_FORWARD()",
          "ROTATE_LEFT()\nMOVE_FORWARD()",
          "MOVE_FORWARD()",
          "ROTATE_LEFT()\nROTATE_LEFT()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 0,
        "explanation": "When facing south, the robot's right side is west, so it rotates right and moves forward.",
        "unit": 3,
        "id": "T3-Q01"
      },
      {
        "question": "Practice Test 3, Question 2: BINARY CONVERSION: What decimal value is represented by 110010?",
        "choices": [
          "48",
          "50",
          "52",
          "54"
        ],
        "correctAnswer": 1,
        "explanation": "110010₂ equals 32 + 16 + 2 = 50.",
        "unit": 2,
        "id": "T3-Q02"
      },
      {
        "question": "Practice Test 3, Question 3: BINARY CONVERSION: What is decimal 58 in binary?",
        "choices": [
          "111010",
          "110110",
          "111100",
          "101110"
        ],
        "correctAnswer": 0,
        "explanation": "58 = 32 + 16 + 8 + 2, so the binary form is 111010.",
        "unit": 2,
        "id": "T3-Q03"
      },
      {
        "question": "Practice Test 3, Question 4: BOOLEAN AND LOOP TRACE: What is displayed?\n\nx ← 1\ncount ← 0\nREPEAT 6 TIMES\n{\n  IF(x MOD 2 = 1 OR x = 6)\n  {\n    count ← count + 1\n  }\n  x ← x + 1\n}\nDISPLAY(count)",
        "choices": [
          "3",
          "4",
          "5",
          "6"
        ],
        "correctAnswer": 1,
        "explanation": "The condition is true for x = 1, 3, 5, and 6, so count is 4.",
        "unit": 3,
        "id": "T3-Q04"
      },
      {
        "question": "Practice Test 3, Question 5: LONGER CODE TRACE: What is displayed?\n\nlist ← [2, 5, 8, 11]\nvalue ← 0\nFOR EACH item IN list\n{\n  IF(item MOD 2 = 0)\n  {\n    value ← value + item\n  }\n  ELSE\n  {\n    value ← value - 1\n  }\n}\nDISPLAY(value)",
        "choices": [
          "7",
          "8",
          "9",
          "10"
        ],
        "correctAnswer": 1,
        "explanation": "The even values 2 and 8 are added, and two odd values subtract 1 each, so 2 + 8 - 1 - 1 = 8.",
        "unit": 3,
        "id": "T3-Q05"
      },
      {
        "question": "Practice Test 3, Question 6: MISSING LINE CODE QUESTION: The code should stop when x is at least 10. Which condition belongs in REPEAT UNTIL?\n\nx ← 1\nREPEAT UNTIL(<MISSING LINE>)\n{\n  x ← x * 2\n}\nDISPLAY(x)",
        "choices": [
          "x < 10",
          "x = 1",
          "x ≥ 10",
          "x MOD 2 = 0"
        ],
        "correctAnswer": 2,
        "explanation": "REPEAT UNTIL stops once the condition is true, so x ≥ 10 is the correct stopping condition.",
        "unit": 3,
        "id": "T3-Q06"
      },
      {
        "question": "Practice Test 3, Question 7: PROCEDURE TRACE: What is displayed?\n\nPROCEDURE update(n)\n{\n  IF(n MOD 3 = 0)\n  {\n    RETURN(n / 3)\n  }\n  ELSE\n  {\n    RETURN(n + 2)\n  }\n}\nDISPLAY(update(update(12)))",
        "choices": [
          "4",
          "6",
          "8",
          "14"
        ],
        "correctAnswer": 1,
        "explanation": "update(12) returns 4, then update(4) returns 6 because 4 is not divisible by 3.",
        "unit": 3,
        "id": "T3-Q07"
      },
      {
        "question": "Practice Test 3, Question 8: ROBOT SEQUENCE QUESTION: A robot starts facing up/north. It must go around a blocked square directly ahead. The right/east square is open, and the goal is one square east and one square north from the start. Which sequence reaches the goal?",
        "choices": [
          "MOVE_FORWARD()\nROTATE_RIGHT()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nMOVE_FORWARD()\nROTATE_LEFT()\nMOVE_FORWARD()",
          "ROTATE_LEFT()\nMOVE_FORWARD()\nROTATE_RIGHT()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nROTATE_RIGHT()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 1,
        "explanation": "The robot turns east and moves around the blocked square, then turns north and moves to the goal.",
        "unit": 3,
        "id": "T3-Q08"
      },
      {
        "question": "Practice Test 3, Question 9: LIST INDEX QUESTION: In AP CSP lists, the first item is at index 1. What is displayed?\n\ncolors ← [\"red\", \"green\", \"blue\"]\nDISPLAY(colors[2])",
        "choices": [
          "red",
          "green",
          "blue",
          "An error occurs"
        ],
        "correctAnswer": 1,
        "explanation": "AP CSP list indexing starts at 1, so colors[2] is \"green\".",
        "unit": 3,
        "id": "T3-Q09"
      },
      {
        "question": "Practice Test 3, Question 10: MISSING LINE CODE QUESTION: The procedure should return the largest value in a nonempty list. Which line belongs at <MISSING LINE>?\n\nPROCEDURE maxValue(nums)\n{\n  biggest ← nums[1]\n  FOR EACH n IN nums\n  {\n    IF(n > biggest)\n    {\n      <MISSING LINE>\n    }\n  }\n  RETURN(biggest)\n}",
        "choices": [
          "n ← biggest",
          "biggest ← n",
          "APPEND(nums, biggest)",
          "RETURN(n)"
        ],
        "correctAnswer": 1,
        "explanation": "When a larger item is found, biggest must be updated to that item.",
        "unit": 3,
        "id": "T3-Q10"
      },
      {
        "question": "Practice Test 3, Question 11: BINARY CONVERSION: What decimal value is represented by 10000000?",
        "choices": [
          "64",
          "100",
          "128",
          "256"
        ],
        "correctAnswer": 2,
        "explanation": "10000000₂ has a 1 in the 128s place, so its value is 128.",
        "unit": 2,
        "id": "T3-Q11"
      },
      {
        "question": "Practice Test 3, Question 12: DECIMAL TO BINARY: Which binary number represents decimal 73?",
        "choices": [
          "1001001",
          "1000101",
          "1010001",
          "1101001"
        ],
        "correctAnswer": 0,
        "explanation": "73 = 64 + 8 + 1, so the binary form is 1001001.",
        "unit": 2,
        "id": "T3-Q12"
      },
      {
        "question": "Practice Test 3, Question 13: LONGER CODE TRACE WITH LIST CHANGES: What is displayed?\n\nitems ← [4, 6, 8]\nREMOVE(items, 2)\nAPPEND(items, 10)\nINSERT(items, 2, 5)\nDISPLAY(items[1] + items[2] + items[3])",
        "choices": [
          "15",
          "17",
          "19",
          "21"
        ],
        "correctAnswer": 1,
        "explanation": "The list becomes [4, 5, 8, 10], so the first three items sum to 17.",
        "unit": 3,
        "id": "T3-Q13"
      },
      {
        "question": "Practice Test 3, Question 14: BOOLEAN EXPRESSION: Which expression is true only when age is at least 13 and hasPermission is true?",
        "choices": [
          "age ≥ 13 OR hasPermission",
          "age > 13 AND hasPermission",
          "age ≥ 13 AND hasPermission",
          "NOT(age ≥ 13) AND hasPermission"
        ],
        "correctAnswer": 2,
        "explanation": "Both requirements must be true, so the expression uses AND with age ≥ 13.",
        "unit": 3,
        "id": "T3-Q14"
      },
      {
        "question": "Practice Test 3, Question 15: ROBOT LOOP QUESTION: A robot is facing an open hallway with the goal four squares ahead. Which code reaches the goal with the fewest repeated command lines?",
        "choices": [
          "MOVE_FORWARD()",
          "MOVE_FORWARD()\nMOVE_FORWARD()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "REPEAT 4 TIMES\n{\n  MOVE_FORWARD()\n}",
          "REPEAT UNTIL(CAN_MOVE(forward))\n{\n  MOVE_FORWARD()\n}"
        ],
        "correctAnswer": 2,
        "explanation": "A REPEAT 4 TIMES loop expresses four forward moves with less repeated code.",
        "unit": 3,
        "id": "T3-Q15"
      },
      {
        "question": "Practice Test 3, Question 16: Two students disagree about the best design for a homework tracker. Which response supports effective collaboration?",
        "choices": [
          "Stop discussing the feature until the project is due",
          "Pick the idea from the student with the loudest opinion",
          "Compare the ideas against user needs and test a simple prototype",
          "Combine both ideas even if they conflict with the project goal"
        ],
        "correctAnswer": 2,
        "explanation": "Good collaboration uses evidence, user needs, and prototypes instead of personal preference alone.",
        "unit": 1,
        "id": "T3-Q16"
      },
      {
        "question": "Practice Test 3, Question 17: Sound from sports team statistics is captured many times per second and stored as numbers. What is this process called?",
        "choices": [
          "Compiling",
          "Sampling",
          "Routing",
          "Phishing"
        ],
        "correctAnswer": 1,
        "explanation": "Sampling records measurements of analog information at intervals so it can be represented digitally.",
        "unit": 2,
        "id": "T3-Q17"
      },
      {
        "question": "Practice Test 3, Question 18: CODE QUESTION: Which condition is true when x is outside the range 1 through 10?",
        "choices": [
          "x < 1 OR x > 10",
          "x ≥ 1 AND x ≤ 10",
          "x < 1 AND x > 10",
          "NOT(x < 1 OR x > 10)"
        ],
        "correctAnswer": 0,
        "explanation": "A value is outside the range if it is below 1 or above 10.",
        "unit": 3,
        "id": "T3-Q18"
      },
      {
        "question": "Practice Test 3, Question 19: Which statement about bandwidth is most relevant to a search engine request?",
        "choices": [
          "Bandwidth is the same as a computer's battery life",
          "Bandwidth replaces the need for protocols",
          "Bandwidth only affects printed documents",
          "Higher bandwidth can allow more data to be transmitted per unit of time"
        ],
        "correctAnswer": 3,
        "explanation": "Bandwidth describes the data transmission capacity of a network connection.",
        "unit": 4,
        "id": "T3-Q19"
      },
      {
        "question": "Practice Test 3, Question 20: When evaluating automated license-plate readers, which pair best shows both a benefit and a harm?",
        "choices": [
          "Faster loops, but more syntax comments",
          "Improved convenience, but possible misuse or unequal impact",
          "More storage, but fewer file names",
          "Better color choices, but larger fonts"
        ],
        "correctAnswer": 1,
        "explanation": "AP CSP impact questions often require considering both positive effects and possible negative consequences.",
        "unit": 5,
        "id": "T3-Q20"
      },
      {
        "question": "Practice Test 3, Question 21: A developer changes one feature in a volunteer hour logger and then checks whether older features still work. What kind of testing is this closest to?",
        "choices": [
          "Parallel computing",
          "Regression testing",
          "Data compression",
          "Lossy encoding"
        ],
        "correctAnswer": 1,
        "explanation": "Regression testing checks that new changes did not break behavior that previously worked.",
        "unit": 1,
        "id": "T3-Q21"
      },
      {
        "question": "Practice Test 3, Question 22: A lossy compression method is applied to public health case counts. Which result is most likely?",
        "choices": [
          "The data will be encrypted with a private key",
          "The internet will route the file through one fixed path",
          "Some original detail may be permanently removed to reduce file size",
          "The file will become larger in every case"
        ],
        "correctAnswer": 2,
        "explanation": "Lossy compression reduces size by discarding some information, often in a way users may not easily notice.",
        "unit": 2,
        "id": "T3-Q22"
      },
      {
        "question": "Practice Test 3, Question 23: CODE QUESTION: What does the algorithm display?\n\nnums ← [2, 7, 4, 9]\nfound ← false\nFOR EACH n IN nums\n{\n  IF(n = 4)\n  {\n    found ← true\n  }\n}\nDISPLAY(found)",
        "choices": [
          "true",
          "false",
          "4",
          "22"
        ],
        "correctAnswer": 0,
        "explanation": "The traversal finds 4 in the list and sets found to true.",
        "unit": 3,
        "id": "T3-Q23"
      },
      {
        "question": "Practice Test 3, Question 24: During a multiplayer quiz, data is split into smaller pieces that may travel across different routes. What are these pieces usually called?",
        "choices": [
          "Packets",
          "Variables",
          "Licenses",
          "Pixels"
        ],
        "correctAnswer": 0,
        "explanation": "Internet data is commonly divided into packets that can be routed independently across networks.",
        "unit": 4,
        "id": "T3-Q24"
      },
      {
        "question": "Practice Test 3, Question 25: Which issue related to generative AI tools is an example of the digital divide?",
        "choices": [
          "Some people cannot benefit because they lack reliable devices or internet access",
          "A compressed file becomes smaller",
          "A router sends packets to another network",
          "A variable changes value during execution"
        ],
        "correctAnswer": 0,
        "explanation": "The digital divide refers to unequal access to computing technology, internet service, or digital skills.",
        "unit": 5,
        "id": "T3-Q25"
      },
      {
        "question": "Practice Test 3, Question 26: The team for a campus map app keeps a written list of known bugs, assigned owners, and fix status. Why is this useful?",
        "choices": [
          "It converts the program into binary code",
          "It automatically corrects syntax errors",
          "It prevents users from requesting new features",
          "It makes collaboration and debugging more organized"
        ],
        "correctAnswer": 3,
        "explanation": "Tracking issues helps a team communicate what is broken, who is responsible, and what remains to be fixed.",
        "unit": 1,
        "id": "T3-Q26"
      },
      {
        "question": "Practice Test 3, Question 27: A student notices that GPS coordinates from a delivery route includes missing values. What should the student consider before drawing conclusions?",
        "choices": [
          "Missing values can bias analysis or make conclusions less reliable",
          "Missing values automatically improve accuracy",
          "Missing values are the same as binary overflow",
          "Missing values prove the dataset is always useless"
        ],
        "correctAnswer": 0,
        "explanation": "Incomplete data can distort results, so analysts should consider how missing values affect conclusions.",
        "unit": 2,
        "id": "T3-Q27"
      },
      {
        "question": "Practice Test 3, Question 28: CODE QUESTION: Which statement best describes why this procedure uses abstraction?\n\nPROCEDURE addTax(price, rate)\n{\n  RETURN(price + price * rate)\n}",
        "choices": [
          "It hides the tax calculation behind a reusable procedure name",
          "It removes all inputs from the program",
          "It prevents the procedure from returning a value",
          "It makes the program impossible to test"
        ],
        "correctAnswer": 0,
        "explanation": "A procedure is an abstraction because callers can use addTax without rewriting or focusing on its internal calculation.",
        "unit": 3,
        "id": "T3-Q28"
      },
      {
        "question": "Practice Test 3, Question 29: For a remote backup system, DNS is used before a connection is made. What does DNS mainly do?",
        "choices": [
          "It writes the program's source code",
          "It compresses images with lossy compression",
          "It prevents every cyberattack automatically",
          "It translates a domain name into an IP address"
        ],
        "correctAnswer": 3,
        "explanation": "DNS maps human-readable domain names to IP addresses used by computers on networks.",
        "unit": 4,
        "id": "T3-Q29"
      },
      {
        "question": "Practice Test 3, Question 30: A company collecting data through online voting discussions should be most transparent about what?",
        "choices": [
          "The number of comments in its source code",
          "What data is collected, why it is collected, and how it may be shared",
          "The exact color of every button in its app",
          "The binary value of every character on screen"
        ],
        "correctAnswer": 1,
        "explanation": "Transparency about collection and sharing helps users make informed privacy decisions.",
        "unit": 5,
        "id": "T3-Q30"
      },
      {
        "question": "Practice Test 3, Question 31: A prototype of a library book recommender is shown to a few users before the final version is built. What is the best reason to do this?",
        "choices": [
          "To make the source code impossible to copy",
          "To prove the app has no privacy concerns",
          "To avoid documenting the project",
          "To collect feedback while changes are still easier to make"
        ],
        "correctAnswer": 3,
        "explanation": "Early prototypes help developers learn from users before investing too much time in the wrong design.",
        "unit": 1,
        "id": "T3-Q31"
      },
      {
        "question": "Practice Test 3, Question 32: In student attendance data, the decimal value 19 must be stored in binary. Which statement is true about binary representation?",
        "choices": [
          "Binary can represent text but not numbers",
          "Binary prevents all data from being copied",
          "Binary uses only 0s and 1s to represent information",
          "Binary stores every number using exactly two bits"
        ],
        "correctAnswer": 2,
        "explanation": "Computers represent all digital information using patterns of bits, which are 0s and 1s.",
        "unit": 2,
        "id": "T3-Q32"
      },
      {
        "question": "Practice Test 3, Question 33: CODE QUESTION: What is displayed?\n\nletters ← [\"A\", \"B\", \"C\"]\nletters[1] ← letters[3]\nDISPLAY(letters[1])",
        "choices": [
          "A",
          "B",
          "C",
          "An error occurs"
        ],
        "correctAnswer": 2,
        "explanation": "letters[3] is C, and assigning it to letters[1] makes the first item C.",
        "unit": 3,
        "id": "T3-Q33"
      },
      {
        "question": "Practice Test 3, Question 34: In a map directions app, fault tolerance is important. Which design best supports fault tolerance?",
        "choices": [
          "Deleting all network protocols",
          "Using exactly one server with no backup",
          "Making every password the same",
          "Having multiple possible paths or backup systems if one component fails"
        ],
        "correctAnswer": 3,
        "explanation": "Fault tolerance keeps systems working by using redundancy and alternate paths when failures occur.",
        "unit": 4,
        "id": "T3-Q34"
      },
      {
        "question": "Practice Test 3, Question 35: A student wants to reuse an image in a presentation about facial recognition in schools. What should the student check first?",
        "choices": [
          "The license or permission terms for using the image",
          "Whether the image was stored in a list",
          "Whether the image uses loops",
          "Whether the image has an IP address"
        ],
        "correctAnswer": 0,
        "explanation": "Intellectual property rules and licenses determine whether and how creative works can be reused.",
        "unit": 5,
        "id": "T3-Q35"
      },
      {
        "question": "Practice Test 3, Question 36: A team is building a classroom quiz game. Which action best shows iterative development?",
        "choices": [
          "Letting one student make all design choices without review",
          "Writing every feature once and never changing it",
          "Skipping planning so the final product is finished faster",
          "Building a small version, testing it with users, and improving it based on feedback"
        ],
        "correctAnswer": 3,
        "explanation": "Iterative development means creating, testing, receiving feedback, and refining through repeated cycles.",
        "unit": 1,
        "id": "T3-Q36"
      },
      {
        "question": "Practice Test 3, Question 37: A graph created from energy usage readings makes a sudden spike easy to see. What is the main advantage of visualization?",
        "choices": [
          "It always proves the data is correct",
          "It removes outliers from the dataset",
          "It changes analog data into digital data automatically",
          "It helps people identify patterns, trends, and unusual values"
        ],
        "correctAnswer": 3,
        "explanation": "Visualizations can make patterns and outliers easier to notice than raw tables alone.",
        "unit": 2,
        "id": "T3-Q37"
      },
      {
        "question": "Practice Test 3, Question 38: CODE QUESTION: Which missing line makes the loop eventually stop?\n\nn ← 0\nREPEAT UNTIL(n = 5)\n{\n  DISPLAY(n)\n  <MISSING LINE>\n}",
        "choices": [
          "n ← n + 1",
          "n ← 0",
          "DISPLAY(5)",
          "n ← n - 1"
        ],
        "correctAnswer": 0,
        "explanation": "Increasing n by 1 each time eventually makes n equal 5, so the loop stops.",
        "unit": 3,
        "id": "T3-Q38"
      },
      {
        "question": "Practice Test 3, Question 39: Why are open protocols important for a video call?",
        "choices": [
          "They remove the need for IP addresses",
          "They allow different devices and software systems to communicate using shared rules",
          "They make all data lossy",
          "They guarantee every message is private"
        ],
        "correctAnswer": 1,
        "explanation": "Open protocols support interoperability because many systems can follow the same communication rules.",
        "unit": 4,
        "id": "T3-Q39"
      },
      {
        "question": "Practice Test 3, Question 40: Which security threat could affect users of a ride-share app?",
        "choices": [
          "Phishing messages that trick users into giving away account information",
          "A binary number with four bits",
          "A chart with a missing title",
          "A loop that runs exactly five times"
        ],
        "correctAnswer": 0,
        "explanation": "Phishing is a cybersecurity threat that uses deception to steal sensitive information.",
        "unit": 5,
        "id": "T3-Q40"
      },
      {
        "question": "Practice Test 3, Question 41: Before coding a science fair registration page, the team writes user stories and sketches screen layouts. What is the main purpose of this planning?",
        "choices": [
          "To remove the need for testing later",
          "To clarify goals, users, and features before implementation",
          "To guarantee there will be no errors",
          "To make the program run faster on every device"
        ],
        "correctAnswer": 1,
        "explanation": "Planning helps developers understand requirements and design decisions before they begin writing code.",
        "unit": 1,
        "id": "T3-Q41"
      },
      {
        "question": "Practice Test 3, Question 42: A file made from online store click data is compressed by replacing repeated values with shorter codes. What is the likely benefit?",
        "choices": [
          "The file becomes impossible to open",
          "The file may require less storage or bandwidth",
          "The file changes from digital to analog",
          "The file no longer contains data"
        ],
        "correctAnswer": 1,
        "explanation": "Compression reduces file size by representing data more efficiently.",
        "unit": 2,
        "id": "T3-Q42"
      },
      {
        "question": "Practice Test 3, Question 43: CODE QUESTION: The program should display \"match\" if code is either 101 or 202. Which condition is correct?",
        "choices": [
          "code = 101 OR code = 202",
          "code = 101 AND code = 202",
          "NOT code = 101",
          "code ≠ 101 AND code ≠ 202"
        ],
        "correctAnswer": 0,
        "explanation": "The value can match either 101 or 202, so OR is the correct operator.",
        "unit": 3,
        "id": "T3-Q43"
      },
      {
        "question": "Practice Test 3, Question 44: A router involved in an online game match has which main responsibility?",
        "choices": [
          "Creating intellectual property licenses",
          "Forwarding packets toward their destinations",
          "Writing JavaScript code for the browser",
          "Sampling analog sound"
        ],
        "correctAnswer": 1,
        "explanation": "Routers inspect addressing information and forward packets across networks.",
        "unit": 4,
        "id": "T3-Q44"
      },
      {
        "question": "Practice Test 3, Question 45: Which design choice would improve privacy for online learning platforms?",
        "choices": [
          "Sharing every user's data by default",
          "Hiding the privacy policy from users",
          "Collecting only the data needed for the stated purpose",
          "Using the same password for all users"
        ],
        "correctAnswer": 2,
        "explanation": "Data minimization reduces privacy risk by limiting collection to what is necessary.",
        "unit": 5,
        "id": "T3-Q45"
      },
      {
        "question": "Practice Test 3, Question 46: A bug in a bus arrival notifier happens only when a user enters a blank value. Which testing approach is most likely to find this bug?",
        "choices": [
          "Only testing the most common valid input",
          "Testing edge cases such as empty, very small, or very large inputs",
          "Changing the app colors before release",
          "Deleting comments from the program"
        ],
        "correctAnswer": 1,
        "explanation": "Edge-case testing checks unusual or boundary inputs that often reveal hidden errors.",
        "unit": 1,
        "id": "T3-Q46"
      },
      {
        "question": "Practice Test 3, Question 47: When using a fitness tracker dataset, which question is most directly about data privacy?",
        "choices": [
          "What color should the chart use?",
          "Who can access the data and how will it be protected?",
          "Which programming language was used?",
          "How many pixels are in the app icon?"
        ],
        "correctAnswer": 1,
        "explanation": "Privacy focuses on the collection, access, sharing, and protection of personal or sensitive data.",
        "unit": 2,
        "id": "T3-Q47"
      },
      {
        "question": "Practice Test 3, Question 48: CODE QUESTION: What is displayed?\n\nnums ← [8, 6, 7]\nINSERT(nums, 1, 5)\nREMOVE(nums, 3)\nDISPLAY(nums[2])",
        "choices": [
          "5",
          "8",
          "6",
          "7"
        ],
        "correctAnswer": 1,
        "explanation": "After inserting 5, the list is [5,8,6,7]; removing index 3 removes 6, leaving index 2 as 8.",
        "unit": 3,
        "id": "T3-Q48"
      },
      {
        "question": "Practice Test 3, Question 49: A task for a school website is divided across many computers at the same time. This is an example of what concept?",
        "choices": [
          "Single-factor authentication",
          "Binary overflow",
          "Phishing",
          "Distributed computing"
        ],
        "correctAnswer": 3,
        "explanation": "Distributed computing uses multiple connected computers to work on parts of a task.",
        "unit": 4,
        "id": "T3-Q49"
      },
      {
        "question": "Practice Test 3, Question 50: A harmful bias in smartphone location sharing is discovered after launch. What is the best next step?",
        "choices": [
          "Investigate the data and design choices, then revise and retest the system",
          "Increase the font size only",
          "Delete all documentation",
          "Ignore it because all computing innovations are neutral"
        ],
        "correctAnswer": 0,
        "explanation": "Responsible computing includes identifying harmful impacts, revising systems, and testing improvements.",
        "unit": 5,
        "id": "T3-Q50"
      },
      {
        "question": "Practice Test 3, Question 51: Two students disagree about the best design for a student planner app. Which response supports effective collaboration?",
        "choices": [
          "Pick the idea from the student with the loudest opinion",
          "Stop discussing the feature until the project is due",
          "Compare the ideas against user needs and test a simple prototype",
          "Combine both ideas even if they conflict with the project goal"
        ],
        "correctAnswer": 2,
        "explanation": "Good collaboration uses evidence, user needs, and prototypes instead of personal preference alone.",
        "unit": 1,
        "id": "T3-Q51"
      },
      {
        "question": "Practice Test 3, Question 52: Sound from weather sensor readings is captured many times per second and stored as numbers. What is this process called?",
        "choices": [
          "Sampling",
          "Phishing",
          "Routing",
          "Compiling"
        ],
        "correctAnswer": 0,
        "explanation": "Sampling records measurements of analog information at intervals so it can be represented digitally.",
        "unit": 2,
        "id": "T3-Q52"
      },
      {
        "question": "Practice Test 3, Question 53: ROBOT SEQUENCE QUESTION: A robot starts facing up/north. It must move around a blocked square directly ahead. The square to the right is open, and the goal is one square to the right and one square up from the start.\n\nWhich sequence avoids the blocked square and reaches the goal?",
        "choices": [
          "MOVE_FORWARD()\nROTATE_RIGHT()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nMOVE_FORWARD()\nROTATE_LEFT()\nMOVE_FORWARD()",
          "ROTATE_LEFT()\nMOVE_FORWARD()\nROTATE_RIGHT()\nMOVE_FORWARD()",
          "MOVE_FORWARD()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 1,
        "explanation": "The robot first turns right and moves east, then turns left to face north and moves to the goal.",
        "unit": 3,
        "id": "T3-Q53"
      },
      {
        "question": "Practice Test 3, Question 54: Which statement about bandwidth is most relevant to a file download?",
        "choices": [
          "Bandwidth only affects printed documents",
          "Bandwidth is the same as a computer's battery life",
          "Higher bandwidth can allow more data to be transmitted per unit of time",
          "Bandwidth replaces the need for protocols"
        ],
        "correctAnswer": 2,
        "explanation": "Bandwidth describes the data transmission capacity of a network connection.",
        "unit": 4,
        "id": "T3-Q54"
      },
      {
        "question": "Practice Test 3, Question 55: When evaluating AI resume screening, which pair best shows both a benefit and a harm?",
        "choices": [
          "Improved convenience, but possible misuse or unequal impact",
          "Faster loops, but more syntax comments",
          "More storage, but fewer file names",
          "Better color choices, but larger fonts"
        ],
        "correctAnswer": 0,
        "explanation": "AP CSP impact questions often require considering both positive effects and possible negative consequences.",
        "unit": 5,
        "id": "T3-Q55"
      },
      {
        "question": "Practice Test 3, Question 56: A developer changes one feature in a recycling reminder website and then checks whether older features still work. What kind of testing is this closest to?",
        "choices": [
          "Parallel computing",
          "Lossy encoding",
          "Regression testing",
          "Data compression"
        ],
        "correctAnswer": 2,
        "explanation": "Regression testing checks that new changes did not break behavior that previously worked.",
        "unit": 1,
        "id": "T3-Q56"
      },
      {
        "question": "Practice Test 3, Question 57: A lossy compression method is applied to school survey responses. Which result is most likely?",
        "choices": [
          "The data will be encrypted with a private key",
          "Some original detail may be permanently removed to reduce file size",
          "The file will become larger in every case",
          "The internet will route the file through one fixed path"
        ],
        "correctAnswer": 1,
        "explanation": "Lossy compression reduces size by discarding some information, often in a way users may not easily notice.",
        "unit": 2,
        "id": "T3-Q57"
      },
      {
        "question": "Practice Test 3, Question 58: CODE QUESTION: What is displayed by this procedure call?\n\nPROCEDURE firstItem(aList)\n{\n  RETURN(aList[1])\n}\n\nDISPLAY(firstItem([\"cat\", \"dog\", \"bird\"]))",
        "choices": [
          "cat",
          "dog",
          "bird",
          "1"
        ],
        "correctAnswer": 0,
        "explanation": "AP CSP lists start at index 1, so the first item of the list is cat.",
        "unit": 3,
        "id": "T3-Q58"
      },
      {
        "question": "Practice Test 3, Question 59: During a messaging app, data is split into smaller pieces that may travel across different routes. What are these pieces usually called?",
        "choices": [
          "Licenses",
          "Variables",
          "Packets",
          "Pixels"
        ],
        "correctAnswer": 2,
        "explanation": "Internet data is commonly divided into packets that can be routed independently across networks.",
        "unit": 4,
        "id": "T3-Q59"
      },
      {
        "question": "Practice Test 3, Question 60: Which issue related to social media recommendation feeds is an example of the digital divide?",
        "choices": [
          "A router sends packets to another network",
          "Some people cannot benefit because they lack reliable devices or internet access",
          "A compressed file becomes smaller",
          "A variable changes value during execution"
        ],
        "correctAnswer": 1,
        "explanation": "The digital divide refers to unequal access to computing technology, internet service, or digital skills.",
        "unit": 5,
        "id": "T3-Q60"
      },
      {
        "question": "Practice Test 3, Question 61: The team for a school lunch ordering tool keeps a written list of known bugs, assigned owners, and fix status. Why is this useful?",
        "choices": [
          "It prevents users from requesting new features",
          "It automatically corrects syntax errors",
          "It makes collaboration and debugging more organized",
          "It converts the program into binary code"
        ],
        "correctAnswer": 2,
        "explanation": "Tracking issues helps a team communicate what is broken, who is responsible, and what remains to be fixed.",
        "unit": 1,
        "id": "T3-Q61"
      },
      {
        "question": "Practice Test 3, Question 62: A student notices that image files for a yearbook includes missing values. What should the student consider before drawing conclusions?",
        "choices": [
          "Missing values prove the dataset is always useless",
          "Missing values automatically improve accuracy",
          "Missing values are the same as binary overflow",
          "Missing values can bias analysis or make conclusions less reliable"
        ],
        "correctAnswer": 3,
        "explanation": "Incomplete data can distort results, so analysts should consider how missing values affect conclusions.",
        "unit": 2,
        "id": "T3-Q62"
      },
      {
        "question": "Practice Test 3, Question 63: CODE QUESTION: Which code segment finds the maximum value in a nonempty list nums?",
        "choices": [
          "max ← nums[1]; FOR EACH n IN nums { IF(n > max) { max ← n } }",
          "max ← 0; FOR EACH n IN nums { max ← max + n }",
          "max ← LENGTH(nums); DISPLAY(nums)",
          "FOR EACH n IN nums { REMOVE(nums, n) }"
        ],
        "correctAnswer": 0,
        "explanation": "Starting with the first item and replacing max only when a larger value is found is a standard maximum-finding algorithm.",
        "unit": 3,
        "id": "T3-Q63"
      },
      {
        "question": "Practice Test 3, Question 64: For a cloud document, DNS is used before a connection is made. What does DNS mainly do?",
        "choices": [
          "It prevents every cyberattack automatically",
          "It compresses images with lossy compression",
          "It writes the program's source code",
          "It translates a domain name into an IP address"
        ],
        "correctAnswer": 3,
        "explanation": "DNS maps human-readable domain names to IP addresses used by computers on networks.",
        "unit": 4,
        "id": "T3-Q64"
      },
      {
        "question": "Practice Test 3, Question 65: A company collecting data through digital payment apps should be most transparent about what?",
        "choices": [
          "The number of comments in its source code",
          "The exact color of every button in its app",
          "The binary value of every character on screen",
          "What data is collected, why it is collected, and how it may be shared"
        ],
        "correctAnswer": 3,
        "explanation": "Transparency about collection and sharing helps users make informed privacy decisions.",
        "unit": 5,
        "id": "T3-Q65"
      },
      {
        "question": "Practice Test 3, Question 66: A prototype of a community tutoring sign-up form is shown to a few users before the final version is built. What is the best reason to do this?",
        "choices": [
          "To make the source code impossible to copy",
          "To avoid documenting the project",
          "To prove the app has no privacy concerns",
          "To collect feedback while changes are still easier to make"
        ],
        "correctAnswer": 3,
        "explanation": "Early prototypes help developers learn from users before investing too much time in the wrong design.",
        "unit": 1,
        "id": "T3-Q66"
      },
      {
        "question": "Practice Test 3, Question 67: In traffic counter data, the decimal value 12 must be stored in binary. Which statement is true about binary representation?",
        "choices": [
          "Binary prevents all data from being copied",
          "Binary stores every number using exactly two bits",
          "Binary can represent text but not numbers",
          "Binary uses only 0s and 1s to represent information"
        ],
        "correctAnswer": 3,
        "explanation": "Computers represent all digital information using patterns of bits, which are 0s and 1s.",
        "unit": 2,
        "id": "T3-Q67"
      },
      {
        "question": "Practice Test 3, Question 68: ROBOT SEQUENCE QUESTION: A robot starts facing left/west. The goal is two squares behind the robot, which means the goal is two squares to the east.\n\nWhich sequence reaches the goal?",
        "choices": [
          "ROTATE_RIGHT()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "ROTATE_LEFT()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "ROTATE_RIGHT()\nROTATE_RIGHT()\nMOVE_FORWARD()\nMOVE_FORWARD()",
          "MOVE_FORWARD()\nMOVE_FORWARD()"
        ],
        "correctAnswer": 2,
        "explanation": "Two right turns make the robot face the opposite direction, east, and then two forward moves reach the goal.",
        "unit": 3,
        "id": "T3-Q68"
      },
      {
        "question": "Practice Test 3, Question 69: In a streaming music service, fault tolerance is important. Which design best supports fault tolerance?",
        "choices": [
          "Deleting all network protocols",
          "Having multiple possible paths or backup systems if one component fails",
          "Using exactly one server with no backup",
          "Making every password the same"
        ],
        "correctAnswer": 1,
        "explanation": "Fault tolerance keeps systems working by using redundancy and alternate paths when failures occur.",
        "unit": 4,
        "id": "T3-Q69"
      },
      {
        "question": "Practice Test 3, Question 70: A student wants to reuse an image in a presentation about telehealth software. What should the student check first?",
        "choices": [
          "Whether the image uses loops",
          "The license or permission terms for using the image",
          "Whether the image has an IP address",
          "Whether the image was stored in a list"
        ],
        "correctAnswer": 1,
        "explanation": "Intellectual property rules and licenses determine whether and how creative works can be reused.",
        "unit": 5,
        "id": "T3-Q70"
      }
    ]
  }
];
