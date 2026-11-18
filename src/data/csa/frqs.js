// AP CSA free-response practice: two questions for each of the four exam FRQ types.
// Rubrics are practice rubrics modeled on AP CSA scoring style (points per row).

export const csaFrqs = [
  {
    id: "csa-frq-1",
    category: "FRQ 1: Methods and Control Structures",
    title: "DigitTools: countMatches and isLucky",
    prompt: "Write two static methods of the DigitTools class.\n\n(a) countMatches(int n, int d) returns the number of times the digit d appears in the non-negative integer n. For example, countMatches(70737, 7) returns 3 and countMatches(1234, 9) returns 0. Assume 0 <= d <= 9 and n > 0.\n\n(b) isLucky(int n) returns true if n contains at least two 7s and no 4s, and false otherwise. You must call countMatches appropriately to receive full credit. For example, isLucky(1777) returns true, isLucky(747) returns false, and isLucky(17) returns false.",
    code: `public class DigitTools {
  /** Returns the number of times digit d appears in n. Precondition: n > 0, 0 <= d <= 9 */
  public static int countMatches(int n, int d) {
    /* to be implemented in part (a) */
  }

  /** Returns true if n has at least two 7s and no 4s. */
  public static boolean isLucky(int n) {
    /* to be implemented in part (b) */
  }
}`,
    rubric: [
      { point: "(a) Loops over the digits", points: 1, lookFor: "Uses a loop that processes each digit, e.g. while (n > 0) with n % 10 and n /= 10 (or equivalent String traversal).", keywords: ["while", "% 10", "/= 10", "/ 10"] },
      { point: "(a) Compares each digit to d", points: 1, lookFor: "Extracts a digit and compares it with d correctly.", keywords: ["== d", "% 10 == d", "if"] },
      { point: "(a) Counts and returns", points: 1, lookFor: "Initializes a counter, increments it on a match, and returns it after the loop (not inside).", keywords: ["count", "++", "return"] },
      { point: "(b) Calls countMatches for 7", points: 1, lookFor: "Calls countMatches(n, 7) and compares the result with >= 2.", keywords: ["countMatches(n, 7)", ">= 2", "> 1"] },
      { point: "(b) Calls countMatches for 4", points: 1, lookFor: "Calls countMatches(n, 4) and checks that the result is 0.", keywords: ["countMatches(n, 4)", "== 0"] },
      { point: "(b) Returns the correct boolean", points: 1, lookFor: "Combines both conditions with && and returns true/false correctly in all cases.", keywords: ["&&", "return"] }
    ],
    checklist: ["I did not reprint the method header incorrectly.", "My loop ends (n gets smaller each time).", "I return after the loop, not inside it.", "Part (b) calls my part (a) method."],
    tip: "On a part (b) that says 'must call' the part (a) method, call it even if your part (a) was wrong. Readers grade (b) assuming (a) works.",
    solution: `public static int countMatches(int n, int d) {
  int count = 0;
  while (n > 0) {
    if (n % 10 == d) {
      count++;
    }
    n /= 10;
  }
  return count;
}

public static boolean isLucky(int n) {
  return countMatches(n, 7) >= 2 && countMatches(n, 4) == 0;
}`
  },
  {
    id: "csa-frq-2",
    category: "FRQ 1: Methods and Control Structures",
    title: "TextTools: countDoubles and removeAll",
    prompt: "Write two static methods of the TextTools class.\n\n(a) countDoubles(String s) returns the number of positions where a character is the same as the character immediately after it. For example, countDoubles(\"bookkeeper\") returns 3 (\"oo\", \"kk\", \"ee\"), countDoubles(\"aaa\") returns 2, and countDoubles(\"\") returns 0.\n\n(b) removeAll(String s, String ch) returns a new String that is s with every occurrence of the one-character String ch removed. For example, removeAll(\"banana\", \"a\") returns \"bnn\". The original String s is not changed.",
    code: `public class TextTools {
  public static int countDoubles(String s) {
    /* to be implemented in part (a) */
  }

  /** Precondition: ch.length() == 1 */
  public static String removeAll(String s, String ch) {
    /* to be implemented in part (b) */
  }
}`,
    rubric: [
      { point: "(a) Traverses without going out of bounds", points: 1, lookFor: "Loop bound stops at s.length() - 1 (or equivalent) so comparing i and i + 1 never goes out of bounds.", keywords: ["length() - 1", "i + 1", "for"] },
      { point: "(a) Compares adjacent characters", points: 1, lookFor: "Compares substring(i, i + 1) with substring(i + 1, i + 2) using equals (or compares chars with ==).", keywords: ["substring(i, i + 1)", "substring(i + 1, i + 2)", ".equals", "charAt"] },
      { point: "(a) Counts and returns", points: 1, lookFor: "Increments a counter for each match and returns it.", keywords: ["count", "++", "return"] },
      { point: "(b) Traverses every character", points: 1, lookFor: "Loops over all indexes 0 to s.length() - 1.", keywords: ["for", "s.length()"] },
      { point: "(b) Builds result without ch", points: 2, lookFor: "Appends each character that is not equal to ch to a result String (1 point for the comparison using equals, 1 point for correct building).", keywords: ["equals(ch)", "!", "result +=", "+="] },
      { point: "(b) Returns the new String", points: 1, lookFor: "Returns the built String after the loop.", keywords: ["return result", "return"] }
    ],
    checklist: ["I used .equals for String comparison.", "My loop bounds avoid StringIndexOutOfBoundsException.", "I did not try to change s directly (Strings are immutable)."],
    tip: "Write the loop bound first and test it on a 2-character string in your head. Most FRQ 1 point losses are off-by-one errors.",
    solution: `public static int countDoubles(String s) {
  int count = 0;
  for (int i = 0; i < s.length() - 1; i++) {
    if (s.substring(i, i + 1).equals(s.substring(i + 1, i + 2))) {
      count++;
    }
  }
  return count;
}

public static String removeAll(String s, String ch) {
  String result = "";
  for (int i = 0; i < s.length(); i++) {
    String c = s.substring(i, i + 1);
    if (!c.equals(ch)) {
      result += c;
    }
  }
  return result;
}`
  },
  {
    id: "csa-frq-3",
    category: "FRQ 2: Class Design",
    title: "GymMembership class",
    prompt: "Write the complete GymMembership class. A GymMembership is created with a member name and a number of visits allowed per month.\n\n• checkIn() returns true and uses one visit if the member has at least one visit left; otherwise it returns false and nothing changes.\n• getVisitsLeft() returns the number of visits remaining.\n• renew() resets the visits remaining to the original monthly amount and increases the count of months renewed by 1.\n• getMonthsRenewed() returns how many times renew has been called.\n\nExample:\nGymMembership g = new GymMembership(\"Ava\", 2);\ng.checkIn(); // returns true\ng.checkIn(); // returns true\ng.checkIn(); // returns false\ng.getVisitsLeft(); // returns 0\ng.renew();\ng.getVisitsLeft(); // returns 2\ng.getMonthsRenewed(); // returns 1",
    rubric: [
      { point: "Class header and private instance variables", points: 1, lookFor: "public class GymMembership with private instance variables for name, monthly allowance, visits left, and months renewed.", keywords: ["public class GymMembership", "private"] },
      { point: "Constructor", points: 2, lookFor: "Constructor GymMembership(String name, int visits) with no return type that initializes all instance variables appropriately (visits left = allowance, renewals = 0).", keywords: ["public GymMembership(", "String", "int"] },
      { point: "checkIn header and return", points: 1, lookFor: "public boolean checkIn() that returns true or false.", keywords: ["public boolean checkIn()", "return true", "return false"] },
      { point: "checkIn logic", points: 2, lookFor: "Only decrements visits left when visits left > 0; returns false and changes nothing otherwise.", keywords: ["> 0", "--", "-= 1", "if"] },
      { point: "renew", points: 1, lookFor: "public void renew() resets visits left to the allowance and increments months renewed.", keywords: ["public void renew()", "++"] },
      { point: "Accessors", points: 2, lookFor: "public int getVisitsLeft() and public int getMonthsRenewed() return the correct instance variables.", keywords: ["getVisitsLeft()", "getMonthsRenewed()", "return"] }
    ],
    checklist: ["All instance variables are private.", "The constructor has no return type.", "I stored the original allowance so renew can reset it.", "Every method header matches the example calls."],
    tip: "In Class Design FRQs, list the instance variables you need by reading every method description first. Here, renew needs the original monthly amount, so you must store it.",
    solution: `public class GymMembership {
  private String name;
  private int monthlyVisits;
  private int visitsLeft;
  private int monthsRenewed;

  public GymMembership(String name, int monthlyVisits) {
    this.name = name;
    this.monthlyVisits = monthlyVisits;
    visitsLeft = monthlyVisits;
    monthsRenewed = 0;
  }

  public boolean checkIn() {
    if (visitsLeft > 0) {
      visitsLeft--;
      return true;
    }
    return false;
  }

  public int getVisitsLeft() {
    return visitsLeft;
  }

  public void renew() {
    visitsLeft = monthlyVisits;
    monthsRenewed++;
  }

  public int getMonthsRenewed() {
    return monthsRenewed;
  }
}`
  },
  {
    id: "csa-frq-4",
    category: "FRQ 2: Class Design",
    title: "LibraryBook class",
    prompt: "Write the complete LibraryBook class. A LibraryBook is created with a title and the maximum number of times it can be renewed.\n\n• checkOut() checks the book out if it is not already checked out, sets its renewals used to 0, and returns true. If it is already checked out, it returns false.\n• renew() returns true and uses one renewal if the book is checked out and renewals used is less than the maximum. Otherwise it returns false.\n• returnBook() marks the book as not checked out.\n• toString() returns the title followed by \" (out)\" if checked out or \" (in)\" if not.\n\nExample:\nLibraryBook b = new LibraryBook(\"Dune\", 1);\nb.renew(); // false, not checked out\nb.checkOut(); // true\nb.renew(); // true\nb.renew(); // false, no renewals left\nb.toString(); // \"Dune (out)\"\nb.returnBook();\nb.toString(); // \"Dune (in)\"",
    rubric: [
      { point: "Private instance variables", points: 1, lookFor: "Private variables for title, max renewals, renewals used, and a boolean checked-out state.", keywords: ["private", "boolean"] },
      { point: "Constructor", points: 1, lookFor: "public LibraryBook(String title, int maxRenewals) initializes all variables; the book starts not checked out.", keywords: ["public LibraryBook(", "false"] },
      { point: "checkOut", points: 2, lookFor: "Returns false if already out; otherwise sets checked out to true, resets renewals used to 0, and returns true.", keywords: ["checkOut()", "= true", "= 0", "return"] },
      { point: "renew", points: 2, lookFor: "Checks both conditions (checked out AND renewals used < max); increments renewals used only when allowed; returns the correct boolean.", keywords: ["renew()", "&&", "<", "++"] },
      { point: "returnBook", points: 1, lookFor: "public void returnBook() sets checked out to false.", keywords: ["returnBook()", "= false"] },
      { point: "toString", points: 2, lookFor: "public String toString() returns title + \" (out)\" or title + \" (in)\" based on state.", keywords: ["public String toString()", "(out)", "(in)"] }
    ],
    checklist: ["renew checks two conditions.", "checkOut resets renewals used.", "toString returns, it does not print."],
    tip: "toString must return a String. Using System.out.println inside toString loses the point.",
    solution: `public class LibraryBook {
  private String title;
  private int maxRenewals;
  private int renewalsUsed;
  private boolean checkedOut;

  public LibraryBook(String title, int maxRenewals) {
    this.title = title;
    this.maxRenewals = maxRenewals;
    renewalsUsed = 0;
    checkedOut = false;
  }

  public boolean checkOut() {
    if (checkedOut) {
      return false;
    }
    checkedOut = true;
    renewalsUsed = 0;
    return true;
  }

  public boolean renew() {
    if (checkedOut && renewalsUsed < maxRenewals) {
      renewalsUsed++;
      return true;
    }
    return false;
  }

  public void returnBook() {
    checkedOut = false;
  }

  public String toString() {
    if (checkedOut) {
      return title + " (out)";
    }
    return title + " (in)";
  }
}`
  },
  {
    id: "csa-frq-5",
    category: "FRQ 3: Data Analysis with ArrayList",
    title: "WeatherData: averageTemp and removeBelow",
    prompt: "A Reading object stores a city name and a temperature. The WeatherData class stores an ArrayList of Reading objects.\n\n(a) Write averageTemp(String city), which returns the average temperature of all readings for the given city. If there are no readings for that city, return 0.0.\n\n(b) Write removeBelow(double min), which removes every reading whose temperature is less than min from readings and returns the number of readings removed. The relative order of the remaining readings must not change.",
    code: `public class Reading {
  public String getCity() { /* implementation not shown */ }
  public double getTemp() { /* implementation not shown */ }
}

public class WeatherData {
  private ArrayList<Reading> readings;

  public double averageTemp(String city) {
    /* to be implemented in part (a) */
  }

  public int removeBelow(double min) {
    /* to be implemented in part (b) */
  }
}`,
    rubric: [
      { point: "(a) Traverses readings", points: 1, lookFor: "Accesses every element of readings with a loop (indexed or enhanced for).", keywords: ["for", "readings", "get(i)", ": readings"] },
      { point: "(a) Filters by city with equals", points: 1, lookFor: "Compares getCity() with city using equals.", keywords: ["getCity().equals(city)", ".equals(city)"] },
      { point: "(a) Computes average correctly", points: 2, lookFor: "Sums matching temperatures, counts matches, returns sum / count as a double, and returns 0.0 when count is 0 (no division by zero).", keywords: ["sum", "count", "/ count", "0.0"] },
      { point: "(b) Removes without skipping", points: 2, lookFor: "Removes using a backward loop, or a forward loop that does not increment i after a removal. A forward loop that always increments i loses this point.", keywords: ["size() - 1", "i--", "i >= 0", "remove(i)"] },
      { point: "(b) Correct condition", points: 1, lookFor: "Removes exactly the readings with getTemp() < min.", keywords: ["getTemp() < min", "< min"] },
      { point: "(b) Counts and returns removals", points: 1, lookFor: "Counts each removal and returns the count.", keywords: ["count++", "return count", "removed"] }
    ],
    checklist: ["I never call remove inside an enhanced for loop.", "I protected against dividing by zero.", "I used getCity()/getTemp() instead of private fields."],
    tip: "For any ArrayList removal FRQ, traverse from the end: for (int i = list.size() - 1; i >= 0; i--). It is the easiest way to avoid skipping elements.",
    solution: `public double averageTemp(String city) {
  double sum = 0.0;
  int count = 0;
  for (Reading r : readings) {
    if (r.getCity().equals(city)) {
      sum += r.getTemp();
      count++;
    }
  }
  if (count == 0) {
    return 0.0;
  }
  return sum / count;
}

public int removeBelow(double min) {
  int removed = 0;
  for (int i = readings.size() - 1; i >= 0; i--) {
    if (readings.get(i).getTemp() < min) {
      readings.remove(i);
      removed++;
    }
  }
  return removed;
}`
  },
  {
    id: "csa-frq-6",
    category: "FRQ 3: Data Analysis with ArrayList",
    title: "Playlist: totalPlays and popularTitles",
    prompt: "A Song object has getTitle(), getArtist(), and getPlays() methods. A Playlist stores an ArrayList<Song> named songs.\n\n(a) Write totalPlays(String artist), which returns the total number of plays of all songs by the given artist.\n\n(b) Write popularTitles(int minPlays), which returns a new ArrayList<String> containing the titles of all songs with at least minPlays plays, in the same order they appear in songs. The songs list must not be modified.",
    code: `public class Song {
  public String getTitle() { /* not shown */ }
  public String getArtist() { /* not shown */ }
  public int getPlays() { /* not shown */ }
}

public class Playlist {
  private ArrayList<Song> songs;

  public int totalPlays(String artist) {
    /* to be implemented in part (a) */
  }

  public ArrayList<String> popularTitles(int minPlays) {
    /* to be implemented in part (b) */
  }
}`,
    rubric: [
      { point: "(a) Traverses songs", points: 1, lookFor: "Loops through every Song in songs.", keywords: ["for", "songs"] },
      { point: "(a) Matches artist and sums plays", points: 2, lookFor: "Uses getArtist().equals(artist) and adds getPlays() for matches.", keywords: ["getArtist().equals(artist)", "getPlays()", "+="] },
      { point: "(a) Returns the total", points: 1, lookFor: "Returns the accumulated total after the loop.", keywords: ["return"] },
      { point: "(b) Creates a new ArrayList<String>", points: 1, lookFor: "Declares and constructs a new ArrayList<String>.", keywords: ["new ArrayList", "ArrayList<String>"] },
      { point: "(b) Correct condition and adds titles", points: 2, lookFor: "Adds getTitle() when getPlays() >= minPlays (at least means >=).", keywords: [">= minPlays", "add(", "getTitle()"] },
      { point: "(b) Returns list; songs unchanged", points: 1, lookFor: "Returns the new list and does not remove or modify songs.", keywords: ["return"] }
    ],
    checklist: ["'At least' means >=.", "I returned a new list, not songs.", "I compared Strings with equals."],
    tip: "Read comparison words carefully: 'at least' is >=, 'more than' is >, 'at most' is <=.",
    solution: `public int totalPlays(String artist) {
  int total = 0;
  for (Song s : songs) {
    if (s.getArtist().equals(artist)) {
      total += s.getPlays();
    }
  }
  return total;
}

public ArrayList<String> popularTitles(int minPlays) {
  ArrayList<String> result = new ArrayList<String>();
  for (Song s : songs) {
    if (s.getPlays() >= minPlays) {
      result.add(s.getTitle());
    }
  }
  return result;
}`
  },
  {
    id: "csa-frq-7",
    category: "FRQ 4: 2D Array",
    title: "Terrain: isPeak and countPeaks",
    prompt: "A Terrain object stores a 2D int array heights, where each element is the height of a location. A location is a peak if its height is strictly greater than every neighbor directly above, below, left, and right of it that exists in the grid (locations on an edge have fewer neighbors).\n\n(a) Write isPeak(int r, int c), which returns true if the location at row r and column c is a peak.\n\n(b) Write countPeaks(), which returns the number of peaks in heights. You must call isPeak appropriately to receive full credit.",
    code: `public class Terrain {
  private int[][] heights;

  /** Precondition: r and c are valid indexes into heights */
  public boolean isPeak(int r, int c) {
    /* to be implemented in part (a) */
  }

  public int countPeaks() {
    /* to be implemented in part (b) */
  }
}

Example: heights =
{ {1, 2, 1},
  {4, 3, 5},
  {2, 1, 2} }
isPeak(0, 1) is false (its neighbor below, 3, is higher).
isPeak(1, 0) is true and isPeak(1, 2) is true.
countPeaks() returns 2.`,
    rubric: [
      { point: "(a) Checks the neighbor above safely", points: 1, lookFor: "Checks r > 0 before comparing with heights[r - 1][c] (bounds checked before access).", keywords: ["r > 0", "r - 1", "r >= 1"] },
      { point: "(a) Checks below, left, and right safely", points: 2, lookFor: "Checks r < heights.length - 1, c > 0, and c < heights[0].length - 1 before accessing each neighbor.", keywords: ["heights.length - 1", "c > 0", "c - 1", "c + 1", "r + 1"] },
      { point: "(a) Returns correct result", points: 1, lookFor: "Returns false if any existing neighbor is greater than or equal to the location; true otherwise.", keywords: [">=", "return false", "return true"] },
      { point: "(b) Traverses every location", points: 2, lookFor: "Nested loops over all rows and all columns with correct bounds.", keywords: ["heights.length", "heights[0].length", "for"] },
      { point: "(b) Calls isPeak and counts", points: 1, lookFor: "Calls isPeak(r, c), increments a counter for true, and returns it.", keywords: ["isPeak(", "count++", "return count"] }
    ],
    checklist: ["Every neighbor access is protected by a bounds check.", "Strictly greater means a tie is not a peak.", "Rows use heights.length, columns use heights[0].length."],
    tip: "Short-circuit && protects array access: write if (r > 0 && heights[r - 1][c] >= h), never the other order.",
    solution: `public boolean isPeak(int r, int c) {
  int h = heights[r][c];
  if (r > 0 && heights[r - 1][c] >= h) return false;
  if (r < heights.length - 1 && heights[r + 1][c] >= h) return false;
  if (c > 0 && heights[r][c - 1] >= h) return false;
  if (c < heights[0].length - 1 && heights[r][c + 1] >= h) return false;
  return true;
}

public int countPeaks() {
  int count = 0;
  for (int r = 0; r < heights.length; r++) {
    for (int c = 0; c < heights[0].length; c++) {
      if (isPeak(r, c)) {
        count++;
      }
    }
  }
  return count;
}`
  },
  {
    id: "csa-frq-8",
    category: "FRQ 4: 2D Array",
    title: "GradeBook: assignmentAverage and countImproved",
    prompt: "A GradeBook stores a 2D int array scores. Each row represents one student, and each column represents one assignment, in the order the assignments were given. Every row has at least two columns.\n\n(a) Write assignmentAverage(int col), which returns the average score on the assignment in column col as a double.\n\n(b) Write countImproved(), which returns the number of students whose score on the last assignment is greater than their score on the first assignment.",
    code: `public class GradeBook {
  private int[][] scores;

  /** Precondition: 0 <= col < scores[0].length */
  public double assignmentAverage(int col) {
    /* to be implemented in part (a) */
  }

  public int countImproved() {
    /* to be implemented in part (b) */
  }
}

Example: scores =
{ {70, 80, 90},
  {95, 85, 88},
  {60, 60, 75} }
assignmentAverage(1) returns 75.0
countImproved() returns 2`,
    rubric: [
      { point: "(a) Traverses one column", points: 2, lookFor: "Loops over every row r and accesses scores[r][col] (column-major access for a single column).", keywords: ["scores.length", "[r][col]", "[i][col]"] },
      { point: "(a) Returns a double average", points: 2, lookFor: "Sums the column and divides by the number of rows using double division (cast or double sum).", keywords: ["(double)", "/ scores.length", "double"] },
      { point: "(b) Traverses rows", points: 1, lookFor: "Loops over every student row.", keywords: ["for", "scores.length", "int[] row"] },
      { point: "(b) Compares last and first correctly", points: 2, lookFor: "Compares scores[r][scores[r].length - 1] (or row[row.length - 1]) > scores[r][0] and counts matches; returns the count.", keywords: ["length - 1", "[0]", ">", "count"] }
    ],
    checklist: ["I avoided integer division in the average.", "The last column index is length - 1.", "I returned a value from each method."],
    tip: "Integer division is the most common 2D-array point loss: declare sum as double or cast before dividing.",
    solution: `public double assignmentAverage(int col) {
  double sum = 0;
  for (int r = 0; r < scores.length; r++) {
    sum += scores[r][col];
  }
  return sum / scores.length;
}

public int countImproved() {
  int count = 0;
  for (int[] row : scores) {
    if (row[row.length - 1] > row[0]) {
      count++;
    }
  }
  return count;
}`
  }
];
