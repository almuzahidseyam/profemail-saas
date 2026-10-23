"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  FileCheck2,
  FileText,
  FlaskConical,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  exportReport,
  MAX_TEXT,
  redactContacts,
  reviewResume,
  RUBRIC_VERSION,
  type Language,
  type Review,
  type Target,
} from "@/lib/resume-review";
import { readResume } from "@/lib/read-resume";
import { academicSample, softwareSample } from "@/lib/resume-samples";

type Snapshot = { report: Review; text: string; job: string };
export default function ResumeLab() {
  const [target, setTarget] = useState<Target>("software");
  const [language, setLanguage] = useState<Language>("en");
  const [text, setText] = useState("");
  const [job, setJob] = useState("");
  const [filename, setFilename] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mask, setMask] = useState(true);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [previous, setPrevious] = useState<number | null>(null);
  const sequence = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const reportHeading = useRef<HTMLHeadingElement>(null);
  const t = (en: string, bn: string) => (language === "bn" ? bn : en);
  const report = snapshot?.report;
  const stale =
    !!snapshot &&
    (snapshot.text !== text ||
      snapshot.job !== job ||
      snapshot.report.target !== target);
  const display = (s: string) => (mask ? redactContacts(s) : s);
  async function importFile(file?: File) {
    if (!file) return;
    const current = ++sequence.current;
    setBusy(true);
    setError("");
    setNotice("");
    setSnapshot(null);
    setPrevious(null);
    setText("");
    setFilename("");
    try {
      const parsed = await readResume(file);
      if (current !== sequence.current) return;
      setText(parsed.text);
      setFilename(file.name);
      setNotice(
        [parsed.pages ? `${parsed.pages} pages` : "", parsed.warning]
          .filter(Boolean)
          .join(" · "),
      );
    } catch (err) {
      if (current === sequence.current)
        setError(
          err instanceof Error
            ? err.message
            : "Could not read this file. Try a text-based PDF or paste the text.",
        );
    } finally {
      if (current === sequence.current) setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }
  function analyze() {
    try {
      const next = reviewResume(text, target, job);
      const comparable =
        snapshot && snapshot.report.target === target && snapshot.job === job;
      setPrevious(comparable ? snapshot.report.score : null);
      setSnapshot({ report: next, text, job });
      setError("");
      requestAnimationFrame(() => reportHeading.current?.focus());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not review this text.",
      );
    }
  }
  function reset() {
    sequence.current++;
    setBusy(false);
    setText("");
    setJob("");
    setFilename("");
    setNotice("");
    setError("");
    setSnapshot(null);
    setPrevious(null);
    if (fileInput.current) fileInput.current.value = "";
  }
  function sample() {
    sequence.current++;
    setBusy(false);
    setText(target === "software" ? softwareSample : academicSample);
    setFilename("Fictional sample");
    setSnapshot(null);
    setPrevious(null);
    setError("");
    setNotice(
      "Fictional demonstration data. Replace it with your own CV before a real review.",
    );
  }
  function download() {
    if (!report) return;
    const blob = new Blob([exportReport(report, language, mask)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profemail-resume-review.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <main className="lab-shell">
      <aside className="lab-sidebar no-print">
        <div className="sidebar-caption">YOUR WORKSPACE</div>
        <Link className="side-link selected" href="/resume-checker">
          <FileCheck2 size={18} />
          Resume Lab <span className="tiny-tag">LOCAL</span>
        </Link>
        <Link className="side-link" href="/dashboard">
          <FlaskConical size={18} />
          PhD outreach <ArrowRight size={16} />
        </Link>
        <div className="sidebar-note">
          <ShieldCheck size={23} />
          <strong>Your CV stays with you.</strong>
          <p>
            Resume Lab reads files in your browser. No account, cloud AI or
            upload is needed.
          </p>
          <Link href="/privacy">
            How privacy works <ArrowRight size={14} />
          </Link>
        </div>
        <div className="sidebar-bottom">
          Built for your next chapter.
          <br />
          <span>Rubric {RUBRIC_VERSION} · Open source</span>
        </div>
      </aside>
      <div className="lab-content">
        <div className="lab-eyebrow">
          <span className="status-dot" /> PRIVATE BY DESIGN{" "}
          <span className="eyebrow-line" /> RESUME LAB
        </div>
        <header className="lab-header">
          <div>
            <h1>
              A clearer CV.
              <br />
              <span>A stronger next step.</span>
            </h1>
            <p>
              Understand what works, what needs attention, and exactly why.
              <br className="desktop-break" /> A practical review for your
              career or research journey.
            </p>
          </div>
          <div className="lab-seal">
            <ShieldCheck size={24} />
            <span>
              Processed here.
              <br />
              <strong>Never uploaded.</strong>
            </span>
          </div>
        </header>
        <div className="lab-toolbar no-print">
          <div className="step-label">
            <span>01</span> YOUR DOCUMENT <ArrowRight size={15} />
            <span>02</span> YOUR FEEDBACK
          </div>
          <label className="language-control">
            Feedback{" "}
            <select
              aria-label="Feedback language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
            </select>
          </label>
        </div>
        <div className="lab-grid">
          <section
            className="panel input-panel no-print"
            aria-labelledby="document-title"
          >
            <div className="panel-top">
              <h2 id="document-title">Start with your CV</h2>
              <span className="subtle">No sign-up. No fee.</span>
            </div>
            <fieldset className="target-field">
              <legend>What are you applying for?</legend>
              <div className="target-options">
                {(["software", "academic"] as const).map((value) => (
                  <label
                    key={value}
                    className={
                      target === value ? "target-card active" : "target-card"
                    }
                  >
                    <input
                      type="radio"
                      name="target"
                      value={value}
                      checked={target === value}
                      onChange={() => setTarget(value)}
                    />
                    {value === "software" ? (
                      <FileText size={19} />
                    ) : (
                      <FlaskConical size={19} />
                    )}
                    <strong>
                      {value === "software"
                        ? "Software / industry"
                        : "Academic / research"}
                    </strong>
                    <small>
                      {value === "software"
                        ? "Skills, projects & impact"
                        : "Research, teaching & evidence"}
                    </small>
                  </label>
                ))}
              </div>
            </fieldset>
            <label
              className={`upload-zone ${busy ? "is-busy" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void importFile(e.dataTransfer.files[0]);
              }}
            >
              <input
                ref={fileInput}
                type="file"
                accept=".pdf,.docx,.txt"
                disabled={busy}
                onChange={(e) => void importFile(e.target.files?.[0])}
              />
              <span className="upload-icon">
                <Upload size={23} />
              </span>
              <strong>
                {busy
                  ? "Reading in your browser…"
                  : filename || "Drop your CV here"}
              </strong>
              <span>
                {busy
                  ? "You can clear the workspace to cancel."
                  : "or click to browse your files"}
              </span>
              <small>PDF, DOCX or TXT · up to 5 MB · PDF up to 30 pages</small>
            </label>
            <div className="or-row">
              <span />
              or work with text
              <span />
            </div>
            <label className="field-label" htmlFor="resume-text">
              CV text{" "}
              <span>
                {text.trim() ? text.trim().split(/\s+/).length : 0} words
              </span>
            </label>
            <textarea
              id="resume-text"
              className="resume-text"
              placeholder="Paste your CV here, or inspect the text extracted from your file. Keep section headings on separate lines."
              value={text}
              maxLength={MAX_TEXT}
              disabled={busy}
              onChange={(e) => {
                setText(e.target.value);
                setFilename("Pasted / edited text");
              }}
            />
            {notice && (
              <p className="notice" role="status">
                {notice}
              </p>
            )}
            <details className="job-details">
              <summary>
                Add a job description <span>optional</span>
                <ChevronDown size={15} />
              </summary>
              <label htmlFor="job-description" className="field-label">
                Role or research opportunity
              </label>
              <textarea
                id="job-description"
                placeholder="Paste the opportunity description to compare recognised skills. This stays in your browser too."
                value={job}
                maxLength={MAX_TEXT}
                onChange={(e) => setJob(e.target.value)}
              />
              <p className="field-help">
                Keyword coverage is shown separately from CV readiness. Only
                mention skills you actually have.
              </p>
            </details>
            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}
            <button
              className="primary review-button"
              disabled={busy || !text.trim()}
              onClick={analyze}
            >
              <Sparkles size={17} />
              {t("Review my CV", "আমার সিভি পরীক্ষা করো")}
              <ArrowRight size={17} />
            </button>
            <div className="input-footer">
              <button className="text-button" onClick={sample}>
                Try a sample
              </button>
              <button className="text-button" onClick={reset}>
                <RotateCcw size={13} />
                Clear workspace
              </button>
            </div>
            <p className="input-disclaimer">
              <LockKeyhole size={12} /> Files and text stay in this tab’s
              memory. Refresh or clear to discard them. Downloads remain on your
              device.
            </p>
          </section>
          <section
            className="panel report-panel"
            aria-labelledby="report-title"
          >
            <div className="panel-top">
              <h2 id="report-title" tabIndex={-1} ref={reportHeading}>
                {t("Your review", "তোমার মূল্যায়ন")}
              </h2>
              <span className="report-badge">
                {report ? "LOCAL REPORT" : "READY WHEN YOU ARE"}
              </span>
            </div>
            {!report ? (
              <div className="report-empty">
                <div className="document-art">
                  <FileText size={48} strokeWidth={1.1} />
                  <span>
                    <Check size={17} />
                  </span>
                </div>
                <h3>
                  Good feedback starts
                  <br />
                  with the whole picture.
                </h3>
                <p>
                  Add your CV to get a transparent, section-by-section review.
                  Every finding comes with its reason and a useful next step.
                </p>
                <div className="empty-features">
                  <span>
                    <Check size={14} />
                    Target-specific checks
                  </span>
                  <span>
                    <Check size={14} />
                    Evidence behind every score
                  </span>
                  <span>
                    <Check size={14} />
                    English or Bengali feedback
                  </span>
                  <span>
                    <Check size={14} />
                    Downloadable review
                  </span>
                </div>
                <div className="empty-footnote">
                  No mystery score. No upgrade to see your feedback.
                </div>
              </div>
            ) : (
              <div className="report-body" lang={language}>
                {stale && (
                  <p className="warning" role="status">
                    {t(
                      "Inputs changed. Run the review again; this report describes your previous input.",
                      "লেখা বা লক্ষ্য বদলেছে। আবার পরীক্ষা করো; এই রিপোর্ট আগের তথ্যের।",
                    )}
                  </p>
                )}
                <div className="score-row">
                  <div
                    className="score-circle"
                    style={
                      { "--score": `${report.score}%` } as React.CSSProperties
                    }
                  >
                    <div>
                      <strong>{report.score}</strong>
                      <span>/ 100</span>
                    </div>
                  </div>
                  <div>
                    <span className="score-label">
                      {t("CV readiness", "সিভির প্রস্তুতি")}
                    </span>
                    <h3>
                      {t(
                        report.score >= 80
                          ? "A solid starting point."
                          : report.score >= 50
                            ? "Make the details count."
                            : "Let’s build the foundations.",
                        report.score >= 80
                          ? "ভালো একটি ভিত্তি আছে।"
                          : report.score >= 50
                            ? "তথ্যগুলো আরও স্পষ্ট করো।"
                            : "আগে মূল অংশগুলো সাজাও।",
                      )}
                    </h3>
                    <p>
                      {report.words} words ·{" "}
                      {report.target === "academic"
                        ? "Academic / research"
                        : "Software / industry"}
                    </p>
                    {previous !== null && (
                      <p className="score-delta">
                        {report.score - previous >= 0 ? "+" : ""}
                        {report.score - previous}{" "}
                        {t(
                          "since your previous review",
                          "আগের মূল্যায়নের তুলনায়",
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <p className="score-limit">
                  {t(
                    "A transparent rule-based checklist, not an employer ATS score, hiring prediction or visual-layout certification. English headings and verbs are recognised; Bengali feedback is available.",
                    "এটি নিয়মভিত্তিক চেকলিস্ট। নিয়োগদাতার ATS স্কোর, চাকরি পাওয়ার সম্ভাবনা বা লেআউটের সনদ নয়। পরীক্ষায় ইংরেজি শিরোনাম ও ক্রিয়া চেনা হয়।",
                  )}
                </p>
                <div className="report-actions no-print">
                  <button
                    className="secondary"
                    onClick={download}
                    disabled={stale}
                  >
                    <Download size={14} />
                    Download review
                  </button>
                  <button
                    className="secondary"
                    onClick={() => window.print()}
                    disabled={stale}
                  >
                    Print / save PDF
                  </button>
                  <label className="mask-toggle">
                    <input
                      type="checkbox"
                      checked={mask}
                      onChange={(e) => setMask(e.target.checked)}
                    />
                    Mask contacts
                  </label>
                </div>
                <div className="section-heading">
                  <h3>{t("Your next steps", "এরপর যা করবে")}</h3>
                  <span>
                    {report.checks.filter((c) => c.points === 0).length}{" "}
                    {t("to review", "টি বিষয় দেখো")}
                  </span>
                </div>
                <div className="checks">
                  {[...report.checks]
                    .sort(
                      (a, b) => (a.points > 0 ? 1 : 0) - (b.points > 0 ? 1 : 0),
                    )
                    .map((c) => (
                      <details
                        key={c.id}
                        className={`check-item ${c.points ? "pass" : "attention"}`}
                        open={!c.points}
                      >
                        <summary>
                          <span className="check-symbol">
                            {c.points ? <Check size={14} /> : "!"}
                          </span>
                          <span>{language === "bn" ? c.bn : c.title}</span>
                          <span className="check-points">
                            {c.points}/{c.max}
                          </span>
                          <ChevronDown size={14} />
                        </summary>
                        <div className="check-detail">
                          <p className="evidence">{display(c.evidence)}</p>
                          <p>{language === "bn" ? c.adviceBn : c.advice}</p>
                        </div>
                      </details>
                    ))}
                </div>
                <div className="keyword-card">
                  <div className="section-heading">
                    <h3>{t("Opportunity fit", "সুযোগের সঙ্গে মিল")}</h3>
                    <span>
                      {report.keywords.score === null
                        ? "—"
                        : `${report.keywords.score}% coverage`}
                    </span>
                  </div>
                  {report.keywords.score === null ? (
                    <p>
                      {t(
                        "Add an opportunity description containing recognised skills to see keyword coverage.",
                        "পরিচিত দক্ষতার নামসহ চাকরি বা গবেষণার সুযোগের বিবরণ দিলে শব্দের মিল দেখা যাবে।",
                      )}
                    </p>
                  ) : (
                    <>
                      <div className="keyword-group">
                        <strong>Present in CV</strong>
                        <div className="chips">
                          {report.keywords.matched.map((k) => (
                            <span key={k}>{k}</span>
                          ))}
                          {!report.keywords.matched.length && (
                            <small>None detected</small>
                          )}
                        </div>
                      </div>
                      <div className="keyword-group missing">
                        <strong>Not detected — add only if true</strong>
                        <div className="chips">
                          {report.keywords.missing.map((k) => (
                            <span key={k}>{k}</span>
                          ))}
                          {!report.keywords.missing.length && (
                            <small>No gaps in recognised keywords</small>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <small>
                    Curated English skills vocabulary. Exact terms, not semantic
                    matching or verified proficiency. This does not affect the
                    readiness score.
                  </small>
                </div>
                <details className="preview-details">
                  <summary>
                    <FileText size={15} />
                    {t("Inspect the reviewed text", "পরীক্ষা করা লেখা দেখো")}
                    <ChevronDown size={14} />
                  </summary>
                  <pre>{display(snapshot?.text || "")}</pre>
                </details>
                <details className="privacy-details">
                  <summary>
                    <ShieldCheck size={15} />
                    {t("Before sharing your CV", "সিভি শেয়ার করার আগে")}
                    <ChevronDown size={14} />
                  </summary>
                  <ul>
                    {(report.privacy.length
                      ? report.privacy
                      : [
                          "No common contact patterns detected. This is not a complete privacy audit.",
                        ]
                    ).map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <p>
                    Masking covers common emails, phone-like numbers and URLs.
                    Names, addresses and work history can still identify you.
                    Downloaded reviews may contain excerpts; inspect before
                    sharing.
                  </p>
                </details>
                <div className="writing-guide">
                  <span className="tiny-tag">REVIEWER’S NOTE</span>
                  <h3>
                    {t(
                      "Write the evidence, not the adjective.",
                      "বিশেষণের বদলে কাজের প্রমাণ লেখো।",
                    )}
                  </h3>
                  <p>
                    {report.target === "academic"
                      ? "Research template: Evaluated [method] on [dataset], reporting [metric] under [conditions]."
                      : "Project template: Built [feature] using [technology] to solve [problem]; verified it with [test or outcome]."}
                  </p>
                  <small>
                    Templates only. Replace brackets with verified facts. Never
                    invent results, credentials or publications.
                  </small>
                </div>
              </div>
            )}
            {report && (
              <pre className="print-report">
                {stale
                  ? "Inputs changed. Run the review again before printing."
                  : exportReport(report, language, mask)}
              </pre>
            )}
          </section>
        </div>
        <footer className="lab-footer">
          <span>
            <ShieldCheck size={14} />
            Private by default. Useful by design.
          </span>
          <Link href="/methodology">
            Read the scoring method <ArrowRight size={14} />
          </Link>
        </footer>
      </div>
    </main>
  );
}
