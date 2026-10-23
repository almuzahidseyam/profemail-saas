import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
export default function Home() {
  return (
    <main className="home-page">
      <div className="lab-eyebrow">
        <span className="status-dot" /> A LITTLE CLARITY FOR WHAT COMES NEXT
      </div>
      <h1>
        Your work deserves
        <br />
        <span>a clear introduction.</span>
      </h1>
      <p className="home-intro">
        Make your CV easier to understand. Explore your next research
        opportunity. Keep control of what you share.
      </p>
      <div className="home-cards">
        <section className="panel home-card">
          <div className="home-icon">
            <FileCheck2 size={27} />
          </div>
          <span className="tiny-tag">BROWSER-LOCAL · FREE</span>
          <h2>Meet your stronger CV.</h2>
          <p>
            Software or academic, get specific feedback with evidence behind
            every check. Read PDF, DOCX or text, compare job keywords, and take
            your review with you.
          </p>
          <Link className="primary" href="/resume-checker">
            Open Resume Lab <ArrowRight size={17} />
          </Link>
          <small>
            <ShieldCheck size={13} />
            Your CV is processed in your browser.
          </small>
        </section>
        <section className="panel home-card outreach-card">
          <div className="home-icon">
            <FlaskConical size={27} />
          </div>
          <span className="tiny-tag">OPTIONAL · CLOUD AI</span>
          <h2>Start a research conversation.</h2>
          <p>
            Use the existing Gemini-powered workspace to suggest potential PhD
            supervisors and draft outreach emails. Verify every professor,
            address and research claim yourself.
          </p>
          <Link className="secondary" href="/dashboard">
            Explore PhD outreach <ArrowRight size={17} />
          </Link>
          <small>
            Separate workflow: your PDF is sent to Gemini with consent. Requires
            configured server access.
          </small>
        </section>
      </div>
      <footer className="home-footer">
        <Link href="/privacy">Privacy, plainly explained</Link>
        <span>Useful feedback. No fabricated credentials.</span>
        <Link href="/methodology">How the checks work</Link>
      </footer>
    </main>
  );
}
