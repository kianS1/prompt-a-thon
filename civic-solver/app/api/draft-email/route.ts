import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { DraftEmailRequest, DraftEmailResponse } from "@/lib/types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a professional civic correspondence assistant. Write a clear, polite, and professional email to a city government department reporting a civic issue.

Guidelines:
- Use formal but approachable language
- Be specific but concise
- Include all relevant details from the problem description
- End with a polite request for resolution
- Do NOT include a signature block (the user will add their own)
- Do NOT use placeholder text like [Your Name] - just end with "Thank you."
- Return valid JSON only with this exact structure:
{
  "to": "email address",
  "subject": "subject line",
  "body": "full email body text"
}`;

export async function POST(req: NextRequest) {
  try {
    const body: DraftEmailRequest = await req.json();
    const { problem, resource, classification } = body;

    const prompt = `
Draft a civic report email with this context:

Department: ${resource.name}
Department email: ${resource.email}
Issue type: ${classification.issue_type}
Location: ${problem.location}
User's description: "${problem.description}"
Urgency: ${classification.urgency}
Recommended information to include: ${classification.required_information.join(", ")}

Write a professional email from a concerned resident.
Subject should be: [Issue type] — [Location]
Return JSON with "to", "subject", and "body" fields.
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const rawJson = completion.choices[0]?.message?.content;
    if (!rawJson) {
      throw new Error("No response from email drafting model");
    }

    const draft: DraftEmailResponse = JSON.parse(rawJson);
    return NextResponse.json(draft);
  } catch (err) {
    console.error("[draft-email] error:", err);
    return NextResponse.json(
      { error: "Email drafting failed. Please try again." },
      { status: 500 }
    );
  }
}
