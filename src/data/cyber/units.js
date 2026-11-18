export const cyberUnits = [
  {
    id: 1,
    name: "Introduction to Security",
    color: "blue",
    overview: "The vocabulary and thinking of a security analyst: assets, threats, vulnerabilities, risk, the CIA triad, control types, and social engineering.",
    topics: [
      { id: "cy-u1-t1", name: "The CIA triad", paragraphs: [
        "Confidentiality means only authorized people can see information. Integrity means information is accurate and has not been changed without authorization. Availability means systems and data are accessible when authorized users need them.",
        "Most attacks can be classified by which goal they hurt: data leaks hurt confidentiality, tampering hurts integrity, and outages or ransomware hurt availability. Many incidents affect more than one.",
        "Related goals include authentication (proving identity), authorization (what an identity may do), and non-repudiation (someone cannot deny an action, supported by digital signatures and logs)."
      ] },
      { id: "cy-u1-t2", name: "Assets, threats, vulnerabilities, and risk", paragraphs: [
        "An asset is anything valuable: data, devices, people, reputation. A vulnerability is a weakness. A threat is a person or event that could exploit a vulnerability. Risk is the combination of how likely a threat is to exploit a vulnerability and how bad the impact would be.",
        "Risk assessment starts with an asset inventory, then identifies threats and vulnerabilities and rates likelihood and impact. Organizations respond to each risk by mitigating, transferring, avoiding, or accepting it.",
        "Threat actors differ in motivation and skill: cybercriminals (money), hacktivists (causes), nation-states (espionage), insiders (access they already have), and unskilled attackers using existing tools."
      ] },
      { id: "cy-u1-t3", name: "Security controls and defense in depth", paragraphs: [
        "Controls can be grouped by category (administrative/managerial like policies and training, technical like firewalls and encryption, physical like locks) and by function (preventive, detective, deterrent, corrective).",
        "Defense in depth layers multiple controls so that a single failure does not lead to a breach. Least privilege limits each account to only what it needs."
      ] },
      { id: "cy-u1-t4", name: "Social engineering", paragraphs: [
        "Social engineering manipulates people instead of technology. Common forms are phishing (mass deceptive messages), spear phishing (targeted), whaling (targeting executives), vishing (phone), smishing (text), pretexting (a made-up story), and baiting (infected USB drives).",
        "Warning signs include urgency, requests for credentials or payments, mismatched sender addresses, and unexpected attachments. Training and verification through a separate channel are the main defenses."
      ] }
    ]
  },
  {
    id: 2,
    name: "Securing Spaces",
    color: "teal",
    overview: "Physical security: protecting buildings, rooms, and equipment with barriers, access control, monitoring, and environmental controls.",
    topics: [
      { id: "cy-u2-t1", name: "Physical access control", paragraphs: [
        "Barriers (fences, bollards, locked doors) and access control (badges, PINs, biometrics, guards) decide who can enter. Access control vestibules stop tailgating by admitting one person at a time.",
        "Biometrics can make two errors: false acceptance (letting the wrong person in, the more dangerous error) and false rejection (blocking the right person)."
      ] },
      { id: "cy-u2-t2", name: "Monitoring and detection", paragraphs: [
        "Cameras, alarms, motion sensors, and badge logs detect physical intrusions. Visible cameras also deter. Badge logs reveal suspicious patterns like after-hours entry or impossible travel between locations.",
        "Visitor management (sign-in, badges, escorts) ensures every person in a facility is accounted for."
      ] },
      { id: "cy-u2-t3", name: "Workspace and environmental protection", paragraphs: [
        "Clean desk policies, privacy screens, and document shredding defend against shoulder surfing and dumpster diving.",
        "Server rooms need restricted access, interior locations, climate control, clean-agent fire suppression, and backup power (UPS and generators) to protect availability."
      ] }
    ]
  },
  {
    id: 3,
    name: "Securing Networks",
    color: "purple",
    overview: "How data moves across networks and how to protect it: protocols and ports, firewalls, segmentation, wireless security, VPNs, and detecting network attacks.",
    topics: [
      { id: "cy-u3-t1", name: "Ports, protocols, and encryption in transit", paragraphs: [
        "Common ports: 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS, 445 SMB, 3389 RDP. Insecure protocols like Telnet and HTTP send data in plain text; replace them with SSH and HTTPS.",
        "TLS encrypts data in transit. VPNs create an encrypted tunnel across untrusted networks such as public Wi-Fi."
      ] },
      { id: "cy-u3-t2", name: "Firewalls and rule analysis", paragraphs: [
        "Firewalls filter traffic using rules based on source, destination, port, and protocol. Rules are typically checked top to bottom and the first match wins.",
        "A secure rule set allows only what is needed and ends with deny-all. Watch for overly broad rules like ALLOW any any, and for admin services (SSH, RDP) open to the whole Internet."
      ] },
      { id: "cy-u3-t3", name: "Network design", paragraphs: [
        "Segmentation (VLANs, separate guest and IoT networks) limits lateral movement. A DMZ hosts public-facing servers separately from the internal network.",
        "Wireless networks should use WPA3 (or WPA2 at minimum). MAC filtering and hidden SSIDs are weak on their own."
      ] },
      { id: "cy-u3-t4", name: "Network attacks and detection", paragraphs: [
        "Port scans (one source probing many ports), DoS/DDoS (overwhelming a service), on-path attacks (intercepting traffic), DNS spoofing (fake name resolution), and evil twins (rogue access points) are common.",
        "IDS tools alert on suspicious traffic; IPS tools sit inline and can block it. Logs and packet captures are evidence for detecting and investigating attacks."
      ] }
    ]
  },
  {
    id: 4,
    name: "Securing Devices",
    color: "amber",
    overview: "Protecting computers, phones, and IoT devices: hardening, patching, accounts and permissions, malware, encryption at rest, and reading device logs.",
    topics: [
      { id: "cy-u4-t1", name: "Hardening and patching", paragraphs: [
        "Hardening reduces attack surface: disable unneeded services, close ports with a host firewall, change default credentials, and enable Secure Boot.",
        "Patches fix known vulnerabilities. Outdated firmware and operating systems are among the most common ways devices get compromised, especially IoT devices."
      ] },
      { id: "cy-u4-t2", name: "Accounts and file permissions", paragraphs: [
        "Users should work in standard accounts and use admin accounts only when needed. Group memberships determine privileges, so check whether ordinary accounts are in administrator groups.",
        "Linux permissions show owner, group, and others, each with read (4), write (2), execute (1). chmod 640 means owner rw-, group r--, others ---. Windows permissions list users or groups with Read, Modify, or Full Control. 'Everyone: Full Control' on sensitive folders is a red flag."
      ] },
      { id: "cy-u4-t3", name: "Malware", paragraphs: [
        "Viruses attach to files and need user action; worms spread on their own; trojans disguise themselves as useful software; ransomware encrypts files for payment; spyware and keyloggers steal information; rootkits hide deep in the system; botnets are networks of infected devices.",
        "Signature-based antivirus catches known malware; behavior-based tools (EDR) catch suspicious actions like Office documents launching PowerShell."
      ] },
      { id: "cy-u4-t4", name: "Device logs and incident response", paragraphs: [
        "Logs record logins, process launches, installations, and connections. Look for many failed logins followed by a success, unusual times, unknown software, high CPU use, and connections to unfamiliar addresses.",
        "When a device is compromised: isolate it, preserve evidence, remove the threat or reimage, restore from clean backups, and fix the root cause."
      ] }
    ]
  },
  {
    id: 5,
    name: "Securing Applications and Data",
    color: "coral",
    overview: "Protecting software and the data it handles: authentication, web application flaws, cryptography, hashing, backups, and data classification.",
    topics: [
      { id: "cy-u5-t1", name: "Authentication and access control", paragraphs: [
        "Authentication factors are something you know (password), have (phone, key), and are (fingerprint). MFA combines at least two different categories.",
        "Applications must check authorization on the server for every request. Changing an ID in a URL to see someone else's data is broken access control."
      ] },
      { id: "cy-u5-t2", name: "Web application vulnerabilities", paragraphs: [
        "SQL injection inserts code into database queries; fix it with parameterized queries. Cross-site scripting (XSS) injects scripts into pages viewed by others; fix it with output encoding and input validation.",
        "Client-side validation improves usability, but only server-side validation provides security."
      ] },
      { id: "cy-u5-t3", name: "Cryptography and hashing", paragraphs: [
        "Symmetric encryption uses one shared key and is fast. Asymmetric encryption uses a public/private key pair: encrypt with the recipient's public key for confidentiality, sign with your private key for authenticity.",
        "Hashing is one-way. Salted password hashes protect stored passwords; file hashes verify integrity. Classical ciphers like Caesar are easy to break and only illustrate the ideas."
      ] },
      { id: "cy-u5-t4", name: "Protecting data", paragraphs: [
        "Data classification (public, internal, confidential, restricted) decides how strongly data is protected. Protect data at rest with encryption and permissions, and in transit with TLS.",
        "Backups following the 3-2-1 rule, plus data loss prevention tools, protect against ransomware and leaks."
      ] }
    ]
  }
];
