# ProfEmail — Resume Lab & PhD Outreach

Two separate workflows: private browser-local CV checks, and optional cloud-AI PhD outreach. No personal archive documents or keys are bundled into this repository.

## Resume Lab (`/resume-checker`)

- Read PDF, DOCX and UTF-8 TXT locally, or paste/edit text. Same-origin PDF.js worker; no CDN dependencies or cloud inference.
- Industry and academic targets, with different research/skills and length expectations.
- Ten explainable checks, visible evidence and English/Bengali feedback. A transparent **heuristic readiness score**, not an employer ATS score or hiring prediction.
- Optional opportunity description: separate exact-term coverage from a curated English skills vocabulary. Java, JavaScript, C++ and C# remain distinct. No claim of semantic matching or qualification verification.
- Inspect extracted text, mask common contacts, download a Markdown review, or print/save its full text as PDF. Names and identifying history can remain after masking.
- Edit and re-review to compare against the previous score when the target and opportunity are unchanged. Changed inputs mark the old report stale and disable export until rerun.
- Inputs/results live in tab memory only. No accounts, database writes, analytics, localStorage or server upload in this workflow. Refresh, close or clear to discard; downloaded files remain on disk.
- Limits: 5 MB/file, 30 PDF pages, 100,000 characters/field. DOCX archives are checked for declared expansion (20 MB) and entry count (1,000). Scans need external OCR. Extraction cannot certify visual layout or reading order.

The original owner-authored skill is preserved at [skills/cv-resume-reviewer/SKILL.md](skills/cv-resume-reviewer/SKILL.md), copied from the private `almuzahidseyam/antigravity-skills` repository, source commit `24556a68a31973663e340d8ddcd5ad6f3d314669`. Its target selection, structure review, ATS guidance, evidence and constructive Bengali feedback informed `src/lib/resume-review.ts`. The skill is not presented as a running AI model. Rewrite suggestions are labelled templates, never invented achievements.

The interface references ResumeGo and Naukri’s upload → feedback → improvement workflow. Its priorities are inspectable rules, browser-local processing and academic/industry separation. **No comparative benchmark or claim of outperforming either provider is made.** Naukri’s linked checker was inaccessible during research.

## Run

Use Node.js 22.16+ (or a newer supported release).

```sh
npm ci
npm run dev
```

Open the printed local URL and select **Resume Lab**. No credentials or paid service are needed for it. `predev`/`prebuild` copy the matching PDF worker from the installed dependency; the generated worker is ignored in Git and shipped by the production build.

```sh
npm test
npm run typecheck
npm run build
npm start
```

`/methodology` explains point weights and limitations. `/privacy` describes local processing, masking and the separate cloud workflow.

## Optional PhD outreach (`/dashboard`)

The existing dashboard still sends a complete PDF and research-interest string to Gemini, **only after explicit consent**. It does not scrape Scholar, verify professors or send mail directly. Suggestions need independent verification; the final action opens the user’s email client.

Set server-only environment variables in ignored `.env.local`:

```text
GEMINI_API_KEY=<your existing Gemini API key>
OUTREACH_ACCESS_CODE=<a long random owner access code>
```

No keys are supplied or new paid service provisioned by this update. Missing configuration returns 503 while Resume Lab remains available. The endpoint validates access code, same-origin browser calls, explicit consent, PDF header/size, research-field length and output shape. It redacts provider errors and never logs raw CVs. A five-request/minute **per-process** limiter reduces accidental calls; it is not a distributed quota or a substitute for provider-side limits. Configure reverse-proxy request-size/rate limits before a public server deployment. The shared owner access code is intended for personal use, not multi-user SaaS authentication.

Firebase initialization remains as legacy scaffolding in `src/lib/firebase.ts`; neither current UI workflow imports it or writes CV data to Firestore.

## Browser QA

`python tests/make-browser-fixtures.py` creates fictional PDF/DOCX/TXT and invalid-file fixtures in ignored `artifacts/`. Never use personal archive CVs as committed fixtures. Test import, reading preview, target/language changes, keyword coverage, revision comparison, export, reset/reload, and 390/768/desktop widths. Use browser network inspection with a unique fictional sentinel to verify document content is not sent; requests for same-origin scripts/worker assets are expected.

Automated tests cover rubric totals, academic differences, exact keyword boundaries, malformed/oversized input, contact masking/export and fail-closed cloud validation. Cloud-provider success requires an explicitly configured real environment and is not part of tests.

For a reproducible local network check, start production on `127.0.0.1:3097`, then run `node scripts/privacy-probe.mjs` and visit its `127.0.0.1:3098/resume-checker` URL. Use fictional text containing `CV_QA_PRIVATE_SENTINEL`, import the synthetic fixtures and generate a report. The ignored `artifacts/privacy-probe.jsonl` records methods, paths, body byte counts and sentinel presence without storing document content. Expect no request bodies, no POST and no sentinel leaks. Production CSP additionally restricts browser connections to the same origin. This is a test of observed requests, not a guarantee against malicious extensions or a compromised device.

## Hosting

No hosting project or deployment configuration existed in this repository at this update. The source runs locally or on an existing compatible Node.js host. This change does not deploy into the owner’s private-life archive Firebase project or create hosting/billing resources. The optional outreach route needs a Node server; do not silently publish it as a static-only app.

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, PDF.js, Mammoth (raw text only), Lucide icons. Runtime audit issues found in the original dependency tree were addressed with a Next.js update and a patched gRPC override.
