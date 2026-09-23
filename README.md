# ProfEmail SaaS ??

An AI-powered Software-as-a-Service (SaaS) platform that automates PhD outreach. It leverages Google's Gemini AI to analyze a candidate's resume, search for matching professors globally, and draft highly personalized cold emails.

## Features
- **Smart Resume Parsing**: Upload your CV and let AI understand your research niche.
- **Professor Matchmaking**: Asks Gemini for professors publishing in your field, ranked against
  your CV.

  > **Check every name and address before you send anything.** The professors, their
  > universities and their email addresses come from the model's own knowledge — nothing is
  > scraped and no directory is consulted, so an address can be out of date or invented
  > outright. Treat the output as a shortlist to verify on the department's own website, not
  > as a mailing list.
- **Automated Drafting**: Generates context-aware, non-spammy cold emails referencing the professor's latest work.
- **Direct Gmail Integration**: Send drafts from the dashboard once you have verified the address.

## Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, React
- **Backend**: Next.js Route Handlers
- **AI / LLM**: `@google/genai` (Gemini 2.5)
- **Database & Auth**: Firebase

## Setup Instructions
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env.local` file and add your `NEXT_PUBLIC_FIREBASE_*` keys and `GEMINI_API_KEY`.
4. Run `npm run dev` to start the development server.
