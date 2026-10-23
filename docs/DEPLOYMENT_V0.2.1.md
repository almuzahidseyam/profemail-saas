# Vercel production deployment — v0.2.1

Date: 2026-10-23 (Asia/Dhaka)

- Production: https://profemail-saas.vercel.app
- Resume Lab: https://profemail-saas.vercel.app/resume-checker
- Project: `almuzahidseyam/profemail-saas`, connected to the same GitHub repository.
- First verified immutable deployment: `https://profemail-saas-liozbay2t-almuzahidseyam.vercel.app`, state READY.
- Next.js 16.4.3, Node 24.x, build/install commands tracked in `vercel.json`.
- No database migration, private-life archive data, production keys, paid plan upgrade or new paid integration was involved.

## Verification

- Previous source CI: both workflows for commit `1bd21f5` succeeded.
- Vercel remote install, production build, TypeScript and static generation passed.
- Live HTTPS requests returned 200 for `/`, `/resume-checker`, `/privacy`, `/methodology` and `/pdf.worker.min.mjs`; the worker served JavaScript.
- Anonymous POST `/api/generate` returned the expected 503 with a clear configuration message. No actual CV was sent and no API credentials were provisioned.
- Browser-local PDF/DOCX review flows passed before deployment, as recorded in `QA_V0.2.0.md`. The in-app browser timed out reaching the live host, so a new direct production-browser interaction test could not be completed. HTTPS response checks from the deployment machine succeeded; do not describe them as a completed live UI test.

## Operational notes

- Resume Lab works without server credentials. Its inputs and results remain in browser memory, as described on `/privacy`.
- Optional outreach remains disabled until both `GEMINI_API_KEY` and `OUTREACH_ACCESS_CODE` are explicitly configured as server-only Vercel environment variables. Never copy personal-archive keys into this project.
- `.vercelignore` excludes environment files, local metadata, development output, synthetic test artifacts and screenshots. Build scripts regenerate the same-version PDF worker.
- Future pushes to the connected production branch should trigger Vercel Git deployments; verify their READY status rather than assuming push equals deployment.
- Rollback trigger: primary routes return persistent errors, the PDF worker is unavailable, or the previously verified local review flow regresses. Retain this verified immutable deployment; use Vercel’s deployment promotion/rollback controls to restore a verified version after a later regression. No destructive rollback or account/billing change is automatic.
- This is a first production deployment with smoke tests, not a 15-minute traffic/error-rate study. No pre-existing monitoring baseline or on-call rotation was configured.
