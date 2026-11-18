// Reference sheets shown in the exam's Reference panel.
// Written as study aids that summarize the language/library; always check the official sheet in Bluebook.

export const references = {
  csp: {
    title: "AP CSP pseudocode reference",
    note: "Summary of the AP exam's pseudocode language. The official Exam Reference Sheet is provided in Bluebook on test day.",
    sections: [
      { title: "Assignment, display, and input", rows: [
        ["a ← expression", "Evaluates expression and assigns the result to variable a."],
        ["DISPLAY(expression)", "Shows the value of expression, followed by a space."],
        ["INPUT()", "Accepts a value from the user and returns it."]
      ] },
      { title: "Arithmetic", rows: [
        ["a + b, a - b, a * b, a / b", "Standard arithmetic. / can produce a decimal."],
        ["a MOD b", "Remainder when a is divided by b (a and b positive integers). 17 MOD 5 is 2."],
        ["RANDOM(a, b)", "A random integer from a to b, including both a and b."]
      ] },
      { title: "Relational and Boolean", rows: [
        ["a = b, a ≠ b, a > b, a < b, a ≥ b, a ≤ b", "Compare two values; the result is true or false."],
        ["NOT condition", "true if condition is false."],
        ["condition1 AND condition2", "true only if both are true."],
        ["condition1 OR condition2", "true if at least one is true."]
      ] },
      { title: "Selection", rows: [
        ["IF (condition)\n{ <block> }", "Runs the block only if condition is true."],
        ["IF (condition)\n{ <first block> }\nELSE\n{ <second block> }", "Runs the first block if true, otherwise the second."]
      ] },
      { title: "Iteration", rows: [
        ["REPEAT n TIMES\n{ <block> }", "Runs the block exactly n times."],
        ["REPEAT UNTIL (condition)\n{ <block> }", "Checks condition first; repeats the block until condition is true. May run zero times."],
        ["FOR EACH item IN aList\n{ <block> }", "item takes each element of aList in order, first to last."]
      ] },
      { title: "Lists (the first index is 1)", rows: [
        ["aList ← [value1, value2, value3]", "Creates a list. aList ← [] creates an empty list."],
        ["aList[i]", "The element at index i. An index below 1 or above LENGTH(aList) is an error that stops the program."],
        ["aList[i] ← x", "Replaces the element at index i with x."],
        ["INSERT(aList, i, value)", "Shifts elements at i and after to the right, then puts value at index i."],
        ["APPEND(aList, value)", "Adds value to the end. Length increases by 1."],
        ["REMOVE(aList, i)", "Removes the element at index i; later elements shift left."],
        ["LENGTH(aList)", "Number of elements in aList."]
      ] },
      { title: "Procedures", rows: [
        ["PROCEDURE name(p1, p2)\n{ <instructions> }", "Defines a procedure with parameters p1 and p2."],
        ["PROCEDURE name(p1)\n{ RETURN(expression) }", "RETURN sends a value back and ends the procedure."],
        ["result ← name(arg1, arg2)", "Calls the procedure and stores the returned value."]
      ] },
      { title: "Robot", rows: [
        ["MOVE_FORWARD()", "Moves one square forward in the direction it faces. Moving off the grid or into a blocked square stops the program."],
        ["ROTATE_LEFT() / ROTATE_RIGHT()", "Turns 90 degrees in place."],
        ["CAN_MOVE(direction)", "true if there is an open square in direction (left, right, forward, or backward), relative to the robot."]
      ] }
    ]
  },
  csa: {
    title: "Java methods reference",
    note: "Study aid modeled on the AP Java Quick Reference. Check the official Quick Reference in Bluebook for the exact list on test day.",
    sections: [
      { title: "String", rows: [
        ["int length()", "Number of characters."],
        ["String substring(int from, int to)", "Characters from index from up to, but not including, index to."],
        ["String substring(int from)", "Characters from index from to the end."],
        ["int indexOf(String str)", "Index of the first occurrence of str, or -1 if not found."],
        ["boolean equals(Object other)", "true if the characters match exactly."],
        ["int compareTo(String other)", "Negative if this comes before other alphabetically, 0 if equal, positive if after."]
      ] },
      { title: "Integer and Double", rows: [
        ["Integer.MIN_VALUE / Integer.MAX_VALUE", "Smallest and largest int values."],
        ["static int Integer.parseInt(String s)", "Converts a String like \"42\" to the int 42."],
        ["static double Double.parseDouble(String s)", "Converts a String like \"3.5\" to a double."]
      ] },
      { title: "Math", rows: [
        ["static int abs(int x) / double abs(double x)", "Absolute value."],
        ["static double pow(double base, double exponent)", "base raised to exponent."],
        ["static double sqrt(double x)", "Square root (x ≥ 0)."],
        ["static double random()", "A double from 0.0 up to, but not including, 1.0."]
      ] },
      { title: "ArrayList<E>", rows: [
        ["int size()", "Number of elements."],
        ["boolean add(E obj)", "Appends obj to the end; returns true."],
        ["void add(int index, E obj)", "Inserts obj at index; later elements shift right."],
        ["E get(int index)", "Element at index."],
        ["E set(int index, E obj)", "Replaces the element at index; returns the old element."],
        ["E remove(int index)", "Removes the element at index; later elements shift left. Returns the removed element."]
      ] },
      { title: "Object", rows: [
        ["boolean equals(Object other)", "Default compares references; classes such as String override it."],
        ["String toString()", "String description of the object; println calls it automatically."]
      ] },
      { title: "Reading text files", rows: [
        ["Scanner input = new Scanner(new File(\"data.txt\"));", "Opens a text file for reading."],
        ["boolean hasNext() / hasNextInt()", "true if another token (or int) is available."],
        ["String next() / int nextInt() / double nextDouble()", "Reads the next token."],
        ["String nextLine()", "Reads the rest of the current line."],
        ["void close()", "Closes the Scanner."]
      ] },
      { title: "Arrays and 2D arrays", rows: [
        ["arr.length", "Number of elements (no parentheses)."],
        ["grid.length / grid[0].length", "Number of rows / number of columns."]
      ] }
    ]
  },
  cyber: {
    title: "Cybersecurity study reference",
    note: "Study aid for practice. It is not an official exam reference sheet.",
    sections: [
      { title: "Common ports", rows: [
        ["20/21 FTP", "File transfer, unencrypted."],
        ["22 SSH", "Encrypted remote login and file transfer (SFTP)."],
        ["23 Telnet", "Remote login, unencrypted. Replace with SSH."],
        ["25 SMTP", "Sending email."],
        ["53 DNS", "Domain name lookups."],
        ["80 HTTP / 443 HTTPS", "Web traffic; HTTPS is encrypted with TLS."],
        ["445 SMB", "Windows file sharing."],
        ["3389 RDP", "Windows Remote Desktop."]
      ] },
      { title: "Linux permissions", rows: [
        ["-rwxr-x---", "Type, then owner / group / others: r = read, w = write, x = execute."],
        ["r = 4, w = 2, x = 1", "Add them per group: 7 = rwx, 6 = rw-, 5 = r-x, 4 = r--."],
        ["chmod 640 file", "Owner rw-, group r--, others ---."],
        ["chmod 600 file", "Owner rw-, nobody else."]
      ] },
      { title: "Firewall rules", rows: [
        ["Top to bottom, first match wins", "Later rules never apply to traffic an earlier rule matched."],
        ["End with DENY any any", "Anything not explicitly allowed is blocked (default deny)."]
      ] },
      { title: "Log red flags", rows: [
        ["Many failed logins, then a success", "Brute force that worked."],
        ["One source, many ports, seconds apart", "Port scan."],
        ["Activity at impossible times or places", "Stolen or cloned credentials or badge."],
        ["New outbound traffic and high CPU", "Malware, e.g. cryptominer or botnet."]
      ] },
      { title: "CIA triad", rows: [
        ["Confidentiality", "Only authorized people can see it."],
        ["Integrity", "Data hasn't been changed without authorization."],
        ["Availability", "Authorized users can access it when needed."]
      ] }
    ]
  }
};
