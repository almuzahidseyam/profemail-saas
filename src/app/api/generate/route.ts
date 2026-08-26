import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { researchField, resumeText } = await request.json();

    // TODO: Initialize @google/genai SDK here with GEMINI_API_KEY
    // Example logic for finding professors (Mocked for UI demo)
    
    const prompt = `You are an expert PhD consultant. Based on the resume text and the field "${researchField}", suggest 3 top professors globally who are currently active in this field. Format as JSON array with {name, university, match_score, email_draft}.`;
    
    // Simulating Gemini API Call Delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockedResponse = [
      {
        name: "Dr. Andrew Ng",
        university: "Stanford University",
        match_score: 98,
        email_draft: `Dear Prof. Ng,\n\nI am reaching out to express my interest...`
      },
      {
        name: "Dr. Yann LeCun",
        university: "New York University",
        match_score: 95,
        email_draft: `Dear Prof. LeCun,\n\nI recently read your paper on...`
      }
    ];

    return NextResponse.json({ success: true, data: mockedResponse });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate matches" }, { status: 500 });
  }
}
