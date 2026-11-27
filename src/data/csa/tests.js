// AP Computer Science A practice exams, aligned to the 2025-26 four-unit course.
// Each question: { id, unit, question, code?, choices, correctAnswer (index), explanation }

export const csaUnitMeta = [
  { id: 1, name: "Using Objects and Methods", color: "blue" },
  { id: 2, name: "Selection and Iteration", color: "teal" },
  { id: 3, name: "Class Creation", color: "purple" },
  { id: 4, name: "Data Collections", color: "amber" }
];

const q = (id, unit, question, code, choices, correctAnswer, explanation) => ({
  id, unit, question, code: code || undefined, choices, correctAnswer, explanation
});

const test1 = [
  q("A1-01", 1, "What is printed by the following code segment?", `int a = 17;
int b = 5;
double c = a / b + a % b;
System.out.println(c);`, ["5.0", "5.4", "3.4", "5"], 0,
    "a / b is integer division, so 17 / 5 is 3. a % b is 2. 3 + 2 = 5, which is stored in a double and printed as 5.0."),
  q("A1-02", 1, "What is printed by the following code segment?", `String s = "computer";
System.out.println(s.substring(2, 5) + s.indexOf("t"));`, ["mpu5", "mput5", "mpu4", "omp5"], 0,
    "substring(2, 5) returns the characters at indexes 2, 3, 4: \"mpu\". The first \"t\" is at index 5 (c=0, o=1, m=2, p=3, u=4, t=5)."),
  q("A1-03", 1, "What is the value of x after the code segment executes?", `double d = 7.8;
int x = (int) d + (int) (d * 2);`, ["22", "23", "24", "15"], 0,
    "(int) 7.8 truncates to 7. d * 2 is 15.6, which truncates to 15. 7 + 15 = 22. Casting truncates; it never rounds."),
  q("A1-04", 1, "Which expression produces a random integer from 5 to 12, inclusive?", null,
    ["(int) (Math.random() * 8) + 5", "(int) (Math.random() * 7) + 5", "(int) (Math.random() * 12) + 5", "(int) (Math.random() * 8) + 4"], 0,
    "There are 12 - 5 + 1 = 8 possible values. Math.random() * 8 gives 0.0 up to (not including) 8.0; casting gives 0-7; adding 5 shifts the range to 5-12."),
  q("A1-05", 1, "What is printed by the following code segment?", `String s = "hi";
s.toUpperCase();
System.out.println(s + s.length());`, ["hi2", "HI2", "hi3", "HI"], 0,
    "Strings are immutable. toUpperCase() returns a new String, but the result is never stored, so s is still \"hi\"."),
  q("A1-06", 1, "What is printed?", `System.out.println(Math.abs(-4) + Math.pow(2, 3) + Math.sqrt(16));`, ["16.0", "16", "14.0", "12.0"], 0,
    "Math.abs(-4) is the int 4; Math.pow and Math.sqrt return doubles (8.0 and 4.0). The sum is the double 16.0."),
  q("A1-07", 1, "Which statement about the expression \"apple\".compareTo(\"banana\") is true?", null,
    ["It returns a negative integer.", "It returns 0.", "It returns a positive integer.", "It returns false."], 0,
    "compareTo returns a negative value when the calling string comes first alphabetically. \"apple\" comes before \"banana\"."),
  q("A1-08", 1, "What is printed by the following code segment?", `String a = new String("cat");
String b = new String("cat");
System.out.println((a == b) + " " + a.equals(b));`, ["false true", "true true", "true false", "false false"], 0,
    "== compares references; two separately constructed objects are different references, so it is false. equals compares the characters, so it is true."),

  q("A1-09", 2, "What is printed by the following code segment?", `int x = 7;
if (x > 5 && x % 2 == 0) {
  System.out.println("A");
} else if (x > 5 || x < 0) {
  System.out.println("B");
} else {
  System.out.println("C");
}`, ["B", "A", "C", "Nothing is printed"], 0,
    "x % 2 == 0 is false for 7, so the first condition fails. x > 5 is true, so the || condition is true and \"B\" prints."),
  q("A1-10", 2, "Which expression is equivalent to !(a && b) for all boolean values a and b?", null,
    ["!a || !b", "!a && !b", "a || b", "!a && b"], 0,
    "De Morgan's Law: the negation of an AND becomes an OR of the negations."),
  q("A1-11", 2, "How many times does the loop body execute?", `for (int i = 3; i < 20; i += 4) {
  System.out.print(i + " ");
}`, ["5", "4", "6", "17"], 0,
    "i takes the values 3, 7, 11, 15, 19. The next value, 23, fails i < 20. That is 5 iterations."),
  q("A1-12", 2, "What is printed by the following code segment?", `int n = 37;
int count = 0;
while (n > 0) {
  n /= 2;
  count++;
}
System.out.println(count);`, ["6", "5", "18", "7"], 0,
    "n goes 37 → 18 → 9 → 4 → 2 → 1 → 0. That is 6 divisions, so count is 6."),
  q("A1-13", 2, "How many asterisks are printed?", `for (int i = 1; i <= 3; i++) {
  for (int j = i; j <= 3; j++) {
    System.out.print("*");
  }
}`, ["6", "9", "3", "4"], 0,
    "When i = 1, j runs 1-3 (3 stars); i = 2, j runs 2-3 (2 stars); i = 3, j runs 3 (1 star). 3 + 2 + 1 = 6."),
  q("A1-14", 2, "What is printed when s is \"stack\"?", `String r = "";
for (int i = s.length() - 1; i >= 0; i--) {
  r += s.substring(i, i + 1);
}
System.out.println(r);`, ["kcats", "stack", "kcat", "tack"], 0,
    "The loop visits characters from the last index down to 0 and appends each one, which reverses the string."),
  q("A1-15", 2, "What happens when the code segment executes?", `int x = 0;
if (x != 0 && 10 / x > 1) {
  System.out.println("big");
} else {
  System.out.println("safe");
}`, ["\"safe\" is printed.", "\"big\" is printed.", "An ArithmeticException is thrown.", "The code does not compile."], 0,
    "&& short-circuits: x != 0 is false, so 10 / x is never evaluated and no division by zero occurs."),
  q("A1-16", 2, "What is the value of sum after the loop?", `int sum = 0;
for (int k = 1; k <= 10; k++) {
  if (k % 3 != 0) {
    sum += k;
  }
}`, ["37", "55", "18", "40"], 0,
    "1 + 2 + ... + 10 = 55. The multiples of 3 (3 + 6 + 9 = 18) are skipped. 55 - 18 = 37."),
  q("A1-17", 2, "What is printed when word is \"programming\"?", `int count = 0;
for (int i = 0; i < word.length(); i++) {
  String ch = word.substring(i, i + 1);
  if ("aeiou".indexOf(ch) != -1) {
    count++;
  }
}
System.out.println(count);`, ["3", "4", "2", "11"], 0,
    "indexOf returns -1 when ch is not a vowel. \"programming\" contains the vowels o, a, i: 3 vowels."),
  q("A1-18", 2, "What is the result of executing this code segment?", `int i = 10;
while (i != 0) {
  i -= 3;
}
System.out.println(i);`, ["The loop never terminates.", "0 is printed.", "1 is printed.", "-2 is printed."], 0,
    "i goes 10, 7, 4, 1, -2, -5, ... and skips over 0, so i != 0 is always true: an infinite loop. Use i > 0 to avoid this."),
  q("A1-19", 2, "Which expression is equivalent to !(x < 5 || y >= 3)?", null,
    ["x >= 5 && y < 3", "x >= 5 || y < 3", "x > 5 && y < 3", "x < 5 && y >= 3"], 0,
    "De Morgan: !(A || B) is !A && !B. !(x < 5) is x >= 5 and !(y >= 3) is y < 3."),
  q("A1-20", 2, "What is printed by the code segment?", `int num = 4072;
int total = 0;
while (num > 0) {
  total += num % 10;
  num /= 10;
}
System.out.println(total);`, ["13", "4072", "11", "9"], 0,
    "num % 10 extracts the last digit and num /= 10 removes it. The digits 2, 7, 0, 4 add up to 13."),

  q("A1-21", 3, "Consider the class below. What is returned by new Point(5).getX()?", `public class Point {
  private int x;

  public Point(int x) {
    x = x;
  }

  public int getX() {
    return x;
  }
}`, ["0", "5", "null", "The code does not compile."], 0,
    "Inside the constructor, x refers to the parameter, so x = x assigns the parameter to itself. The instance variable keeps its default value 0. Use this.x = x."),
  q("A1-22", 3, "Why are instance variables usually declared private?", null,
    ["So the class controls how its data is accessed and changed, through methods", "So the variables use less memory", "So the variables can be accessed by any class", "So the variables can never change"], 0,
    "Encapsulation: private data can only be read or changed through the class's own methods, which can validate changes."),
  q("A1-23", 3, "Three Ticket objects t1, t2, t3 are created in that order. What does t2.getId() + \" \" + Ticket.getCount() evaluate to?", `public class Ticket {
  private static int count = 0;
  private int id;

  public Ticket() {
    count++;
    id = count;
  }

  public int getId() { return id; }
  public static int getCount() { return count; }
}`, ["\"2 3\"", "\"3 3\"", "\"2 2\"", "\"1 3\""], 0,
    "count is static, so all objects share it. t2 was the second object created, so its id is 2. After three objects, count is 3."),
  q("A1-24", 3, "Which constructor correctly initializes the instance variable name?", `public class Pet {
  private String name;
  // constructor goes here
}`, ["public Pet(String name) { this.name = name; }", "public void Pet(String name) { this.name = name; }", "public Pet(String name) { name = this.name; }", "public Pet(String n) { String name = n; }"], 0,
    "Constructors have no return type, and this.name refers to the instance variable. Writing name = this.name copies the wrong way, and String name = n declares a new local variable instead."),
  q("A1-25", 3, "Which method header is correct for a public method named check that takes an int and a String and returns true or false?", null,
    ["public boolean check(int n, String s)", "public void check(int n, String s)", "public check boolean(int n, String s)", "public boolean check(n, s)"], 0,
    "A header lists access, return type, name, and typed parameters."),
  q("A1-26", 3, "Counter has a value that starts at 0 and an increment() method that adds 1. What is printed?", `public static void change(Counter c) {
  c.increment();
  c = new Counter();
  c.increment();
}

// in main
Counter k = new Counter();
change(k);
System.out.println(k.getValue());`, ["1", "0", "2", "The code does not compile."], 0,
    "c starts as a copy of the reference to k's object, so the first increment changes k's object. Then c is pointed at a new object, which does not affect k."),
  q("A1-27", 3, "What is printed?", `public static void bump(int n) {
  n++;
}

// in main
int a = 5;
bump(a);
System.out.println(a);`, ["5", "6", "0", "The code does not compile."], 0,
    "Primitive arguments are passed by value: bump changes only its own copy."),
  q("A1-28", 3, "A Student class has a toString method that returns name + \":\" + age. For a Student with name \"Kai\" and age 16, what does System.out.println(s) print?", null,
    ["Kai:16", "Student@1b6d3586", "s", "Kai 16"], 0,
    "println calls the object's toString method automatically."),
  q("A1-29", 3, "Why does this code segment fail to compile?", `for (int i = 0; i < 5; i++) {
  int total = i * 2;
}
System.out.println(total);`, ["total is declared inside the loop, so it is out of scope after the loop", "i is not initialized", "println cannot print an int", "The loop condition must use <="], 0,
    "A local variable's scope is the block where it is declared. total does not exist after the closing brace."),

  q("A1-30", 4, "What is the value of m after the code executes?", `int[] arr = {4, 9, 2, 7, 5};
int m = arr[0];
for (int i = 1; i < arr.length; i++) {
  if (arr[i] < m) {
    m = arr[i];
  }
}`, ["2", "4", "9", "5"], 0,
    "This is the standard minimum algorithm: m is replaced whenever a smaller element is found."),
  q("A1-31", 4, "What happens when this code runs with arr = {1, 2, 3}?", `int sum = 0;
for (int i = 0; i <= arr.length; i++) {
  sum += arr[i];
}`, ["An ArrayIndexOutOfBoundsException is thrown.", "sum is 6.", "sum is 3.", "The code does not compile."], 0,
    "Valid indexes are 0 to arr.length - 1. When i equals 3, arr[3] is out of bounds."),
  q("A1-32", 4, "What is printed?", `int[] arr = {1, 2, 3};
for (int v : arr) {
  v *= 2;
}
System.out.println(arr[1]);`, ["2", "4", "6", "1"], 0,
    "The enhanced for loop variable v is a copy of each element. Changing v does not change the array."),
  q("A1-33", 4, "What is printed?", `ArrayList<String> list = new ArrayList<String>();
list.add("A");
list.add("B");
list.add(0, "C");
list.set(2, "D");
list.remove(1);
System.out.println(list);`, ["[C, D]", "[C, A]", "[A, D]", "[C, A, D]"], 0,
    "[A] → [A, B] → add(0,\"C\") gives [C, A, B] → set(2,\"D\") gives [C, A, D] → remove(1) removes A, leaving [C, D]."),
  q("A1-34", 4, "list contains [2, 4, 5, 6, 8]. What does list contain after the code executes?", `for (int i = 0; i < list.size(); i++) {
  if (list.get(i) % 2 == 0) {
    list.remove(i);
  }
}`, ["[4, 5, 8]", "[5]", "[2, 5, 8]", "[4, 6, 8]"], 0,
    "Removing shifts later elements left, and then i++ skips the element that moved into index i. 2 is removed (4 is skipped), 5 stays, 6 is removed (8 is skipped). Traverse backward to fix this."),
  q("A1-35", 4, "What is printed?", `int[][] g = { {1, 2, 3}, {4, 5, 6} };
System.out.println(g[1][2] + g[0].length + g.length);`, ["11", "9", "10", "8"], 0,
    "g[1][2] is 6, g[0].length is 3 columns, g.length is 2 rows: 6 + 3 + 2 = 11."),
  q("A1-36", 4, "Using g = { {1, 2, 3}, {4, 5, 6} }, what is the value of sum?", `int sum = 0;
for (int r = 0; r < g.length; r++) {
  sum += g[r][1];
}`, ["7", "5", "9", "21"], 0,
    "This adds column 1 of every row: 2 + 5 = 7."),
  q("A1-37", 4, "What is returned by find(new int[]{3, 8, 1, 8}, 8)?", `public static int find(int[] arr, int target) {
  for (int i = 0; i < arr.length; i++) {
    if (arr[i] == target) {
      return i;
    }
  }
  return -1;
}`, ["1", "3", "8", "-1"], 0,
    "Linear search returns the index of the first match, which is 1."),
  q("A1-38", 4, "Selection sort places the smallest remaining element at the front on each pass. What does {5, 3, 8, 1, 4} look like after the first pass?", null,
    ["{1, 3, 8, 5, 4}", "{3, 5, 8, 1, 4}", "{1, 5, 3, 8, 4}", "{1, 3, 4, 5, 8}"], 0,
    "The minimum, 1, is swapped with the element at index 0 (5). Nothing else moves."),
  q("A1-39", 4, "Insertion sort is applied to {7, 2, 5, 1}. What does the array look like after the first two passes (inserting the elements at index 1 and index 2)?", null,
    ["{2, 5, 7, 1}", "{2, 7, 5, 1}", "{1, 2, 5, 7}", "{2, 7, 1, 5}"], 0,
    "Pass 1 inserts 2 before 7: {2, 7, 5, 1}. Pass 2 inserts 5 between 2 and 7: {2, 5, 7, 1}."),
  q("A1-40", 4, "What is returned by mystery(7)?", `public static int mystery(int n) {
  if (n <= 1) {
    return 1;
  }
  return n + mystery(n - 2);
}`, ["16", "15", "28", "13"], 0,
    "mystery(7) = 7 + mystery(5) = 7 + 5 + mystery(3) = 7 + 5 + 3 + mystery(1) = 7 + 5 + 3 + 1 = 16."),
  q("A1-41", 4, "A Scanner named input is connected to a text file of integers. Which loop correctly adds every integer in the file to sum?", null,
    ["while (input.hasNextInt()) { sum += input.nextInt(); }", "while (input.nextInt()) { sum += input.nextInt(); }", "for (int i = 0; i < input.length(); i++) { sum += input.nextInt(); }", "if (input.hasNextInt()) { sum += input.nextInt(); }"], 0,
    "hasNextInt() checks whether another int is available without consuming it; nextInt() reads it. An if statement would read only one value."),
  q("A1-42", 4, "What happens when this code runs?", `Student[] roster = new Student[3];
System.out.println(roster[0].getName());`, ["A NullPointerException is thrown.", "An empty string is printed.", "\"null\" is printed.", "An ArrayIndexOutOfBoundsException is thrown."], 0,
    "A new array of objects holds null references until objects are created. Calling a method on null throws a NullPointerException.")
];

