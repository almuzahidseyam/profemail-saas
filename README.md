# ProfEmail SaaS ??

An AI-powered Software-as-a-Service (SaaS) platform that automates PhD outreach. It leverages Google's Gemini AI to analyze a candidate's resume, search for matching professors globally, and draft highly personalized cold emails.

## Features
- **Smart Resume Parsing**: Upload your CV and let AI understand your research niche.
- **Professor Matchmaking**: Scrapes academic databases to find professors currently publishing in your exact field.
- **Automated Drafting**: Generates context-aware, non-spammy cold emails referencing the professor's latest work.
- **Direct Gmail Integration**: Send approved drafts directly from the dashboard.

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
