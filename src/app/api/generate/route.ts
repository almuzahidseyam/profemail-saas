import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const researchField = formData.get('researchField') as string;

    if (!file || !researchField) {
      return NextResponse.json({ success: false, error: "Missing file or research field" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const prompt = `
      You are an expert PhD consultant.
      1. Analyze the provided resume (PDF).
      2. Based on the candidate's profile and the specified research field: "${researchField}", identify 3 top globally renowned professors who are actively researching in this exact niche.
      3. Write a highly personalized cold email draft (under 150 words) for each professor, referencing one of their recent works and aligning it with the candidate's skills.
      
      You MUST return exactly a JSON array of objects with this schema:
      [
        {
          "name": "Professor Name",
          "university": "University Name",
          "email": "prof@university.edu",
          "match_score": 95,
          "email_draft": "Dear Prof. [Name],\n\n..."
        }
      ]
      Return ONLY valid JSON. No markdown formatting blocks around the JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64Data, mimeType: 'application/pdf' } },
            { text: prompt }
          ]
        }
      ],
      config: {
          responseMimeType: "application/json"
      }
    });

    let textResponse = response.text || "[]";
    const parsedData = JSON.parse(textResponse);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to generate matches" }, { status: 500 });
  }
}