const test2 = [
  q("A2-01", 1, "What is the value of x after the code executes?", `int x = 5;
x += 3 * 2;
x %= 4;`, ["3", "0", "1", "11"], 0,
    "x += 6 makes x 11. 11 % 4 is 3."),
  q("A2-02", 1, "What is printed?", `System.out.println(1 + 2 + "AP" + 1 + 2);`, ["3AP12", "12AP12", "3AP3", "12AP3"], 0,
    "Evaluation goes left to right. 1 + 2 is 3 (numbers). Then \"3\" + \"AP\" becomes a String, so the remaining + operators concatenate."),
  q("A2-03", 1, "Which expression evaluates to 7.5?", null,
    ["(double) (7 + 8) / 2", "(7 + 8) / 2", "(double) ((7 + 8) / 2)", "(int) (7.0 + 8) / 2"], 0,
    "Casting 15 to 15.0 before dividing makes it double division. (double) ((7 + 8) / 2) divides as ints first (7) and then casts, giving 7.0."),
  q("A2-04", 1, "What is printed?", `String w = "mississippi";
System.out.println(w.substring(w.indexOf("ss") + 2));`, ["issippi", "ssissippi", "sissippi", "ippi"], 0,
    "The first \"ss\" starts at index 2, so substring(4) returns everything from index 4: \"issippi\"."),
  q("A2-05", 1, "Which expression rounds a positive double d to the nearest integer?", null,
    ["(int) (d + 0.5)", "(int) d", "(int) d + 0.5", "(int) (d - 0.5)"], 0,
    "Adding 0.5 before truncating rounds positive values correctly (for example 4.6 + 0.5 = 5.1 → 5, and 4.4 + 0.5 = 4.9 → 4)."),
  q("A2-06", 1, "What is the value of n?", `int n = Integer.parseInt("42") + 8;`, ["50", "\"428\"", "428", "The code does not compile."], 0,
    "Integer.parseInt converts the String \"42\" to the int 42, and 42 + 8 is 50."),
  q("A2-07", 1, "What is printed?", `System.out.println(Math.sqrt(Math.pow(3, 2) + Math.pow(4, 2)));`, ["5.0", "5", "25.0", "7.0"], 0,
    "9.0 + 16.0 = 25.0, and the square root is 5.0. Math.sqrt returns a double."),
  q("A2-08", 1, "What happens when this code runs?", `String s = null;
System.out.println(s.length());`, ["A NullPointerException is thrown.", "0 is printed.", "null is printed.", "The code does not compile."], 0,
    "s does not refer to any object, so calling a method on it throws a NullPointerException."),

  q("A2-09", 2, "Assume a = 5, b = 3, c = 4. What is printed?", `if (a > b)
  if (b > c)
    System.out.println("X");
  else
    System.out.println("Y");`, ["Y", "X", "Nothing is printed", "XY"], 0,
    "An else matches the closest unmatched if. a > b is true, b > c is false, so the inner else runs and prints Y."),
  q("A2-10", 2, "What is printed?", `for (int i = 10; i > 0; i -= 3) {
  System.out.print(i + " ");
}`, ["10 7 4 1 ", "10 7 4 ", "10 7 4 1 -2 ", "7 4 1 "], 0,
    "i takes 10, 7, 4, 1. The next value, -2, fails i > 0."),
  q("A2-11", 2, "What is the value of count?", `int count = 0;
for (int i = 1; i <= 100; i++) {
  if (i % 4 == 0 && i % 6 == 0) {
    count++;
  }
}`, ["8", "16", "33", "25"], 0,
    "Numbers divisible by both 4 and 6 are multiples of 12: 12, 24, ..., 96. That is 8 numbers."),
  q("A2-12", 2, "With p = true and q = false, what does (p || q) && !(p && q) evaluate to?", null,
    ["true", "false", "It depends on evaluation order", "The expression does not compile"], 0,
    "p || q is true. p && q is false, so !(p && q) is true. true && true is true. This expression is true when exactly one of p and q is true."),
  q("A2-13", 2, "What is printed?", `int p = 1;
int k = 1;
while (p < 100) {
  k++;
  p *= k;
}
System.out.println(k);`, ["5", "4", "6", "120"], 0,
    "p becomes 2, 6, 24, 120 as k becomes 2, 3, 4, 5. When p is 120 the loop stops, and k is 5."),
  q("A2-14", 2, "What are the results of isPal(\"abcba\") and isPal(\"abca\"), in that order?", `public static boolean isPal(String s) {
  for (int i = 0; i < s.length() / 2; i++) {
    String front = s.substring(i, i + 1);
    String back = s.substring(s.length() - 1 - i, s.length() - i);
    if (!front.equals(back)) {
      return false;
    }
  }
  return true;
}`, ["true, false", "true, true", "false, false", "false, true"], 0,
    "The loop compares matching characters from each end. \"abcba\" matches all pairs. In \"abca\" the second pair (b and c) does not match."),
  q("A2-15", 2, "What is printed?", `for (int r = 1; r <= 3; r++) {
  for (int c = 1; c <= r; c++) {
    System.out.print(c);
  }
  System.out.println();
}`, ["1\n12\n123", "123\n123\n123", "1\n22\n333", "123\n12\n1"], 0,
    "Row r prints the numbers 1 through r, then moves to a new line."),
  q("A2-16", 2, "Which while loop prints the same output as for (int i = 2; i <= 8; i += 2) { System.out.print(i); }?", null,
    ["int i = 2; while (i <= 8) { System.out.print(i); i += 2; }", "int i = 2; while (i < 8) { System.out.print(i); i += 2; }", "int i = 2; while (i <= 8) { i += 2; System.out.print(i); }", "int i = 0; while (i <= 8) { System.out.print(i); i += 2; }"], 0,
    "Initialize before the loop, test the same condition, and update at the end of the body. The loop that adds 2 before printing prints 4 through 10."),
  q("A2-17", 2, "What is the value of count when s is \"banana\"?", `int count = 0;
for (int i = 0; i < s.length() - 1; i++) {
  if (s.substring(i, i + 2).equals("an")) {
    count++;
  }
}`, ["2", "3", "1", "0"], 0,
    "\"an\" starts at index 1 and index 3. The loop stops at length - 1 so substring(i, i + 2) stays in bounds."),
  q("A2-18", 2, "Assume x = 4 and y = -1. Which expressions evaluate to true?\nI. x > 0 && y > 0\nII. x > 0 || y > 0\nIII. !(x < 0) && y < 0", null,
    ["II and III only", "I only", "II only", "I, II, and III"], 0,
    "I is false because y > 0 is false. II is true because x > 0. III: x < 0 is false, so !(x < 0) is true, and y < 0 is true."),
  q("A2-19", 2, "What is printed?", `String result = "";
for (int i = 0; i < 4; i++) {
  result = i + result;
}
System.out.println(result);`, ["3210", "0123", "6", "0"], 0,
    "Each new number is added to the front: \"0\", \"10\", \"210\", \"3210\"."),
  q("A2-20", 2, "What is printed when n is 58193?", `int big = 0;
while (n > 0) {
  int d = n % 10;
  if (d > big) {
    big = d;
  }
  n /= 10;
}
System.out.println(big);`, ["9", "8", "5", "3"], 0,
    "The loop checks each digit (3, 9, 1, 8, 5) and keeps the largest, 9."),

  q("A2-21", 3, "What is printed?", `public class Account {
  private int balance;
  public Account(int start) { balance = start; }
  public void deposit(int amt) { balance += amt; }
  public void withdraw(int amt) {
    if (amt <= balance) {
      balance -= amt;
    }
  }
  public int getBalance() { return balance; }
}

// in main
Account a = new Account(100);
a.withdraw(150);
a.deposit(50);
a.withdraw(120);
System.out.println(a.getBalance());`, ["30", "-20", "150", "-120"], 0,
    "Withdrawing 150 from 100 is ignored. The deposit makes 150, and withdrawing 120 leaves 30."),
  q("A2-22", 3, "Using the Account class below, which statement in a different class causes a compile-time error? Assume Account a = new Account(100); has run.", `public class Account {
  private int balance;
  public Account(int start) { balance = start; }
  public void deposit(int amt) { balance += amt; }
  public int getBalance() { return balance; }
}`,
    ["a.balance = 500;", "a.deposit(500);", "int b = a.getBalance();", "Account c = new Account(0);"], 0,
    "balance is private, so code outside the Account class cannot access it directly."),
  q("A2-23", 3, "The Book class has constructors Book(String title) and Book(String title, int pages). Which statement compiles?", null,
    ["Book b = new Book(\"Dune\", 412);", "Book b = new Book(412, \"Dune\");", "Book b = new Book();", "Book b = new Book(\"Dune\", \"412\");"], 0,
    "The arguments must match a constructor's parameter list in number, order, and type. There is no no-argument constructor, because writing any constructor removes the default one."),
  q("A2-24", 3, "Why does the getLabel method fail to compile?", `public class Item {
  private double price;

  public static String getLabel() {
    return "Price: " + price;
  }
}`, ["A static method cannot use an instance variable directly.", "A String cannot be concatenated with a double.", "price must be public.", "Static methods cannot return a String."], 0,
    "A static method belongs to the class, not to any one object, so there is no particular object's price to use."),
  q("A2-25", 3, "The Point class does not override equals. p1 and p2 are separate Point objects with the same coordinates. What does p1.equals(p2) return?", null,
    ["false", "true", "It throws an exception.", "It does not compile."], 0,
    "Without an override, equals (from Object) compares references, just like ==."),
  q("A2-26", 3, "What is printed?", `Dog a = new Dog("Rex");
Dog b = a;
b.setName("Max");
System.out.println(a.getName());`, ["Max", "Rex", "null", "RexMax"], 0,
    "b = a copies the reference, so a and b are aliases for the same Dog object."),
  q("A2-27", 3, "Why does this method fail to compile?", `public int sign(int n) {
  if (n > 0) {
    return 1;
  } else if (n < 0) {
    return -1;
  }
}`, ["Not every path through the method returns a value.", "An int method cannot return a negative number.", "else if is not allowed in a method.", "The parameter n must be final."], 0,
    "If n is 0, neither branch runs and nothing is returned. The compiler requires a return on every path."),
  q("A2-28", 3, "A Temperature object stores celsius = 100. What does toF() return?", `public double toF() {
  return celsius * 9 / 5 + 32;
}`, ["212.0", "212", "132.0", "100.0"], 0,
    "celsius is a double, so 100.0 * 9 / 5 + 32 is 212.0."),
  q("A2-29", 3, "A Song class needs to store a title and a length in seconds. Which instance variable declarations are the best design?", null,
    ["private String title;\nprivate int lengthSeconds;", "public String title;\npublic int lengthSeconds;", "private static String title;\nprivate static int lengthSeconds;", "private String title, lengthSeconds;"], 0,
    "Each Song needs its own data (so not static), and the data should be private. A length in seconds is a whole number."),

  q("A2-30", 4, "arr is {1, 2, 3, 4}. What is arr after the code executes?", `for (int i = 0; i < arr.length - 1; i++) {
  arr[i] = arr[i + 1];
}`, ["{2, 3, 4, 4}", "{2, 3, 4, 1}", "{1, 1, 2, 3}", "{4, 1, 2, 3}"], 0,
    "Each element is replaced by its right neighbor. The last element is never overwritten, so it stays 4."),
  q("A2-31", 4, "What is printed?", `int[] a = {1, 2, 3};
int[] b = a;
b[0] = 9;
System.out.println(a[0]);`, ["9", "1", "0", "The code does not compile."], 0,
    "b = a copies the reference; both names refer to the same array."),
  q("A2-32", 4, "nums is {2, 4, 6, 8, 10}. What is the value of count?", `double avg = 0;
for (int n : nums) {
  avg += n;
}
avg /= nums.length;
int count = 0;
for (int n : nums) {
  if (n > avg) {
    count++;
  }
}`, ["2", "3", "5", "1"], 0,
    "The average is 30 / 5 = 6.0. Only 8 and 10 are greater than 6.0."),
  q("A2-33", 4, "list contains [3, 1, 4, 1, 5]. What is the value of sum?", `int sum = 0;
for (int i = 0; i < list.size(); i += 2) {
  sum += list.get(i);
}`, ["12", "14", "2", "9"], 0,
    "The loop visits indexes 0, 2, and 4: 3 + 4 + 5 = 12."),
  q("A2-34", 4, "Which code segment correctly removes every occurrence of \"x\" from the ArrayList<String> words?", null,
    ["for (int i = words.size() - 1; i >= 0; i--) { if (words.get(i).equals(\"x\")) { words.remove(i); } }", "for (int i = 0; i < words.size(); i++) { if (words.get(i).equals(\"x\")) { words.remove(i); } }", "for (String w : words) { if (w.equals(\"x\")) { words.remove(w); } }", "for (int i = 0; i <= words.size(); i++) { if (words.get(i) == \"x\") { words.remove(i); } }"], 0,
    "Going backward means a removal only shifts elements you already checked. Removing inside an enhanced for loop throws a ConcurrentModificationException."),
  q("A2-35", 4, "list contains [10, 20, 30]. What is printed?", `list.add(1, 15);
list.remove(2);
list.add(40);
System.out.println(list.get(2));`, ["30", "20", "15", "40"], 0,
    "[10, 15, 20, 30] → remove index 2 (the 20) → [10, 15, 30] → [10, 15, 30, 40]. Index 2 holds 30."),
  q("A2-36", 4, "What is printed?", `int[][] m = { {1, 2}, {3, 4}, {5, 6} };
int best = 0;
for (int r = 0; r < m.length; r++) {
  int rowSum = 0;
  for (int c = 0; c < m[r].length; c++) {
    rowSum += m[r][c];
  }
  if (rowSum > best) {
    best = rowSum;
  }
}
System.out.println(best);`, ["11", "21", "7", "12"], 0,
    "The row sums are 3, 7, and 11. The largest is 11."),
  q("A2-37", 4, "What is printed?", `int[][] grid = new int[3][4];
System.out.println(grid.length * grid[0].length + grid[2][3]);`, ["12", "13", "7", "An exception is thrown."], 0,
    "There are 3 rows and 4 columns, so 3 * 4 = 12. New int arrays are filled with 0, so grid[2][3] is 0."),
  q("A2-38", 4, "What is the value of sum?", `int[][] m = { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} };
int sum = 0;
for (int i = 0; i < m.length; i++) {
  sum += m[i][m.length - 1 - i];
}`, ["15", "45", "12", "18"], 0,
    "This adds the anti-diagonal: m[0][2] = 3, m[1][1] = 5, m[2][0] = 7. Total 15."),
  q("A2-39", 4, "Using the same m = { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} }, what is the value of count?", `int count = 0;
for (int[] row : m) {
  for (int v : row) {
    if (v % 2 == 0) {
      count++;
    }
  }
}`, ["4", "5", "3", "9"], 0,
    "The outer loop takes each row array; the inner loop takes each value. The even values are 2, 4, 6, and 8."),
  q("A2-40", 4, "Binary search is used to find 23 in the sorted array {2, 5, 8, 12, 16, 23, 38, 56, 72, 91}, using mid = (low + high) / 2. How many array elements are compared with 23?", null,
    ["3", "6", "1", "4"], 0,
    "low=0, high=9 → mid 4 (16 < 23) → low=5 → mid 7 (56 > 23) → high=6 → mid 5 (23 found). That is 3 comparisons: 16, 56, 23."),
  q("A2-41", 4, "Which statement best describes merge sort?", null,
    ["It repeatedly splits the list in half, sorts each half recursively, and merges the sorted halves.", "It repeatedly swaps the smallest remaining element into the next position.", "It inserts each element into its correct place among the elements already sorted.", "It compares the middle element to a target value."], 0,
    "That is merge sort's divide-and-conquer strategy. Swapping the smallest element in is selection sort, inserting into a sorted part is insertion sort, and checking the middle against a target is binary search."),
  q("A2-42", 4, "What is returned by rev(\"code\")?", `public static String rev(String s) {
  if (s.length() <= 1) {
    return s;
  }
  return rev(s.substring(1)) + s.substring(0, 1);
}`, ["edoc", "code", "ode", "ecod"], 0,
    "Each call moves the first character to the end of the reversed rest: rev(\"ode\") + \"c\" → (rev(\"de\") + \"o\") + \"c\" → \"edoc\".")
];

