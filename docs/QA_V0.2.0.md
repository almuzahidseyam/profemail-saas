# Resume Lab v0.2.0 verification — 2026-10-23

## Automated

- 10 tests passed: rubric sum, academic target, keyword boundaries, job-fit separation, invalid/oversized text, numeric evidence, placeholders, redacted exports, TXT/file failures, and fail-closed cloud endpoint validation.
- TypeScript checks and production build passed on Next.js 16.4.3.
- Dependency audit: zero known vulnerabilities at verification time.

## Browser (fictional data only)

- PDF and DOCX extracted in the browser and produced reports. PDF import also passed with the production Content Security Policy enabled.
- English/Bengali feedback and academic/industry selection worked.
- React/TypeScript/Docker vs Kubernetes opportunity: 75% exact-term coverage, separately from readiness.
- Editing Skills to an unrecognised heading marked the report stale, disabled export, then showed a 15-point decrease after re-review.
- Markdown report downloaded successfully and included the rubric explanation.
- Image-only/empty PDF showed OCR guidance, corrupt PDF showed an error, and an oversized file was rejected.
- Clear discarded text/report; reload started empty. No history is persisted.
- Mobile/tablet/desktop layouts checked at 390, 768 and 1280 viewport settings, with no horizontal overflow in measured DOM widths. Browser scrollbar space makes the reported content viewport slightly narrower.
- Local QA proxy captured 37 requests across import/review/export/revision/error flows: no non-read requests, no request bodies and no `CV_QA_PRIVATE_SENTINEL` in transmitted URLs or bodies. Later navigation may add asset GETs. Production CSP restricts browser connections to the same origin; browser logs contained no errors after successful PDF parsing.
- Desktop preview screenshot is in ignored `artifacts/resume-lab-desktop.png` (fictional academic example).

## Limits

- Cloud-provider success was not exercised: no credentials provisioned, no real CV sent, no email sent.
- Print stylesheet and full-text print view were built; the OS print/save dialog was not exercised.
- These checks do not verify factual CV claims, all ATS parsers, all document layouts, malicious browser extensions, or every adversarial file.
- No hosting/deployment configuration was present. This release is source plus local preview, not a public hosted deployment.
