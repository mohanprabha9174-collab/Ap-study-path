import { navigate } from "../App.jsx";

const UPDATED = "November 27, 2026";
const EMAIL = "mohanprabha9174@gmail.com";

function Contact() {
  return <>email <a href={`mailto:${EMAIL}`}>{EMAIL}</a></>;
}

export function PrivacyPage() {
  return (
    <section className="page legal-page">
      <div className="card legal-card">
        <h1>Privacy policy</h1>
        <p className="muted">Last updated {UPDATED}</p>
        <p>AP Study Path is a free study site. It collects only what it needs to save your practice, and it never sells your information or shows ads.</p>

        <h2>Who can use it</h2>
        <p>You can practice as a guest at any age. <strong>You must be 13 or older to create an account.</strong> If you're under 13, keep practicing as a guest, which stores nothing on our server. If we learn that an account belongs to someone under 13, we delete it.</p>

        <h2>What we store</h2>
        <ul>
          <li><strong>As a guest:</strong> nothing on our server. Your progress stays in your own browser's storage until you clear it.</li>
          <li><strong>With an account:</strong> your email, an optional first name, your password stored only as a secure one-way hash (we can't read it), a hashed recovery code, your exam progress and scores, and the FRQ answers you grade with their scores and feedback.</li>
          <li><strong>AI usage counts:</strong> how many AI grades and helper messages you used each day, so the daily limits work. We don't keep the text of your AI helper conversations on our server.</li>
        </ul>
        <p>We don't use cookies or advertising or analytics trackers. Your sign-in is kept in your browser's local storage.</p>

        <h2>Who processes it</h2>
        <ul>
          <li><strong>Render</strong> runs the website (in the United States) and <strong>Neon</strong> hosts the database.</li>
          <li><strong>Anthropic (Claude)</strong> receives the text you send when you use AI grading or the AI helper (your answer, the question, and any project files you upload), so it can respond. Don't include your full name or other personal details in answers or uploads.</li>
        </ul>

        <h2>Your choices</h2>
        <ul>
          <li><strong>Download your data</strong> or <strong>delete your account</strong> any time on My Progress. Deleting removes your account and everything saved with it from our database right away.</li>
          <li>We keep your data until you delete your account.</li>
          <li>Questions or requests: <Contact />.</li>
        </ul>

        <h2>Security</h2>
        <p>Connections use HTTPS, passwords are hashed with scrypt, sign-ins expire, and changing your password signs out your other devices. No system is perfectly secure, so use a password you don't use anywhere else.</p>

        <h2>Changes</h2>
        <p>If this policy changes, the date above changes too. Big changes will be noted on the site.</p>
      </div>
    </section>
  );
}

export function TermsPage() {
  return (
    <section className="page legal-page">
      <div className="card legal-card">
        <h1>Terms of use</h1>
        <p className="muted">Last updated {UPDATED}</p>

        <h2>The basics</h2>
        <p>AP Study Path is a free practice site for AP Computer Science Principles, AP Computer Science A and AP Cybersecurity. By using it you agree to these terms. You must be 13 or older to create an account.</p>

        <h2>Not affiliated with the College Board</h2>
        <p>AP® and Advanced Placement® are trademarks registered by the College Board, which is not affiliated with and does not endorse this site. The practice questions, FRQs, notes and tips here are original material written for this site; they are not real or released AP exam questions.</p>

        <h2>Practice only</h2>
        <p>Scores, rubric estimates and AI feedback are study aids. They don't predict your real AP score. AI can make mistakes, so check important answers against your class notes. Don't use this site to cheat on a live exam or a graded assignment.</p>

        <h2>Your account</h2>
        <ul>
          <li>Keep your password and recovery code private. You're responsible for what happens in your account.</li>
          <li>Don't try to break, overload or get around the limits of the site, access other people's accounts, or use automated tools to send lots of requests.</li>
          <li>Don't upload anything you don't have the right to share, or anything harmful or inappropriate.</li>
          <li>We may suspend accounts that break these rules.</li>
        </ul>

        <h2>Your work</h2>
        <p>Your answers and uploaded projects stay yours. You let us store and process them only to run the site for you (saving them and grading them).</p>

        <h2>No warranty</h2>
        <p>The site is provided free and "as is". It may change, have errors or be unavailable, and features like AI grading have daily limits. To the extent the law allows, the site's owner isn't liable for losses from using it.</p>

        <h2>Contact</h2>
        <p>Questions: <Contact />. See also the <button className="link-btn inline" onClick={() => navigate("/privacy")}>privacy policy</button>.</p>
      </div>
    </section>
  );
}