// Shuffle answer positions deterministically so the correct answer is not always A.
function seededShuffle(questions, seed) {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const shuffle = (list) => {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  // The right answer's position comes from a shuffled, evenly filled list, so A to D come up about equally.
  const slots = shuffle(questions.map((_, i) => i % 4));
  return questions.map((item, n) => {
    const right = item.choices[item.correctAnswer];
    const wrong = shuffle(item.choices.filter((_, i) => i !== item.correctAnswer));
    const at = Math.min(slots[n], item.choices.length - 1);
    wrong.splice(at, 0, right);
    return { ...item, choices: wrong, correctAnswer: at };
  });
}

export const csaPracticeTests = [
  {
    id: "csa-practice-1",
    title: "AP CSA Practice Exam 1",
    description: "42 questions in exam proportions: Strings and Math, loops and Boolean logic, class design, arrays, ArrayLists, 2D arrays, sorting, recursion, and file reading.",
    minutes: 90,
    questions: seededShuffle(test1, 11)
  },
  {
    id: "csa-practice-2",
    title: "AP CSA Practice Exam 2",
    description: "A second full-length 42-question exam with new code-tracing traps: dangling else, aliasing, ArrayList removal, 2D traversals, binary search, and recursive Strings.",
    minutes: 90,
    questions: seededShuffle(test2, 29)
  }
];
