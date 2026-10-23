import Link from "next/link";
import { RUBRIC_VERSION } from "@/lib/resume-review";
export default function Methodology() {
  const checks = [
    ["At least 3 recognised standalone section headings", 15],
    ["Education heading", 10],
    [
      "Experience or project heading (research also counts for academic CVs)",
      15,
    ],
    [
      "Skills heading for industry; research or publications heading for academic",
      15,
    ],
    ["At least 2 lines starting with recognised English action verbs", 10],
    ["A recognised numeric scope or outcome (not just a year)", 10],
    ["At least one four-digit year", 5],
    ["Suggested word range: 200–1,000 industry; 200–2,500 academic", 5],
    ["No recognised unfinished placeholders", 10],
    ["No replacement characters in extracted text", 5],
  ] as const;
  return (
    <main className="prose-page">
      <span className="tiny-tag">RUBRIC {RUBRIC_VERSION}</span>
      <h1>
        Feedback you
        <br />
        can inspect.
      </h1>
      <p>
        Resume Lab adapts the owner’s cv-resume-reviewer skill into a
        deterministic checklist. It reports what it detects and what it misses.
        It does not call an AI model, verify factual claims, imitate an
        employer’s ATS or predict interviews.
      </p>
      <h2>100 points, with the rules in view</h2>
      <table>
        <thead>
          <tr>
            <th>Check</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {checks.map(([name, points]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Each check awards all its points or none. These are suggestions, not
        universal requirements. The academic mode does not demand published
        papers or a one-page CV. Bengali feedback is available, but detection
        currently recognises English headings and action verbs. A high score can
        still contain mistakes or weak content; a low score can reflect an
        unfamiliar heading.
      </p>
      <h2>Job keyword coverage is separate</h2>
      <p>
        A curated English vocabulary identifies skills in the opportunity
        description, then checks exact, case-insensitive terms in the CV with
        word boundaries. C++, C#, Java and JavaScript are distinct. Coverage
        equals matched terms divided by detected opportunity terms. If none are
        detected, no score is shown. Synonyms, importance, negation and
        proficiency are not inferred. Missing terms should be added only if
        truthful.
      </p>
      <h2>What still needs human judgement</h2>
      <p>
        PDF extraction order, columns, font size, visual hierarchy, writing
        quality, credentials, chronology and the strength of research require
        inspection. Review the extracted text. Scanned pages need OCR outside
        this app. DOCX extraction may miss headers, footers, text boxes or
        image-based content. Files are limited to 5 MB, PDFs to 30 pages, and
        each text field to 100,000 characters.
      </p>
      <h2>Improve, then compare</h2>
      <p>
        Edit the input and rerun. The point difference compares the immediately
        previous review only when the target and opportunity description are
        unchanged. Changing either resets the comparison. The previous report is
        clearly marked when inputs change; stale reports cannot be exported. No
        review history is persisted.
      </p>
      <Link className="primary" href="/resume-checker">
        Review your CV
      </Link>
    </main>
  );
}
