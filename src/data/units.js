export const units = [
  {
    "id": 1,
    "name": "Creative Development",
    "color": "blue",
    "overview": "Creative Development is the AP CSP unit about turning ideas into useful computing artifacts. It covers collaboration, planning, iterative design, testing, debugging, documentation, and how a program's purpose guides every technical choice.",
    "topics": [
      {
        "id": "u1-t1",
        "name": "Collaboration in development",
        "paragraphs": [
          "Collaboration means more than splitting the work into random pieces. Good computing teams share a common goal, agree on responsibilities, communicate clearly, and use feedback to improve the artifact instead of relying on one person's opinion.",
          "In AP CSP, collaboration often appears through examples like pair programming, peer review, group brainstorming, user interviews, and version tracking. The key idea is that multiple perspectives can reveal problems one developer may miss, especially accessibility issues, confusing designs, biased assumptions, or incomplete requirements.",
          "A strong team usually decomposes the project into parts: interface design, data storage, algorithm design, testing, and documentation. Decomposition makes collaboration easier because people can work on smaller parts while still checking that the parts fit the overall purpose.",
          "Real-world example: a school lunch app team might have one student interview users, one design screens, one write the ordering logic, and one test the app with students who have different dietary needs. The final app becomes better because the team uses evidence from users rather than guessing.",
          "Exam tip: choices that mention user feedback, shared goals, communication, evidence, and revision are usually stronger than choices that say one person should decide everything or that testing should wait until the end."
        ]
      },
      {
        "id": "u1-t2",
        "name": "Program purpose, audience, and user needs",
        "paragraphs": [
          "A program's purpose is the problem it is meant to solve or the experience it is meant to create. The audience is the group of people expected to use it. AP CSP questions often ask you to connect features back to purpose and audience.",
          "Before writing code, developers should identify inputs, outputs, constraints, and success criteria. Inputs are data the program receives, outputs are results it produces, constraints are limits such as time, device size, privacy rules, or accessibility needs, and success criteria describe what it means for the program to work well.",
          "User needs matter because a technically correct program can still fail if it is confusing, inaccessible, slow, or solves the wrong problem. A reminder app for students, for example, should consider mobile screens, notification timing, simple language, and privacy around grades or assignments.",
          "This topic connects to impact of computing because design choices affect who benefits and who might be excluded. It also connects to programming because the purpose determines which algorithms, data structures, and interface elements are appropriate.",
          "Exam tip: if a question asks why planning matters, answer in terms of purpose, users, constraints, inputs, outputs, and reducing wasted work."
        ]
      },
      {
        "id": "u1-t3",
        "name": "Program design and planning",
        "paragraphs": [
          "Program design is the process of deciding how a program should be organized before or while it is being built. Planning can include sketches, wireframes, pseudocode, flowcharts, lists of requirements, test cases, and descriptions of data needed by the program.",
          "A design plan should not be so rigid that it prevents improvement. AP CSP emphasizes iterative development: developers build a small version, test it, gather feedback, revise it, and repeat. This is different from assuming the first plan is perfect.",
          "Planning often uses abstraction. For example, instead of thinking about every pixel in a game, a developer can plan objects such as player, enemy, score, and level. Each object or feature can then be developed separately.",
          "Real-world example: a tutoring app plan might start with the purpose, list user roles, identify data such as tutor availability, and sketch screens for booking sessions. Later, the team can test whether users understand the booking flow.",
          "Exam tip: when comparing design choices, prefer the option that reduces complexity, supports testing, and clearly matches the program's purpose."
        ]
      },
      {
        "id": "u1-t4",
        "name": "The iterative development process",
        "paragraphs": [
          "The development process usually includes investigating the problem, designing a solution, implementing features, testing, debugging, and refining the artifact. These steps often repeat rather than happen in a perfect straight line.",
          "A prototype is an early version used to explore ideas and get feedback. It may be incomplete, but it helps developers learn whether the planned solution is understandable and useful. Prototypes can be paper sketches, clickable mockups, or simple working programs.",
          "Incremental development means adding features in small pieces. This reduces risk because each feature can be tested before the next one is added. It also makes it easier to identify which change caused a new problem.",
          "This connects to algorithms and programming because iterative development helps developers test one procedure, loop, or list traversal at a time. It connects to data because feedback and test results become evidence for decisions.",
          "Exam tip: words like prototype, feedback, revise, refine, and incremental usually signal iterative development."
        ]
      },
      {
        "id": "u1-t5",
        "name": "Testing strategies",
        "paragraphs": [
          "Testing checks whether a program behaves as expected. A test case usually includes an input, the expected output or behavior, and the actual result. Good testing includes normal cases, boundary cases, and unusual or invalid cases.",
          "Boundary cases are values at the edge of a rule, such as 0, 1, the first item in a list, the last item in a list, or the exact cutoff between two outcomes. Many AP CSP code questions hide bugs at boundaries.",
          "Regression testing means rechecking old features after a change to make sure they still work. This matters because fixing one bug can accidentally create another bug somewhere else.",
          "Real-world example: for a quiz app, a test should check correct answers, wrong answers, unanswered questions, the first question, the last question, and score calculation. Testing only one easy case does not prove the app is reliable.",
          "Exam tip: testing can show the presence of errors but cannot always prove a program has no errors at all."
        ]
      },
      {
        "id": "u1-t6",
        "name": "Debugging and error correction",
        "paragraphs": [
          "Debugging is the process of finding and fixing the cause of incorrect behavior. Testing tells you that something is wrong; debugging helps you discover why it is wrong.",
          "Common AP CSP errors include using the wrong Boolean operator, updating a variable in the wrong place, using an invalid list index, repeating a loop too many or too few times, forgetting to initialize a variable, and returning too early from a procedure.",
          "Tracing is a powerful debugging technique. You make a small table of variable values and update it line by line as the program runs. This is especially useful for loops, lists, and procedure calls.",
          "Errors can be syntax errors, runtime errors, or logic errors. A syntax error breaks the rules of the language, a runtime error happens while the program runs, and a logic error allows the program to run but produces the wrong result.",
          "Exam tip: if a question asks what a code segment displays, do not guess. Trace each variable after each statement and remember that AP CSP lists start at index 1."
        ]
      },
      {
        "id": "u1-t7",
        "name": "Documentation, comments, and readability",
        "paragraphs": [
          "Documentation explains how a program or part of a program should be used. Comments explain important parts of the code, especially purpose, assumptions, and tricky logic. Good documentation helps collaboration and future maintenance.",
          "Readable code uses meaningful names, clear organization, and procedures that do one understandable job. A variable named totalScore is easier to understand than a variable named x when the program is calculating a score.",
          "Comments should not simply repeat obvious code. A useful comment explains why a decision was made or what a procedure is expected to accomplish. For example, a comment can explain that a loop skips inactive users to protect privacy or reduce processing time.",
          "This topic connects to abstraction because well-named procedures and comments hide unnecessary details while making purpose clear. It also supports testing because documented assumptions can be checked against test cases.",
          "Exam tip: the best documentation answer is usually the one that improves understanding, reuse, collaboration, or maintenance."
        ]
      },
      {
        "id": "u1-t8",
        "name": "Accessibility and inclusive design",
        "paragraphs": [
          "Inclusive design means building computing artifacts that can be used by people with different abilities, devices, languages, backgrounds, and internet access. Accessibility is not an extra decoration; it affects whether users can actually benefit from the program.",
          "Examples include readable font sizes, keyboard navigation, captions for audio, alt text for images, strong color contrast, simple instructions, and designs that work on mobile devices. These choices can reduce barriers for many users.",
          "Accessibility connects to the digital divide because some users may have older devices, slower internet, shared computers, or limited technical experience. Design decisions can make those gaps smaller or larger.",
          "Real-world example: an AP CSP study site should work on a phone, not require high-speed internet for every page, and explain terms clearly for first-time learners.",
          "Exam tip: when a question asks about broadening access, think about cost, device access, disability access, language, internet availability, and user experience."
        ]
      }
    ]
  },
  {
    "id": 2,
    "name": "Data",
    "color": "teal",
    "overview": "Data explains how computers represent information with bits, transform data through compression and cleaning, find patterns in datasets, and protect privacy. This unit is essential because every app, website, image, sound, and network message depends on digital representation.",
    "topics": [
      {
        "id": "u2-t1",
        "name": "Bits, bytes, and binary representation",
        "paragraphs": [
          "A bit is the smallest unit of digital information and can be either 0 or 1. A byte is usually 8 bits. Computers represent numbers, text, images, sounds, videos, and instructions using patterns of bits.",
          "Binary is base 2, so each place value is a power of 2. From right to left, the place values are 1, 2, 4, 8, 16, 32, 64, 128, and so on. This is similar to decimal place values, but decimal uses powers of 10.",
          "To convert binary to decimal, write the place values under the bits and add the values where the bit is 1. For example, 10110\u2082 has 1s in the 16, 4, and 2 places, so it equals 16 + 4 + 2 = 22.",
          "To convert decimal to binary, break the number into powers of 2. For example, 34 = 32 + 2, so the binary representation is 100010 because the 32s and 2s places are on and the other places are off.",
          "Exam tip: do not count binary places from left to right without knowing their values. Start at the rightmost bit as 1, then double each place as you move left."
        ]
      },
      {
        "id": "u2-t2",
        "name": "Decimal-to-binary and binary-to-decimal practice",
        "paragraphs": [
          "A reliable binary-to-decimal method is to make a place-value table. For 110010, write 32, 16, 8, 4, 2, 1 under the bits. Add the place values under the 1s: 32 + 16 + 2 = 50.",
          "A reliable decimal-to-binary method is to choose the largest power of 2 that fits in the number, subtract it, and keep going. For 58, choose 32, subtract to get 26, choose 16, subtract to get 10, choose 8, subtract to get 2, then choose 2. That gives 32 + 16 + 8 + 2, or 111010\u2082.",
          "Leading zeros do not change the value of a binary number. For example, 00010110 and 10110 both represent 22. Leading zeros are often used when a fixed number of bits is required, such as an 8-bit color value.",
          "Binary matters beyond math problems because all digital data is represented by bits. Text can use encodings, images can use pixel values, and sound can use sampled numeric values.",
          "Exam tip: when answer choices are close, quickly estimate. If a 6-bit number starts with 1, it has at least 32; if it starts with 11, it has at least 48."
        ]
      },
      {
        "id": "u2-t3",
        "name": "Data compression: lossless and lossy",
        "paragraphs": [
          "Data compression reduces the number of bits needed to store or transmit data. Compression is important because smaller files can save storage space, load faster, and use less network bandwidth.",
          "Lossless compression preserves all original data exactly. It is useful for text files, program files, medical records, and other data where every detail must be recoverable. A decompressed lossless file should match the original file exactly.",
          "Lossy compression permanently removes some information to achieve smaller file sizes. It is often used for photos, audio, and video because humans may not notice small losses in detail. However, repeated lossy compression can reduce quality.",
          "A simple compression idea is to replace repeated patterns with shorter descriptions. For example, instead of storing AAAAAA as six separate letters, a system might store something like 6A. Real compression methods are more complex, but the principle is similar.",
          "Exam tip: if a question says the original file can be reconstructed exactly, it is lossless. If it says some detail is discarded, it is lossy."
        ]
      },
      {
        "id": "u2-t4",
        "name": "Analog vs digital data, sampling, and precision",
        "paragraphs": [
          "Analog data changes continuously, like sound waves, temperature, light intensity, or a person's voice. Digital data represents information using discrete values, usually numbers stored as bits.",
          "Sampling converts analog information into digital data by measuring it at regular intervals. For sound, a microphone captures a changing wave and stores many numeric samples per second.",
          "Sampling rate is how often measurements are taken. A higher sampling rate can capture more detail but creates more data. Precision describes how finely each sample can represent a value, such as more possible volume levels or color levels.",
          "There is often a tradeoff between quality and file size. More samples or greater precision can improve accuracy, but it requires more storage and bandwidth.",
          "Exam tip: digital representations are approximations of analog data, and increasing sampling rate or precision usually increases file size."
        ]
      },
      {
        "id": "u2-t5",
        "name": "Extracting information from data",
        "paragraphs": [
          "Data becomes useful when it is organized and analyzed to answer a question. Raw data by itself may be too large or messy to understand, so programs can filter, sort, aggregate, and search it.",
          "Aggregation combines many data values into summaries such as totals, averages, counts, percentages, or maximums. Filtering selects only records that meet certain conditions. Sorting changes the order so patterns can become easier to see.",
          "Data analysis can reveal trends, but it can also mislead if the data is incomplete, biased, outdated, or interpreted incorrectly. AP CSP often asks about both the power and limitations of data.",
          "Real-world example: a city can analyze traffic sensor data to find busy intersections, but if some neighborhoods have fewer sensors, the conclusions may underrepresent those areas.",
          "Exam tip: strong answers mention the question being asked, the data needed, and possible limitations or bias in the data."
        ]
      },
      {
        "id": "u2-t6",
        "name": "Visualizing data",
        "paragraphs": [
          "Data visualizations use charts, graphs, maps, tables, and dashboards to help people interpret data. A good visualization makes patterns easier to notice than a long list of numbers.",
          "Different visualizations fit different goals. Line graphs show change over time, bar charts compare categories, scatter plots show relationships, and maps show geographic patterns.",
          "Visualizations can also mislead. Truncated axes, poor scales, missing labels, cherry-picked time periods, or confusing colors can distort what the data seems to show.",
          "Real-world example: a school attendance dashboard might use a line graph for attendance over time and a bar chart to compare grades. Both should include labels, units, and context.",
          "Exam tip: when interpreting a visualization, ask what is being measured, what each axis means, and whether the scale or sample could change the conclusion."
        ]
      },
      {
        "id": "u2-t7",
        "name": "Metadata, data cleaning, and data quality",
        "paragraphs": [
          "Metadata is data about data. For a photo, metadata might include time, location, device model, file size, or camera settings. Metadata can be useful for organizing files but can also reveal private information.",
          "Data cleaning means fixing or handling missing, duplicated, inconsistent, or invalid data. Examples include standardizing dates, removing duplicate records, correcting spelling inconsistencies, and deciding how to handle blank fields.",
          "Data quality affects the accuracy of conclusions. A program can process data quickly, but if the data is wrong or biased, the output may still be wrong or unfair.",
          "This connects to impact of computing because automated decisions based on poor data can harm people. It connects to programming because developers often write algorithms to validate and clean data.",
          "Exam tip: if a dataset is incomplete or biased, increasing the computer's speed does not fix the underlying data problem."
        ]
      },
      {
        "id": "u2-t8",
        "name": "Privacy and data collection",
        "paragraphs": [
          "Computing systems often collect data through forms, cookies, sensors, apps, cameras, GPS, and user interactions. This data can improve services but can also create privacy risks.",
          "Personally identifiable information, or PII, is information that can identify a specific person, such as name, address, email, student ID, location history, or combinations of details that reveal identity.",
          "Privacy protections include limiting collection, asking for consent, anonymizing or de-identifying data, encrypting sensitive data, using access controls, and deleting data when it is no longer needed.",
          "However, anonymized data can sometimes be re-identified when combined with other datasets. For example, location patterns can reveal a person even if their name is removed.",
          "Exam tip: privacy questions often ask for both a benefit and a risk. Mention who collects the data, what is collected, how it is used, and what harm could happen."
        ]
      },
      {
        "id": "u2-t9",
        "name": "Big data, machine learning, and bias",
        "paragraphs": [
          "Large datasets can help organizations discover patterns that would be difficult to see manually. Examples include recommendation systems, fraud detection, health research, language translation, and traffic prediction.",
          "Machine learning systems use data to make predictions or classifications. Their quality depends heavily on training data, selected features, and evaluation methods.",
          "Bias can enter through incomplete data, historical inequality, measurement choices, or labels created by humans. A system may appear objective because it uses math, but it can still produce unfair results.",
          "Real-world example: a tutoring recommendation system trained only on students from one school may not work well for students from different schools with different schedules, languages, or resources.",
          "Exam tip: when asked about data-driven decisions, include both possible insight and possible limitation, especially bias, privacy, and missing data."
        ]
      }
    ]
  },
  {
    "id": 3,
    "name": "Algorithms and Programming",
    "color": "purple",
    "overview": "Algorithms and Programming is the core coding unit. It covers AP CSP pseudocode, variables, conditionals, Booleans, loops, lists, procedures, abstraction, algorithm efficiency, simulations, and limits of computation.",
    "topics": [
      {
        "id": "u3-t1",
        "name": "AP CSP pseudocode and tracing",
        "paragraphs": [
          "AP CSP uses reference-sheet pseudocode rather than one programming language. You should recognize assignment with \u2190, output with DISPLAY, input with INPUT, arithmetic operators, MOD, RANDOM, conditionals, loops, lists, procedures, and robot commands.",
          "Tracing means following code line by line and keeping track of variable values. A trace table is one of the best ways to solve AP CSP code questions, especially when loops or lists are involved.",
          "Remember that AP CSP list indexes start at 1, not 0. If a list is [20, 40, 60], then aList[1] is 20 and aList[3] is 60. An index less than 1 or greater than the length of the list produces an error.",
          "When tracing procedures, parameters receive copies of the argument values. A RETURN statement immediately exits the procedure and sends a value back to the call.",
          "Exam tip: write down variable changes after every assignment. Do not mentally skip loop iterations unless you are absolutely sure of the pattern."
        ]
      },
      {
        "id": "u3-t2",
        "name": "Variables and assignments",
        "paragraphs": [
          "A variable is a named storage location for a value. Assignment evaluates an expression and stores a copy of the result in the variable. In AP pseudocode, assignment uses the left arrow symbol, such as score \u2190 score + 1.",
          "The right side of an assignment is evaluated before the variable is changed. If x is 5, then x \u2190 x + 2 makes x become 7. This is not an equation in algebra; it is an instruction to update a stored value.",
          "Variables help programs remember input, totals, counters, indexes, flags, names, and intermediate calculations. Good variable names make a program easier to understand.",
          "Common errors include using a variable before assigning it, accidentally overwriting a value too early, or confusing assignment with comparison. Comparison uses relational operators like =, <, or \u2265 and produces a Boolean value.",
          "Exam tip: every time you see \u2190, update your trace table immediately."
        ]
      },
      {
        "id": "u3-t3",
        "name": "Conditionals and Boolean logic",
        "paragraphs": [
          "Conditionals allow a program to choose between actions. IF runs a block only when a condition is true. IF/ELSE runs the first block when the condition is true and the second block otherwise.",
          "Boolean expressions evaluate to true or false. Relational operators compare values, while Boolean operators combine or change conditions. AND is true only when both conditions are true, OR is true when at least one condition is true, and NOT reverses true and false.",
          "Boolean logic often appears in eligibility, validation, games, filters, and user permissions. For example, a program might allow access only when age \u2265 13 AND hasPermission is true.",
          "A common mistake is using OR when AND is needed. For example, num \u2265 10 OR num \u2264 20 is almost always true for many numbers, while num \u2265 10 AND num \u2264 20 correctly checks whether num is between 10 and 20 inclusive.",
          "Exam tip: test Boolean expressions with sample values that should be accepted and rejected. This quickly reveals whether AND or OR is correct."
        ]
      },
      {
        "id": "u3-t4",
        "name": "Loops and iteration",
        "paragraphs": [
          "Iteration means repeating a block of instructions. AP CSP includes REPEAT n TIMES, which repeats a known number of times, and REPEAT UNTIL(condition), which repeats until a condition becomes true.",
          "Loops reduce repeated code. Instead of writing MOVE_FORWARD four times, a robot program can use REPEAT 4 TIMES with MOVE_FORWARD inside the loop.",
          "Loops are often used with counters and accumulators. A counter counts events, while an accumulator builds a result such as a total, product, or string. Both must usually be initialized before the loop starts.",
          "REPEAT UNTIL can be tricky because the loop continues while the condition is false and stops once it becomes true. If the condition never becomes true, the loop may run forever.",
          "Exam tip: for loop tracing, write one row per iteration showing the loop variable, condition, and important updated variables."
        ]
      },
      {
        "id": "u3-t5",
        "name": "Lists and traversals",
        "paragraphs": [
          "A list stores multiple values in order under one name. Lists allow programs to manage collections such as scores, names, temperatures, images, or tasks without creating a separate variable for every item.",
          "AP CSP list operations include creating lists, accessing aList[i], assigning to aList[i], INSERT, APPEND, REMOVE, LENGTH, and FOR EACH item IN aList. The first index is 1.",
          "A traversal processes each item in a list. Traversals can search for a value, count matching items, filter items, calculate totals, find maximums or minimums, or create a transformed list.",
          "List operations can shift indexes. INSERT at index i shifts existing values at i and later to the right. REMOVE at index i deletes that item and shifts later items left. These shifts are a frequent source of AP CSP mistakes.",
          "Exam tip: after each INSERT or REMOVE, rewrite the list before answering the next part of the question."
        ]
      },
      {
        "id": "u3-t6",
        "name": "Procedures, parameters, return values, and abstraction",
        "paragraphs": [
          "A procedure is a named group of instructions that can be called when needed. Procedures reduce repeated code and help organize a program into smaller understandable parts.",
          "Parameters allow a procedure to work with different values. For example, calculateTotal(price, taxRate) can be reused for many purchases instead of writing separate code for every price.",
          "Some procedures return a value. In AP CSP, RETURN sends control back to the calling statement and can provide a result. Once RETURN executes, the rest of the procedure does not run.",
          "Abstraction means hiding unnecessary details while preserving what matters. A procedure is an abstraction because the caller can use the procedure by name without knowing every internal step.",
          "Exam tip: to explain abstraction in a Create Task-style answer, say what the procedure does, how it uses parameters or a list, and how it reduces complexity or avoids repeated code."
        ]
      },
      {
        "id": "u3-t7",
        "name": "Algorithms and efficiency",
        "paragraphs": [
          "An algorithm is a precise sequence of steps that solves a problem or performs a task. Algorithms can be written in natural language, diagrams, pseudocode, or programming languages.",
          "Efficiency describes how much time or memory an algorithm uses, especially as input size grows. AP CSP may compare algorithms using step counts rather than formal Big-O notation.",
          "A linear search checks items one at a time. For small lists, that may be fine. For huge datasets, the number of steps can become large, so more efficient strategies may matter.",
          "Correctness matters before efficiency. A fast algorithm that gives the wrong answer is not useful. A clear solution is often better for beginners, but AP CSP expects you to recognize when two correct algorithms have different step counts.",
          "Exam tip: if the input size doubles and the number of steps roughly doubles, think linear growth. If the steps stay about the same, think constant growth."
        ]
      },
      {
        "id": "u3-t8",
        "name": "Robot movement questions",
        "paragraphs": [
          "The AP CSP reference sheet includes robot commands such as MOVE_FORWARD, ROTATE_LEFT, ROTATE_RIGHT, and CAN_MOVE(direction). Robot questions test sequencing, selection, loops, and reasoning about direction.",
          "MOVE_FORWARD moves one square forward in the direction the robot is facing. ROTATE_LEFT turns the robot 90 degrees counterclockwise, and ROTATE_RIGHT turns it 90 degrees clockwise. Turning does not move the robot to a new square.",
          "CAN_MOVE(direction) returns true if there is an open square in that relative direction. The direction is relative to where the robot is facing, so right, left, forward, and backward depend on orientation.",
          "If the robot tries to move into a blocked square or beyond the grid edge, the program terminates. Therefore, many safe robot algorithms check CAN_MOVE before MOVE_FORWARD.",
          "Exam tip: draw the robot's direction arrow after each rotation. Most mistakes happen when students move the robot without updating the direction first."
        ]
      },
      {
        "id": "u3-t9",
        "name": "Simulations and random values",
        "paragraphs": [
          "A simulation is a program that models a real or imaginary process. Simulations can help study weather, traffic, disease spread, games, ecosystems, or business decisions when real-world testing is expensive, slow, or unsafe.",
          "RANDOM(a, b) returns an integer from a through b, inclusive, with each value equally likely. Random values can make simulations more realistic by representing uncertainty or chance.",
          "Simulations depend on assumptions. A simulation can be useful even if it is simplified, but its results are only as good as its model, data, and assumptions.",
          "Real-world example: a school might simulate lunch lines to test whether adding another checkout station reduces waiting time. The simulation can help make decisions before changing the real cafeteria.",
          "Exam tip: simulations can support predictions, but they do not guarantee the real world will behave exactly the same way."
        ]
      },
      {
        "id": "u3-t10",
        "name": "Undecidable and unsolvable problems",
        "paragraphs": [
          "Some problems cannot be solved by any algorithm for all possible inputs. These are not merely difficult or slow; they are impossible to solve completely with a general algorithm.",
          "A classic example is the halting problem: there is no general algorithm that can always determine whether any given program will eventually stop or run forever for all possible inputs.",
          "This topic shows the limits of computation. Even with faster computers, more memory, and better programming languages, some problems remain undecidable.",
          "This connects to impact because people sometimes assume computers can solve everything. AP CSP expects students to understand that computing has both powerful abilities and formal limits.",
          "Exam tip: do not confuse undecidable with inefficient. Inefficient means an algorithm exists but may take too long; undecidable means no general algorithm can solve all cases."
        ]
      }
    ]
  },
  {
    "id": 4,
    "name": "Computer Systems and Networks",
    "color": "amber",
    "overview": "Computer Systems and Networks explains how devices, hardware, operating systems, networks, and internet protocols work together. It connects everyday web use to IP addresses, DNS, packets, routing, TCP/IP, redundancy, cybersecurity, and distributed computing.",
    "topics": [
      {
        "id": "u4-t1",
        "name": "Computing devices and hardware",
        "paragraphs": [
          "A computing device is any machine that can run a program, such as a phone, laptop, tablet, server, smartwatch, or embedded device. Hardware includes physical components like CPU, memory, storage, sensors, screens, and network cards.",
          "The CPU executes instructions, memory temporarily stores data and programs while they run, and storage keeps data long term. Input devices collect data, and output devices present results.",
          "Modern systems often combine many devices. A phone app may use local sensors, cloud servers, databases, and networks all at once.",
          "This connects to data because hardware stores and transmits bits. It connects to programming because program performance can depend on memory, processing power, and network conditions.",
          "Exam tip: hardware is physical, software is programs and data, and a system is the combination of components working together."
        ]
      },
      {
        "id": "u4-t2",
        "name": "How the internet works",
        "paragraphs": [
          "The internet is a network of networks. It connects many independently managed networks using shared protocols so devices can exchange data even if they are owned by different organizations.",
          "Data sent over the internet is often divided into packets. Packets can travel through different routes and be reassembled at the destination. This makes communication flexible and fault tolerant.",
          "The internet is decentralized. There is no single central computer that controls every message. This design helps it scale and continue working when some parts fail.",
          "Real-world example: when you load a study website, your device sends requests through multiple networks and routers before receiving page files from a server.",
          "Exam tip: the internet and the World Wide Web are not identical. The web is one service that runs on the internet."
        ]
      },
      {
        "id": "u4-t3",
        "name": "IP addresses and DNS",
        "paragraphs": [
          "An IP address identifies a device or destination on a network so data can be routed. IP is responsible for addressing and helping packets move toward the correct destination.",
          "DNS, the Domain Name System, translates human-readable domain names into IP addresses. Humans remember names like example.com more easily than numeric addresses.",
          "DNS is distributed, meaning many DNS servers work together. This improves scale and reliability compared with one single directory for the whole internet.",
          "If DNS fails, a website may not be reachable by name even if the server still exists. This shows how different internet services depend on each other.",
          "Exam tip: DNS does not store the website itself; it helps find the IP address associated with a domain name."
        ]
      },
      {
        "id": "u4-t4",
        "name": "TCP/IP, packets, and protocols",
        "paragraphs": [
          "A protocol is an agreed-upon set of rules for communication. Protocols define how data is formatted, addressed, transmitted, received, checked, and interpreted.",
          "IP handles addressing and routing packets. TCP helps ensure reliable delivery by tracking packets, detecting missing data, and reassembling information in the correct order. UDP is another protocol that can be faster but does not provide the same reliability guarantees.",
          "Packets contain data plus control information, such as source and destination addresses. Breaking data into packets allows large messages to travel through networks more flexibly.",
          "Protocols support interoperability. Devices made by different companies can communicate because they follow the same rules.",
          "Exam tip: when a question mentions standards, shared rules, or devices working together, it is usually about protocols."
        ]
      },
      {
        "id": "u4-t5",
        "name": "Fault tolerance and redundancy",
        "paragraphs": [
          "Fault tolerance is the ability of a system to keep working when part of it fails. Redundancy means having extra components, paths, or copies that can be used if the main one fails.",
          "The internet supports fault tolerance because packets can often take alternate routes when a path or router is unavailable. This does not mean the internet never fails, but it makes total failure less likely.",
          "Redundancy can appear as backup servers, duplicate databases, multiple network paths, or replicated files. It can increase reliability but may cost more and require synchronization.",
          "Real-world example: a streaming service might store videos in multiple data centers so users can still watch if one server becomes unavailable.",
          "Exam tip: fault tolerance is about continuing service after failure, not preventing every failure from ever happening."
        ]
      },
      {
        "id": "u4-t6",
        "name": "Bandwidth, latency, and network performance",
        "paragraphs": [
          "Bandwidth is the amount of data that can be transmitted in a given amount of time. Higher bandwidth can allow more data to move at once, which is useful for video, large downloads, or many users.",
          "Latency is the delay before data starts arriving or before a response is received. A connection can have high bandwidth but still feel slow if latency is high.",
          "Network performance can be affected by distance, congestion, router failures, wireless interference, server load, and the size of the data being transmitted.",
          "Compression can improve performance by reducing file size, while caching can reduce repeated network requests by storing copies closer to the user.",
          "Exam tip: bandwidth is capacity; latency is delay. They are related to performance but are not the same thing."
        ]
      },
      {
        "id": "u4-t7",
        "name": "Parallel and distributed computing",
        "paragraphs": [
          "Parallel computing uses multiple processors or cores to work on parts of a problem at the same time. Distributed computing uses multiple networked computers to work together on a task.",
          "Some problems can be split into independent parts, making them good candidates for parallelization. Other problems depend heavily on earlier results and are harder to parallelize.",
          "Speedup is not always perfect. Coordinating tasks, moving data, and combining results can reduce the benefit of using more processors.",
          "Real-world examples include video rendering, scientific simulations, search indexing, cloud services, and large-scale data processing.",
          "Exam tip: adding more processors can help only if the task can be divided and coordinated efficiently."
        ]
      },
      {
        "id": "u4-t8",
        "name": "Cybersecurity foundations",
        "paragraphs": [
          "Cybersecurity protects systems, networks, and data from unauthorized access, damage, disruption, or theft. It matters for individuals, schools, companies, governments, and public infrastructure.",
          "Common protections include strong passwords, multifactor authentication, software updates, encryption, backups, access controls, firewalls, and user training.",
          "Encryption transforms data so unauthorized people cannot easily read it. It can protect data stored on a device and data transmitted over a network.",
          "Security is not only technical. Social engineering attacks manipulate people into revealing information or taking unsafe actions.",
          "Exam tip: no single security measure solves everything. Strong answers often combine technical protections with user awareness and policies."
        ]
      }
    ]
  },
  {
    "id": 5,
    "name": "Impact of Computing",
    "color": "coral",
    "overview": "Impact of Computing focuses on how computing changes society. It asks students to analyze benefits, harms, privacy, cybersecurity, legal issues, intellectual property, access, bias, crowdsourcing, and ethical responsibilities.",
    "topics": [
      {
        "id": "u5-t1",
        "name": "Beneficial and harmful effects of computing",
        "paragraphs": [
          "Computing can create benefits such as faster communication, improved healthcare, personalized learning, safer transportation, scientific discovery, and access to information. AP CSP expects you to describe concrete benefits, not just say technology is helpful.",
          "Computing can also cause harms such as privacy loss, misinformation, addiction, job displacement, biased decisions, cyberattacks, environmental costs, and unequal access. The same technology can help one group while harming another.",
          "A complete impact answer identifies the computing innovation, the affected group, the beneficial effect, and the harmful effect. Specificity matters.",
          "Real-world example: telehealth can help patients reach doctors remotely, but it may exclude people without reliable internet or private spaces for appointments.",
          "Exam tip: avoid vague answers like 'it makes life easier.' Name who benefits, how they benefit, who may be harmed, and why."
        ]
      },
      {
        "id": "u5-t2",
        "name": "The digital divide",
        "paragraphs": [
          "The digital divide is the gap between people who have access to computing resources and people who do not. Access includes devices, internet connectivity, affordability, digital literacy, language support, and accessibility.",
          "The divide can affect education, jobs, healthcare, government services, banking, and civic participation. When important services move online, lack of access can become a serious disadvantage.",
          "Closing the digital divide may involve low-cost broadband, school device programs, public Wi-Fi, accessible design, training, multilingual support, and community technology centers.",
          "This connects to creative development because designers should consider users with limited devices or slow connections. It connects to data because underrepresented groups may be missing from datasets.",
          "Exam tip: digital divide questions are not only about having a computer. Think about quality of access and ability to use the technology effectively."
        ]
      },
      {
        "id": "u5-t3",
        "name": "Intellectual property, copyright, and licensing",
        "paragraphs": [
          "Intellectual property refers to creations such as code, writing, images, music, videos, designs, and inventions. Copyright protects many creative works automatically when they are created.",
          "Licenses explain how others may use a work. Some licenses allow reuse with attribution, some allow modification, some restrict commercial use, and some reserve most rights.",
          "Open-source software makes source code available under a license. Open source does not mean there are no rules; users still must follow the license terms.",
          "Creative Commons licenses are often used for images, videos, and educational content. Public domain works can generally be used freely, but students should still verify the source.",
          "Exam tip: when reusing code, images, or media, check the license, give attribution when required, and avoid claiming someone else's work as your own."
        ]
      },
      {
        "id": "u5-t4",
        "name": "Privacy, security, and personal data",
        "paragraphs": [
          "Privacy is about controlling access to personal information. Security is about protecting systems and data from unauthorized actions. They overlap, but they are not identical.",
          "Apps may collect names, locations, contacts, messages, browsing behavior, biometrics, or purchase histories. Even data that seems harmless can become sensitive when combined with other data.",
          "Privacy practices include data minimization, user consent, clear settings, anonymization, encryption, access controls, and deletion policies. However, users may not fully understand long privacy policies.",
          "Real-world example: a fitness app can help track health goals, but location and heart-rate data could reveal sensitive routines or medical details if shared or breached.",
          "Exam tip: privacy risks often involve collection, storage, sharing, re-identification, and lack of user control."
        ]
      },
      {
        "id": "u5-t5",
        "name": "Cybersecurity threats",
        "paragraphs": [
          "Cybersecurity threats include phishing, malware, ransomware, viruses, denial-of-service attacks, password attacks, data breaches, and social engineering.",
          "Phishing tricks users into revealing information or clicking unsafe links. Ransomware locks or encrypts data until payment is demanded. Malware is software designed to cause harm or gain unauthorized access.",
          "Denial-of-service attacks attempt to overwhelm a system so legitimate users cannot access it. Strong infrastructure and filtering can reduce the impact, but no defense is perfect.",
          "Users can reduce risk by using strong unique passwords, multifactor authentication, updates, backups, cautious link behavior, and trusted networks.",
          "Exam tip: social engineering attacks exploit human behavior, not just technical weaknesses."
        ]
      },
      {
        "id": "u5-t6",
        "name": "Legal and ethical concerns",
        "paragraphs": [
          "Legal concerns involve laws and rules, while ethical concerns involve what is responsible, fair, and respectful even when the law is unclear. Computing often creates situations where both matter.",
          "Ethical issues include bias in algorithms, informed consent, surveillance, accessibility, misinformation, manipulation, and responsible data use. Developers should think about consequences before and after release.",
          "A legal action can still be ethically questionable, and an ethical action may require more care than the minimum legal requirement. For example, collecting extra data may be legal but unnecessary and risky.",
          "This topic connects to every AP CSP unit because design, data, algorithms, networks, and security choices can all affect real people.",
          "Exam tip: strong ethical answers identify stakeholders, benefits, harms, tradeoffs, and a responsible action."
        ]
      },
      {
        "id": "u5-t7",
        "name": "Bias, fairness, and algorithmic decision-making",
        "paragraphs": [
          "Algorithms can affect decisions about education, hiring, loans, healthcare, policing, search results, and recommendations. These decisions can be helpful, but they can also amplify bias.",
          "Bias can come from training data, features chosen by developers, historical inequality, measurement errors, or feedback loops. A model trained on biased data may produce biased predictions.",
          "Fairness requires evaluating outcomes for different groups, checking data quality, testing for harmful patterns, and giving people ways to appeal or understand decisions.",
          "Real-world example: a scholarship recommendation system may disadvantage students if the training data mostly represents applicants from schools with more resources.",
          "Exam tip: saying 'the computer is neutral' is usually weak. Computers follow human-created data, rules, and objectives."
        ]
      },
      {
        "id": "u5-t8",
        "name": "Crowdsourcing, citizen science, and open access",
        "paragraphs": [
          "Crowdsourcing uses contributions from many people to solve problems, gather data, classify information, or create content. Citizen science uses public participation to support scientific research.",
          "Examples include mapping disaster damage, classifying galaxies, reporting road hazards, translating resources, and contributing to open-source projects.",
          "Crowdsourcing can scale quickly and include diverse perspectives, but it can also create quality-control problems, misinformation, privacy risks, or uneven participation.",
          "Open access makes information or tools more widely available. It can support education and innovation, but creators and organizations still need sustainable ways to fund and maintain resources.",
          "Exam tip: crowdsourcing questions usually expect both a benefit, such as scale, and a challenge, such as accuracy or coordination."
        ]
      },
      {
        "id": "u5-t9",
        "name": "Responsible use of AI and automation",
        "paragraphs": [
          "AI and automation can help with tutoring, translation, accessibility, medical analysis, coding support, fraud detection, and productivity. They can also produce errors, hallucinations, bias, privacy risks, and overreliance.",
          "Responsible AI use means checking outputs, protecting personal data, understanding limitations, and being honest about assistance. For student work, it is important to follow class and exam rules.",
          "Automation can replace repetitive tasks, but it can also change jobs and require people to learn new skills. The impact depends on the context and who has access to the benefits.",
          "This connects to AP CSP because AI systems use data, algorithms, computing power, networks, and human design choices. They are not magic; they are computing systems with strengths and limits.",
          "Exam tip: when discussing AI, include a specific benefit, a specific harm, and a responsible way to reduce risk."
        ]
      }
    ]
  }
];
