import Link from "next/link";
export default function Privacy() {
  return (
    <main className="prose-page">
      <span className="tiny-tag">PRIVACY</span>
      <h1>
        Your document.
        <br />
        Your decision.
      </h1>
      <h2>Resume Lab: browser-local</h2>
      <p>
        File bytes, extracted CV text, job descriptions and reports are
        processed in this tab. Resume Lab does not send them to our server or an
        AI provider, and does not save them to cookies, local storage or a
        database. Same-origin JavaScript and the PDF worker are downloaded to
        run the checks. Standard hosting request logs may include your IP,
        browser information and requested page paths, but the checker does not
        put CV text in those requests.
      </p>
      <p>
        Clear workspace, refresh or close the tab to discard the active input
        and report. This is not a secure memory-erasure guarantee. Downloaded
        files remain on your device; printing may be handled by your browser or
        operating system. Browser extensions and your device security are
        outside this app’s control.
      </p>
      <h2>Masking is not anonymisation</h2>
      <p>
        Contact masking replaces common email addresses, phone-like numbers and
        URLs in the report and its export. Names, postal addresses, institutions
        and employment history can still identify you. Original text in the
        editor is not masked. Review every downloaded report before sharing it.
        We use no advertising trackers, analytics SDKs or remotely hosted fonts.
      </p>
      <h2>PhD outreach: separate, optional cloud processing</h2>
      <p>
        The outreach dashboard sends the PDF and research interest to this
        server and Google’s Gemini API only after you select its consent
        checkbox and request suggestions. It needs a server-configured access
        code and API key. Resume Lab never invokes this route. This app does not
        deliberately persist the PDF, but provider retention and hosting
        infrastructure are governed by their own settings and policies. Do not
        assume local processing or automatic deletion in that separate workflow.
      </p>
      <h2>Fictional samples</h2>
      <p>
        All bundled demo CVs are fictional. No personal archive documents,
        credentials or references are bundled into this project.
      </p>
      <Link className="primary" href="/resume-checker">
        Back to Resume Lab
      </Link>
    </main>
  );
}
