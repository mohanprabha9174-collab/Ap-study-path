export const csaUnits = [
  {
    id: 1,
    name: "Using Objects and Methods",
    color: "blue",
    overview: "The building blocks of Java: primitive types, expressions, casting, Strings, the Math class, and calling methods on objects. About 15-25% of the exam.",
    topics: [
      {
        id: "csa-u1-t1",
        name: "Primitive types, expressions, and casting",
        paragraphs: [
          "The AP subset uses three primitive types: int (whole numbers), double (decimals), and boolean (true/false). Arithmetic follows normal precedence: *, /, % happen before + and -, left to right.",
          "Integer division truncates: 7 / 2 is 3, not 3.5. If either operand is a double, the result is a double: 7 / 2.0 is 3.5. The remainder operator % gives what is left over: 17 % 5 is 2, and n % 2 == 0 tests for even numbers.",
          "Casting converts types. (int) 7.9 is 7 because casting truncates toward zero; it never rounds. (double) 7 / 2 is 3.5 because the cast happens before the division. To round a positive double, use (int) (x + 0.5).",
          "Compound assignment operators (+=, -=, *=, /=, %=) and ++/-- change a variable in place. An int has a maximum of Integer.MAX_VALUE; going past it overflows to a negative number."
        ]
      },
      {
        id: "csa-u1-t2",
        name: "Objects, references, and null",
        paragraphs: [
          "A class is a blueprint; an object is an instance created with new. A variable of a class type stores a reference to the object, not the object itself.",
          "Assigning one reference variable to another (b = a) makes both names point to the same object. This is called aliasing, and changing the object through one name is visible through the other.",
          "A reference that points to no object is null. Calling a method on null throws a NullPointerException. Arrays of objects start full of null."
        ]
      },
      {
        id: "csa-u1-t3",
        name: "String methods",
        paragraphs: [
          "Strings are immutable: methods return new Strings and never change the original. s.toUpperCase() alone does nothing useful; you must store the result.",
          "Key methods from the Java Quick Reference: length(), substring(from, to) (to is exclusive), substring(from), indexOf(str) (returns -1 if not found), equals(other), and compareTo(other) (negative if the caller comes first alphabetically).",
          "Use equals, not ==, to compare String contents. == compares references and can be false even when the text matches.",
          "Concatenation with + works left to right: 1 + 2 + \"x\" is \"3x\", but \"x\" + 1 + 2 is \"x12\"."
        ]
      },
      {
        id: "csa-u1-t4",
        name: "Math class and calling methods",
        paragraphs: [
          "Math.abs, Math.pow, Math.sqrt, and Math.random are static methods called on the class. Math.pow and Math.sqrt always return doubles.",
          "Math.random() returns a double from 0.0 up to but not including 1.0. A random int from low to high inclusive is (int) (Math.random() * (high - low + 1)) + low.",
          "When you call a method, arguments are matched to parameters by position and type. A void method does not return a value; a non-void method's return value should be used or stored."
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Selection and Iteration",
    color: "teal",
    overview: "Boolean logic, if/else, while and for loops, nested loops, and standard String and number algorithms. About 25-35% of the exam.",
    topics: [
      {
        id: "csa-u2-t1",
        name: "Boolean expressions and De Morgan's Laws",
        paragraphs: [
          "Relational operators (<, <=, >, >=, ==, !=) produce booleans. Logical operators combine them: && (and), || (or), ! (not).",
          "Java short-circuits: in A && B, if A is false, B is never evaluated; in A || B, if A is true, B is skipped. This is how x != 0 && 10 / x > 1 avoids division by zero.",
          "De Morgan's Laws: !(A && B) equals !A || !B, and !(A || B) equals !A && !B. Remember to flip each comparison too: !(x < 5) is x >= 5.",
          "Use a truth table when a question asks whether two expressions are equivalent. Try a case where they might differ."
        ]
      },
      {
        id: "csa-u2-t2",
        name: "if, else if, else",
        paragraphs: [
          "In an if / else if / else chain, only the first true branch runs. Order matters: put the most specific condition first.",
          "Without braces, an if controls only the next statement, and an else attaches to the nearest unmatched if (the dangling else). Always trace indentation carefully because the compiler ignores it."
        ]
      },
      {
        id: "csa-u2-t3",
        name: "while and for loops",
        paragraphs: [
          "A for loop has three parts: initialization, condition, and update. Count iterations with (last - first) / step + 1 when the values line up exactly.",
          "A while loop repeats while its condition is true; make sure something in the body moves toward ending the loop. Skipping over the stop value (i != 0 with i -= 3 from 10) creates an infinite loop.",
          "Off-by-one errors are the most common bug: check whether the bound should be < or <=, and whether the last index is length - 1."
        ]
      },
      {
        id: "csa-u2-t4",
        name: "Standard algorithms",
        paragraphs: [
          "Digit processing: n % 10 gets the last digit and n /= 10 removes it, inside while (n > 0).",
          "String traversal: for (int i = 0; i < s.length(); i++) with s.substring(i, i + 1). When comparing a character with the next one, stop at s.length() - 1.",
          "Accumulators (sum, count), min/max tracking, reversing a String, and checking a property of every element are the patterns most FRQ 1 questions test.",
          "Nested loops: the inner loop runs completely for each iteration of the outer loop. If the inner bound depends on the outer variable, add up the counts per row."
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Class Creation",
    color: "purple",
    overview: "Writing your own classes: instance variables, constructors, methods, encapsulation, static members, this, and scope. About 10-18% of the exam, and all of FRQ 2.",
    topics: [
      {
        id: "csa-u3-t1",
        name: "Anatomy of a class",
        paragraphs: [
          "A class has private instance variables (the object's state), constructors (which initialize the state), and methods (behavior). Constructors have the class name and no return type.",
          "If you write any constructor, Java no longer provides the default no-argument constructor. Overloaded constructors have different parameter lists.",
          "Accessor methods (getters) return state; mutator methods (setters or actions like deposit) change it. A toString method returns a String description and is called automatically by println."
        ]
      },
      {
        id: "csa-u3-t2",
        name: "Encapsulation and this",
        paragraphs: [
          "Instance variables should be private so that only the class's methods can change them, which lets the class enforce rules (like never letting a balance go negative).",
          "When a parameter has the same name as an instance variable, the parameter shadows it. Use this.name = name to set the instance variable."
        ]
      },
      {
        id: "csa-u3-t3",
        name: "static variables and methods",
        paragraphs: [
          "A static variable belongs to the class and is shared by all objects, which is useful for counters like 'number of tickets created'.",
          "A static method has no this object, so it cannot directly use instance variables or call instance methods. Call static methods on the class name, like Math.sqrt."
        ]
      },
      {
        id: "csa-u3-t4",
        name: "Parameters, return values, and scope",
        paragraphs: [
          "Java passes arguments by value. For primitives, the method gets a copy, so changing the parameter does not change the caller's variable. For objects, the method gets a copy of the reference: it can change the object's state, but reassigning the parameter does not affect the caller.",
          "A non-void method must return a value on every possible path, or it will not compile.",
          "A local variable exists only inside the block where it is declared. Loop variables declared in a for header disappear after the loop."
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Data Collections",
    color: "amber",
    overview: "Arrays, ArrayList, 2D arrays, text files and datasets, searching, sorting, and recursion. The biggest unit at about 30-40% of the exam, and the focus of FRQs 3 and 4.",
    topics: [
      {
        id: "csa-u4-t1",
        name: "Arrays",
        paragraphs: [
          "Arrays have a fixed length (arr.length, no parentheses). Indexes run from 0 to length - 1; anything else throws ArrayIndexOutOfBoundsException.",
          "New arrays are filled with defaults: 0 for int, 0.0 for double, false for boolean, null for objects.",
          "The enhanced for loop (for (int v : arr)) gives a copy of each element, so it cannot change primitive elements in the array. Use an indexed loop to modify elements."
        ]
      },
      {
        id: "csa-u4-t2",
        name: "ArrayList",
        paragraphs: [
          "ArrayList<E> grows and shrinks. Key methods: size(), add(obj), add(index, obj), get(index), set(index, obj) (returns the old value), and remove(index) (returns the removed element).",
          "add(index, obj) and remove(index) shift later elements. When removing in a forward loop, the next element slides into the current index and gets skipped. Traverse backward instead.",
          "Never add or remove inside an enhanced for loop over the same list; it throws ConcurrentModificationException. ArrayLists store objects, so ints are stored as Integer automatically (autoboxing)."
        ]
      },
      {
        id: "csa-u4-t3",
        name: "2D arrays",
        paragraphs: [
          "A 2D array is an array of rows. grid.length is the number of rows and grid[0].length is the number of columns. Access with grid[row][col].",
          "Row-major traversal uses the row loop outside and the column loop inside. Column-major traversal swaps them. For a single column, loop over rows and use a fixed column index.",
          "Neighbor checks must test bounds first (r > 0 && grid[r - 1][c] ...) so short-circuiting prevents out-of-bounds access."
        ]
      },
      {
        id: "csa-u4-t4",
        name: "Text files and datasets",
        paragraphs: [
          "The revised course includes reading data from text files with Scanner and File. A typical loop is while (input.hasNext()) or while (input.hasNextInt()) reading one value at a time with next(), nextInt(), nextDouble(), or nextLine().",
          "Data analysis means filtering, counting, averaging, and finding extremes across a dataset, often stored in an ArrayList of objects."
        ]
      },
      {
        id: "csa-u4-t5",
        name: "Searching, sorting, and recursion",
        paragraphs: [
          "Linear search checks each element in order and works on any list. Binary search repeatedly checks the middle of a sorted list and discards half each time, taking about log2(n) steps.",
          "Selection sort repeatedly swaps the smallest remaining element into place. Insertion sort inserts each element into the sorted part on its left. Merge sort splits in half recursively and merges sorted halves.",
          "A recursive method calls itself and must have a base case that stops the recursion. Trace recursion by writing each call on its own line and returning values back up."
        ]
      }
    ]
  }
];
