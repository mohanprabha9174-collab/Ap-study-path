// AP Cybersecurity free-response practice in the "Device Security Analysis" style:
// several sources about one device, with parts that require evidence-based answers.

export const cyberFrqs = [
  {
    id: "cyber-frq-1",
    category: "Device Security Analysis",
    title: "Library Kiosk Workstation",
    prompt: "A public library has a kiosk computer that patrons use to search the catalog. The IT team suspects the kiosk was misused. Use the sources below to answer every part. Cite specific evidence (for example, 'Source 4, line 3') in each answer.",
    sources: [
      { title: "Source 1: Library Acceptable Use Policy (excerpt)", content: "1. Kiosks may only be used to access the library catalog website.\n2. Patrons may not install software or save files.\n3. Kiosk accounts must not have administrator privileges.\n4. Remote administration must only be possible from the IT office network (10.20.0.0/24)." },
      { title: "Source 2: Kiosk firewall rules (inbound, first match applies)", content: "1  ALLOW  TCP  10.20.0.0/24 -> kiosk  port 22   (SSH)\n2  ALLOW  TCP  any          -> kiosk  port 3389 (RDP)\n3  DENY   any  any          -> kiosk  any" },
      { title: "Source 3: Kiosk user accounts", content: "Account    Groups               Password last changed\nkiosk      users, administrators 2023-01-10\nitadmin    administrators        2026-10-02" },
      { title: "Source 4: Security log (Nov 12)", content: "21:40:02  RDP logon failure  user=kiosk  src=185.220.101.7\n21:40:03  RDP logon failure  user=kiosk  src=185.220.101.7\n... 212 more failures ...\n21:44:51  RDP logon success  user=kiosk  src=185.220.101.7\n21:46:10  Software installed: coinminer.exe  user=kiosk" },
      { title: "Source 5: File system permissions", content: "C:\\Kiosk\\catalog_shortcut.url   Everyone: Read\nC:\\Kiosk\\startup_scripts\\       Everyone: Full Control" },
      { title: "Source 6: Performance monitor", content: "Nov 1-11 average CPU use: 12%\nNov 12 21:47 - Nov 13 08:00 average CPU use: 98%\nOutbound traffic to 45.9.20.14:3333 began Nov 12 21:47" }
    ],
    parts: [
      { label: "A", text: "Identify two ways the kiosk's configuration violates the Acceptable Use Policy (Source 1). For each, cite the source that shows the violation." },
      { label: "B", text: "Using Sources 4 and 6, describe what attack occurred and the evidence that it succeeded." },
      { label: "C", text: "Explain how changing Rule 2 in Source 2 to allow port 3389 only from 10.20.0.0/24 would affect the attack and legitimate IT staff." },
      { label: "D", text: "Identify one additional security issue in Source 5 and explain how an attacker could use it." },
      { label: "E", text: "Recommend two mitigations, in priority order, and justify the order." }
    ],
    rubric: [
      { point: "A: Policy violation 1 with evidence", points: 1, lookFor: "Identifies that the kiosk account is in the administrators group (Source 3) violating policy item 3.", keywords: ["administrator", "source 3", "kiosk account", "privilege"] },
      { point: "A: Policy violation 2 with evidence", points: 1, lookFor: "Identifies that RDP is allowed from any address (Source 2, Rule 2) violating policy item 4 (remote admin only from 10.20.0.0/24), or that software was installed (Source 4) violating item 2.", keywords: ["rule 2", "any", "3389", "rdp", "installed"] },
      { point: "B: Names the attack", points: 1, lookFor: "Identifies a brute-force/password-guessing attack over RDP from 185.220.101.7.", keywords: ["brute", "rdp", "185.220.101.7", "failures"] },
      { point: "B: Evidence of success and impact", points: 1, lookFor: "Cites the successful logon at 21:44:51 and the coinminer installation, and/or the CPU jump to 98% and outbound traffic to port 3333 (cryptomining).", keywords: ["success", "coinminer", "98%", "cpu", "3333", "mining"] },
      { point: "C: Effect on attack and IT staff", points: 1, lookFor: "Explains the external IP would now fall through to the deny rule (Rule 3) so the attack is blocked, while IT staff on 10.20.0.0/24 could still use RDP.", keywords: ["blocked", "deny", "rule 3", "10.20.0.0", "it office"] },
      { point: "D: Permissions issue", points: 1, lookFor: "Identifies Everyone: Full Control on startup_scripts and explains an attacker or patron could add a malicious script that runs at startup (persistence).", keywords: ["full control", "startup", "everyone", "script", "persist"] },
      { point: "E: Prioritized mitigations with justification", points: 2, lookFor: "Gives two reasonable mitigations (e.g., remove kiosk from administrators, restrict RDP, change the old password and enable lockout, remove coinminer/reimage, fix startup_scripts permissions) and justifies the order (e.g., stop active compromise or close the exposed entry point first).", keywords: ["first", "because", "remove", "restrict", "reset", "lockout", "reimage"] }
    ],
    checklist: ["Every claim cites a source.", "I answered all five parts with labels A-E.", "I explained effects on both attackers and legitimate users in part C."],
    tip: "Label each part (A, B, C...) and cite sources by number. Readers score each part separately, and uncited claims often earn no credit.",
    solution: "A: (1) Source 3 shows the kiosk account is in the administrators group, violating policy item 3. (2) Source 2 Rule 2 allows RDP from any address, violating item 4 that remote administration must come only from 10.20.0.0/24.\nB: An RDP brute-force attack from 185.220.101.7: Source 4 shows 214 failed logons in under five minutes, then a success at 21:44:51 and installation of coinminer.exe. Source 6 shows CPU jumping from 12% to 98% and new outbound traffic to port 3333, consistent with cryptomining.\nC: Traffic from 185.220.101.7 would not match the new Rule 2 and would hit Rule 3 (deny), blocking the attack. IT staff on 10.20.0.0/24 still match Rule 2 and can use RDP.\nD: Source 5 gives Everyone Full Control of startup_scripts, so any user (or the attacker) could add a script that runs each time the kiosk starts, keeping malware running even after removal.\nE: First, isolate and reimage the kiosk (or remove coinminer) and reset credentials, because it is actively compromised. Second, remove the kiosk account from administrators and restrict RDP to the IT network, to close the entry point and limit future damage."
  },
  {
    id: "cyber-frq-2",
    category: "Device Security Analysis",
    title: "Teacher Laptop with a Shared Drive",
    prompt: "A teacher's laptop connects to the school's network and stores student grade files. The school's security team is reviewing the laptop after a student claimed to have 'seen everyone's grades.' Use the sources to answer every part, citing evidence.",
    sources: [
      { title: "Source 1: School Data Policy (excerpt)", content: "1. Student grades are CONFIDENTIAL and may only be accessed by the assigned teacher and administrators.\n2. Devices storing confidential data must use full-disk encryption.\n3. File shares containing confidential data must not be accessible to student accounts." },
      { title: "Source 2: Laptop settings report", content: "Full-disk encryption: OFF\nScreen lock after inactivity: 60 minutes\nOS updates: last installed 2026-03-14 (8 months ago)" },
      { title: "Source 3: Shared folder permissions — \\\\TCH-LAPTOP-12\\Grades", content: "Administrators   Full Control\nMs.Rivera        Full Control\nAll_Students     Read" },
      { title: "Source 4: File access log", content: "Nov 4 10:12  student_jdoe  READ  Grades\\Period3.xlsx\nNov 4 10:12  student_jdoe  READ  Grades\\Period4.xlsx\nNov 4 10:13  student_jdoe  READ  Grades\\Period5.xlsx\nNov 4 10:15  student_jdoe  COPY  Grades\\* -> USB drive E:" },
      { title: "Source 5: Laptop host firewall", content: "Inbound File and Printer Sharing (SMB, port 445): ALLOWED from Student VLAN 10.50.0.0/16\nInbound File and Printer Sharing (SMB, port 445): ALLOWED from Staff VLAN 10.40.0.0/16" },
      { title: "Source 6: Classroom schedule", content: "Nov 4, 10:00-10:45: Ms. Rivera teaching Period 3 in Room 204 (laptop connected to projector)" }
    ],
    parts: [
      { label: "A", text: "Identify which security goal of the CIA triad was violated and cite the evidence." },
      { label: "B", text: "Explain how the student was able to access the grade files. Your answer must use at least two sources." },
      { label: "C", text: "Describe how removing the All_Students permission (Source 3) and blocking SMB from the Student VLAN (Source 5) would affect students, Ms. Rivera, and administrators." },
      { label: "D", text: "Identify one risk in Source 2 that was not part of this incident and explain how it could lead to a future incident." }
    ],
    rubric: [
      { point: "A: Confidentiality with evidence", points: 1, lookFor: "Identifies confidentiality, citing Source 4 (student_jdoe read/copied grades) and/or Source 1 (grades are confidential).", keywords: ["confidentiality", "source 4", "student_jdoe", "read"] },
      { point: "B: Share permission enabled access", points: 1, lookFor: "Cites Source 3: All_Students has Read permission on the Grades share, violating policy item 3.", keywords: ["all_students", "read", "source 3", "share"] },
      { point: "B: Network path enabled access", points: 1, lookFor: "Cites Source 5: SMB port 445 is allowed from the Student VLAN, so student devices could reach the share.", keywords: ["445", "smb", "student vlan", "10.50", "source 5"] },
      { point: "C: Effect on students", points: 1, lookFor: "Students would no longer be able to reach or read the share.", keywords: ["students", "no longer", "cannot", "blocked"] },
      { point: "C: Effect on teacher and admins", points: 1, lookFor: "Ms. Rivera and administrators keep access (their permissions remain; staff VLAN still allowed).", keywords: ["rivera", "administrators", "still", "staff vlan"] },
      { point: "D: Additional risk and consequence", points: 2, lookFor: "Identifies a Source 2 risk (encryption off, 60-minute screen lock, outdated OS) and explains a realistic future incident (stolen laptop data readable; unattended unlocked laptop; exploited unpatched vulnerability).", keywords: ["encryption", "stolen", "screen lock", "unattended", "updates", "patch", "vulnerab"] }
    ],
    checklist: ["I named the CIA goal.", "Part B uses two sources.", "Part C covers all three groups of users."],
    tip: "When a question asks how a change affects users, address each group named in the question separately.",
    solution: "A: Confidentiality. Source 1 says grades are confidential, and Source 4 shows student_jdoe reading and copying grade files to a USB drive.\nB: Source 3 grants All_Students Read access to the Grades share, and Source 5 allows SMB (port 445) from the Student VLAN, so a student device could connect and read the files. Source 6 shows the laptop was on the network in class at that time.\nC: Students could no longer connect to or read the share. Ms. Rivera and administrators keep Full Control, and staff devices can still reach the share over the Staff VLAN, so their work is unaffected.\nD: Source 2 shows full-disk encryption is off, violating policy item 2. If the laptop were lost or stolen, anyone could remove the drive and read all grade files. (Also acceptable: 8-month-old updates leave known vulnerabilities; a 60-minute screen lock lets anyone use an unattended laptop.)"
  },
  {
    id: "cyber-frq-3",
    category: "Device Security Analysis",
    title: "Smart Thermostat on a Small Office Network",
    prompt: "A small dental office installed a smart thermostat on its office network. Soon afterward, the office's internet became slow and the router logged unusual traffic. Use the sources to answer every part, citing evidence.",
    sources: [
      { title: "Source 1: Office IT checklist", content: "1. Change default passwords on all new devices.\n2. Place IoT devices on the separate 'IoT' network, not the 'Office' network.\n3. Keep device firmware up to date." },
      { title: "Source 2: Thermostat device page", content: "Model: HT-200   Firmware: 1.0.2 (latest is 1.4.0, fixes remote-login vulnerability)\nAdmin login: admin / admin (default)\nTelnet service: ENABLED" },
      { title: "Source 3: Router DHCP leases", content: "192.168.1.20  front-desk-pc   Office network\n192.168.1.21  xray-server     Office network\n192.168.1.35  HT-200-thermo   Office network" },
      { title: "Source 4: Router traffic log", content: "02:14  198.51.100.77 -> 192.168.1.35:23   Telnet login success\n02:16  192.168.1.35 -> 192.168.1.21:445  SMB connection attempts (x340)\n02:30  192.168.1.35 -> 203.0.113.0/24   UDP flood, 40 Mbps outbound" },
      { title: "Source 5: Router port forwarding", content: "External port 2323 -> 192.168.1.35:23 (added by device via UPnP)" },
      { title: "Source 6: ISP notice", content: "Your connection was observed participating in a denial-of-service attack against a third party on Nov 15 at 02:30." }
    ],
    parts: [
      { label: "A", text: "Identify two items from the IT checklist (Source 1) that were not followed. Cite the evidence for each." },
      { label: "B", text: "Using Sources 4, 5, and 6, describe the sequence of the attack." },
      { label: "C", text: "Explain why the thermostat being on the Office network increased the risk to patient data." },
      { label: "D", text: "Describe how disabling Telnet and removing the port forwarding rule would affect the attacker and the office staff." }
    ],
    rubric: [
      { point: "A: Unfollowed item 1 with evidence", points: 1, lookFor: "Default admin/admin password still in use (Source 2) violates item 1.", keywords: ["default", "admin", "password", "source 2"] },
      { point: "A: Unfollowed item 2 with evidence", points: 1, lookFor: "Thermostat is on the Office network (Source 3) instead of the IoT network, violating item 2; or firmware 1.0.2 is outdated, violating item 3.", keywords: ["office network", "source 3", "firmware", "1.0.2", "iot network"] },
      { point: "B: Initial access", points: 1, lookFor: "Attacker at 198.51.100.77 logged in over Telnet (port 23), reachable via the UPnP port forward 2323 -> 23 (Source 5).", keywords: ["telnet", "198.51.100.77", "2323", "port forward", "upnp"] },
      { point: "B: Lateral movement and DDoS", points: 1, lookFor: "Thermostat then attempted SMB connections to the x-ray server (192.168.1.21) and participated in a UDP flood/DoS confirmed by the ISP notice.", keywords: ["smb", "445", "xray", "192.168.1.21", "flood", "dos", "isp"] },
      { point: "C: Segmentation reasoning", points: 1, lookFor: "Explains that sharing a network let the compromised thermostat reach the x-ray server holding patient data (lateral movement); segmentation would have blocked it.", keywords: ["same network", "lateral", "xray", "patient", "segment"] },
      { point: "D: Effect on attacker", points: 1, lookFor: "The attacker can no longer reach the thermostat's Telnet service from the internet.", keywords: ["cannot", "no longer", "block", "telnet", "external"] },
      { point: "D: Effect on staff", points: 1, lookFor: "Staff can still use the thermostat normally (app/local control); there is little or no impact because Telnet was not needed.", keywords: ["staff", "still", "normal", "not needed", "no impact"] }
    ],
    checklist: ["I cited a source for every claim.", "I described the attack in time order.", "Part D covers both the attacker and staff."],
    tip: "For attack-sequence questions, list events in timestamp order: initial access → what the attacker did inside → impact.",
    solution: "A: (1) Source 2 shows the admin login is still the default admin/admin, violating item 1. (2) Source 3 shows the thermostat (192.168.1.35) on the Office network, violating item 2. (Firmware 1.0.2 vs 1.4.0 also violates item 3.)\nB: The thermostat used UPnP to forward external port 2323 to its Telnet port (Source 5). At 02:14 an attacker at 198.51.100.77 logged in over Telnet (Source 4), likely with the default password. At 02:16 the thermostat made 340 SMB attempts against the x-ray server, then at 02:30 it sent a 40 Mbps UDP flood, which the ISP reported as participation in a DoS attack (Source 6).\nC: Because it shared the Office network with the x-ray server (Source 3), the compromised thermostat could directly attempt connections to the server holding patient data. On a separate IoT network, those connections would have been blocked.\nD: The attacker could no longer reach the thermostat from the internet, since there would be no forwarded port or Telnet service. Staff would see no change, because they control the thermostat through its normal app or panel, not Telnet."
  }  ,
  {
    id: "cyber-frq-4",
    category: "Device Security Analysis",
    title: "Student Phone and a Hijacked School Account",
    prompt: "A student's school account sent messages to the whole class asking for gift cards. The student says they never sent them. The district security team collected the sources below about the student's phone and account. Use the sources to answer every part, citing evidence (for example, 'Source 3, line 2').",
    sources: [
      { title: "Source 1: District account policy (excerpt)", content: "1. All student accounts must use multi-factor authentication (MFA).\n2. Passwords must be at least 12 characters and not reused on other sites.\n3. Apps may only be installed from the official app store." },
      { title: "Source 2: Email the student received (Oct 3, 7:52 PM)", content: "From: IT-Help <support@schooI-helpdesk.net>\nSubject: URGENT: your account will be deleted tonight\nClick here to keep your account: http://schooI-helpdesk.net/login\n(The link's 'l' in 'school' is a capital I.)" },
      { title: "Source 3: Account sign-in log", content: "Oct 3 7:54 PM  sign-in success  device: student phone   location: home\nOct 3 7:58 PM  sign-in success  device: Windows PC     location: overseas\nOct 3 7:59 PM  MFA: not enabled for this account\nOct 3 8:05 PM  mail rule created: forward all mail to x9mail@proton.example" },
      { title: "Source 4: Password check", content: "Password length: 9 characters\nSame password found in a 2025 breach of a gaming website" },
      { title: "Source 5: Phone settings", content: "Screen lock: 4-digit PIN\nOS version: 2 versions behind\nInstalled from outside the app store: 'FreeSkins.apk'" },
      { title: "Source 6: Messages sent from the account", content: "Oct 3 8:10 PM to 31 classmates: 'Can you buy me a $50 gift card? I'll pay you back tomorrow.'" }
    ],
    parts: [
      { label: "A", text: "Name the attack shown in Source 2 and give two clues from Source 2 that the email is not real." },
      { label: "B", text: "Using Sources 3 and 4, explain how the attacker most likely got into the account and why they did not need the student's phone." },
      { label: "C", text: "Explain what the mail rule in Source 3 lets the attacker do, even after the password is changed." },
      { label: "D", text: "Identify two ways the account or phone breaks the district policy in Source 1, citing a source for each." },
      { label: "E", text: "Recommend two actions, in priority order, and justify the order." }
    ],
    rubric: [
      { point: "A: Names phishing with two clues", points: 2, lookFor: "Names phishing and gives two clues from Source 2: look-alike domain (capital I instead of l, not the school's real domain), urgent threat, request to log in through a link, unofficial sender.", keywords: ["phishing", "domain", "urgent", "link", "look-alike", "capital i"] },
      { point: "B: How the attacker got in", points: 1, lookFor: "Explains the student entered their password on the fake page (sign-in at 7:54 right after the 7:52 email), and/or the password was reused from a breach (Source 4).", keywords: ["7:54", "entered", "fake", "breach", "reused"] },
      { point: "B: Why the phone wasn't needed", points: 1, lookFor: "Cites Source 3: MFA was not enabled, so the password alone let the overseas PC sign in at 7:58.", keywords: ["mfa", "not enabled", "7:58", "overseas", "password alone"] },
      { point: "C: Effect of the mail rule", points: 1, lookFor: "Explains the forwarding rule keeps sending the student's mail (including password reset emails) to the attacker even after a password change, until the rule is removed.", keywords: ["forward", "rule", "reset", "still", "copy"] },
      { point: "D: Two policy violations with sources", points: 2, lookFor: "Two of: no MFA (Source 3, item 1); 9-character password reused from a breach (Source 4, item 2); app installed from outside the store (Source 5, item 3).", keywords: ["mfa", "9 characters", "reused", "apk", "outside the app store", "source 5"] },
      { point: "E: Prioritized actions with justification", points: 1, lookFor: "Two sensible actions in order with a reason (e.g., first reset the password, sign out all sessions and delete the forwarding rule to stop active access; then turn on MFA, remove the APK and update the phone).", keywords: ["first", "because", "reset", "rule", "mfa", "sign out"] }
    ],
    checklist: ["I named the attack in part A.", "Part B uses both Source 3 and Source 4.", "Part E says why the first action comes first."],
    tip: "Timestamps tell the story. Put the email, the first sign-in and the attacker's sign-in in order, and the cause usually becomes clear.",
    solution: "A: Phishing. Clues: the sender's domain schooI-helpdesk.net uses a capital I in place of an l and isn't the school's domain; the message uses urgency ('deleted tonight') to rush the student into clicking a login link.\nB: Two minutes after the email, the student signed in from their phone (7:54, Source 3), most likely on the fake page, giving the attacker the password. Source 4 shows the same password was also leaked in a gaming-site breach. Because MFA was not enabled (Source 3, 7:59), the attacker's overseas PC could sign in at 7:58 with just the password, no phone needed.\nC: The rule forwards every email to x9mail@proton.example. Even after a password change, the attacker would keep receiving the student's mail, including password-reset messages, and could use them to take the account back.\nD: (1) MFA is not enabled (Source 3), breaking item 1. (2) The password is 9 characters and reused from a breach (Source 4), breaking item 2. (Also: FreeSkins.apk was installed from outside the app store, Source 5, breaking item 3.)\nE: First, reset the password, sign out all sessions and delete the forwarding rule, because the attacker still has access and is using it. Second, turn on MFA and remove the unofficial app, so a stolen password alone can't be used again."
  },
  {
    id: "cyber-frq-5",
    category: "Device Security Analysis",
    title: "Clinic Appointment Web Server",
    prompt: "A small clinic runs a web server where patients book appointments. A patient reported seeing someone else's appointment details on the site. Use the sources to answer every part, citing evidence.",
    sources: [
      { title: "Source 1: Clinic security requirements (excerpt)", content: "1. Patient records may only be viewed by the patient and clinic staff.\n2. All website traffic must use HTTPS.\n3. The admin panel must only be reachable from the clinic office network (172.16.5.0/24).\n4. Software must be patched within 30 days of a security update." },
      { title: "Source 2: Web server access log (Nov 20)", content: "09:14:02  203.0.113.45  GET /appointment?id=1041   200  (user: pat_lee)\n09:14:09  203.0.113.45  GET /appointment?id=1042   200  (user: pat_lee)\n09:14:11  203.0.113.45  GET /appointment?id=1043   200  (user: pat_lee)\n... 600 more requests with increasing id ...\n09:31:40  203.0.113.45  GET /admin/login           200" },
      { title: "Source 3: Code that shows an appointment", content: "appt = database.find(request.id)\nshow(appt)\n// no check that appt.patient == current_user" },
      { title: "Source 4: Server configuration", content: "HTTP (port 80): enabled, does not redirect to HTTPS\nHTTPS (port 443): enabled\nAdmin panel (/admin): reachable from any address" },
      { title: "Source 5: Installed software", content: "Booking plugin version 2.3.1\nVendor notice (Sep 1): version 2.3.4 fixes a login bypass in /admin" }
    ],
    parts: [
      { label: "A", text: "Using Sources 2 and 3, explain how the user at 203.0.113.45 was able to see other patients' appointments." },
      { label: "B", text: "Identify which goal of the CIA triad was violated, and cite Source 1 to show why it matters." },
      { label: "C", text: "Identify two other ways the server breaks the clinic's requirements, citing a source for each." },
      { label: "D", text: "Explain why the request at 09:31:40 is a concern, using Sources 4 and 5." },
      { label: "E", text: "Describe one change to the code in Source 3 that would stop the problem in Part A, and explain how it would affect patients and staff." }
    ],
    rubric: [
      { point: "A: Explains the access problem", points: 2, lookFor: "Explains the user changed the id number in the URL to request other appointments (Source 2: increasing ids, all 200 OK) and the server returned them because the code never checks the appointment belongs to the signed-in user (Source 3).", keywords: ["id", "increasing", "url", "no check", "current_user", "200"] },
      { point: "B: Confidentiality with source", points: 1, lookFor: "Names confidentiality and cites Source 1 item 1 (only the patient and staff may view records).", keywords: ["confidentiality", "source 1", "item 1", "only the patient"] },
      { point: "C: Two other requirement violations", points: 2, lookFor: "Two of: HTTP not redirected to HTTPS (Source 4, item 2); admin panel reachable from any address (Source 4, item 3); plugin 2.3.1 not patched though a fix came out Sep 1 (Source 5, item 4).", keywords: ["http", "https", "admin", "any address", "2.3.1", "patch", "30 days"] },
      { point: "D: Why the admin request matters", points: 1, lookFor: "Explains the same outside user reached /admin, which is open to any address (Source 4) and runs a plugin with a known login bypass (Source 5), so they may be able to get admin access.", keywords: ["admin", "login bypass", "2.3.4", "any address", "same"] },
      { point: "E: Code fix and effects", points: 2, lookFor: "Adds a check that the appointment's patient matches the signed-in user (or that the user is staff) before showing it; patients see only their own, staff still see all.", keywords: ["check", "patient ==", "current_user", "staff", "only their own"] }
    ],
    checklist: ["Part A uses both Source 2 and Source 3.", "I named the CIA goal.", "Part E covers patients and staff."],
    tip: "When a log shows the same request with a number going up by one, think about what the server should have checked before answering.",
    solution: "A: Source 2 shows pat_lee requesting /appointment?id=1041, 1042, 1043 and 600 more, each returning 200 OK. Source 3 shows the server finds the appointment by id and shows it without checking that it belongs to the signed-in user, so changing the number in the URL showed other patients' appointments.\nB: Confidentiality. Source 1 item 1 says patient records may only be viewed by the patient and clinic staff, and pat_lee saw hundreds of other patients' records.\nC: (1) Source 4 shows HTTP is enabled and does not redirect to HTTPS, breaking item 2. (2) Source 4 shows /admin is reachable from any address, breaking item 3. (Also: Source 5 shows plugin 2.3.1 is still installed more than 30 days after the Sep 1 fix, breaking item 4.)\nD: The same outside address then loaded /admin/login. The admin panel is open to anyone (Source 4) and the old plugin has a known login bypass in /admin (Source 5), so the attacker may be able to get full admin control.\nE: After finding the appointment, check that appt.patient equals the current user, or that the user is clinic staff, and refuse the request otherwise. Patients could still see their own appointments; staff could still see every appointment; changing the id would no longer show anyone else's."
  },
  {
    id: "cyber-frq-6",
    category: "Device Security Analysis",
    title: "Ransomware on a Small Office File Server",
    prompt: "An accounting office arrived on Monday to find every file on its shared file server renamed with a .locked extension and a note demanding payment. Use the sources to answer every part, citing evidence.",
    sources: [
      { title: "Source 1: Office backup and access plan (excerpt)", content: "1. Back up the file server every night to a drive that is disconnected afterward.\n2. Keep one backup copy off site.\n3. Staff accounts must not have administrator rights on the file server." },
      { title: "Source 2: Email gateway log (Friday)", content: "16:41  From: invoices@paymnts.example  To: j.park  Attachment: Invoice_4471.xlsm (macros)\n16:41  Scan result: no known virus  Delivered" },
      { title: "Source 3: j.park workstation events (Friday)", content: "16:47  Excel opened Invoice_4471.xlsm, macros enabled\n16:47  PowerShell started by Excel\n16:48  Connection to 192.0.2.88:443 (unknown server)\n17:30  j.park logs off; PC left powered on" },
      { title: "Source 4: File server events (Saturday)", content: "02:05  Sign-in: j.park (member of Administrators)\n02:06  Backup drive B: still connected; files deleted\n02:10 - 03:40  41,220 files renamed to *.locked" },
      { title: "Source 5: Backup status", content: "Nightly backup to drive B: last success Friday 23:00\nDrive B: connected at all times\nOff-site copy: none" }
    ],
    parts: [
      { label: "A", text: "Using Sources 2 and 3, describe how the attacker first got code running in the office." },
      { label: "B", text: "Explain how the attacker was able to encrypt files on the server, citing Source 4 and Source 1." },
      { label: "C", text: "Explain why the office can't simply restore its files from backup, using Sources 4 and 5." },
      { label: "D", text: "Recommend two changes, in priority order, that would have limited the damage, and justify the order." }
    ],
    rubric: [
      { point: "A: Initial access", points: 2, lookFor: "Explains a phishing email delivered a macro-enabled attachment (Source 2) that j.park opened with macros enabled, which started PowerShell and contacted an unknown server (Source 3).", keywords: ["macro", "xlsm", "enabled", "powershell", "192.0.2.88", "phishing", "attachment"] },
      { point: "B: Privileges let it reach the server", points: 2, lookFor: "Cites Source 4: the attacker signed in as j.park, who is in Administrators, and notes this breaks Source 1 item 3, so they could change every file on the server.", keywords: ["administrators", "j.park", "item 3", "admin rights", "02:05"] },
      { point: "C: Why the backup failed", points: 2, lookFor: "Explains the backup drive stayed connected (Sources 4 and 5) so the attacker deleted it at 02:06, and there is no off-site copy (Source 5), breaking items 1 and 2.", keywords: ["connected", "deleted", "off-site", "none", "item 1", "item 2"] },
      { point: "D: Prioritized changes with justification", points: 2, lookFor: "Two reasonable changes (disconnected or off-site backups, remove admin rights from staff, block macros from email, endpoint monitoring) with a reason for the order, such as backups first because they make recovery possible whatever the entry point.", keywords: ["first", "because", "backup", "off-site", "disconnect", "admin", "macro"] }
    ],
    checklist: ["I put the events in time order.", "I linked each problem to a numbered item in Source 1.", "Part D says why the first change comes first."],
    tip: "In ransomware questions, the graders look for three stages: how it got in, how it spread or gained rights, and why recovery failed.",
    solution: "A: On Friday at 16:41, j.park received an email with a macro-enabled spreadsheet, Invoice_4471.xlsm, which the scanner didn't flag (Source 2). At 16:47 j.park opened it with macros enabled; Excel started PowerShell, which connected to an unknown server at 192.0.2.88 (Source 3), giving the attacker code running on the PC.\nB: At 02:05 Saturday the attacker signed in to the server as j.park, who is a member of Administrators (Source 4). Source 1 item 3 says staff must not have admin rights; because j.park did, the attacker could rename and encrypt all 41,220 files.\nC: Source 5 shows backup drive B is connected at all times, so at 02:06 the attacker deleted the backup files (Source 4). There is no off-site copy (Source 5), so no clean copy is left. This breaks items 1 and 2 of Source 1.\nD: First, keep backups disconnected and off site, because that guarantees recovery no matter how an attacker gets in. Second, remove administrator rights from staff accounts, so a single compromised user can't reach every file on the server."
  }

];
