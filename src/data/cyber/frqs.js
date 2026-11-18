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
  }
];
