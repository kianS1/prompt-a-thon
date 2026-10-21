import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ClassifyRequest, ClassifyResponse, ClassificationResult } from "@/lib/types";
import { matchResources } from "@/lib/matcher";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a civic problem classifier. Given a user's problem description and location, you classify the problem and return a structured JSON object.

Categories:
- GOVERNMENT: Public infrastructure, roads, streetlights, sidewalks, municipal trash, illegal dumping on PUBLIC property, abandoned vehicles on public streets, public water/sewer, public parks/trees
- PRIVATE_SERVICE: Junk removal, tree service on private property, pest control, plumbing, HVAC, lawn care, private property cleanup, handyman work, moving/hauling, private contractor work
- REGULATORY: Questions about permits, zoning, what's legal, who's responsible, appeals, requirements

You MUST return valid JSON only. No markdown, no explanation, just the JSON object.

Return this exact structure:
{
  "issue_type": "brief description of the specific issue (e.g., 'pothole on public road')",
  "category": "GOVERNMENT" | "PRIVATE_SERVICE" | "REGULATORY",
  "jurisdiction": "city and state extracted from location",
  "location": "cleaned location string",
  "urgency": "low" | "medium" | "high",
  "likely_responsible_party": "specific department or service type (e.g., 'Public Works', 'Junk Removal Company', 'Building & Zoning')",
  "required_information": ["array", "of", "things", "user", "should", "gather"],
  "recommended_action": "single clear sentence describing what to do",
  "confidence": 0.0 to 1.0,
  "reasoning": "1-2 sentence explanation of why this classification was chosen",
  "keywords": ["array", "of", "relevant", "keywords", "for", "matching"]
}

Examples:
- "pothole outside my apartment" → GOVERNMENT, issue_type: "pothole on public road", likely_responsible_party: "Public Works"
- "old couch and junk in my backyard" → PRIVATE_SERVICE, issue_type: "furniture and debris removal on private property", likely_responsible_party: "Junk Removal Company"
- "do I need a permit to build a fence" → REGULATORY, issue_type: "fence building permit inquiry", likely_responsible_party: "Building & Zoning"`;

export async function POST(req: NextRequest) {
  try {
    const body: ClassifyRequest = await req.json();
    const { description, location, imageBase64 } = body;

    if (!description || !location) {
      return NextResponse.json(
        { error: "description and location are required" },
        { status: 400 }
      );
    }

    const userContent: OpenAI.ChatCompletionContentPart[] = [
      {
        type: "text",
        text: `Problem description: "${description}"\nLocation: "${location}"\n\nClassify this problem and return the JSON object.`,
      },
    ];

    // Include image if provided
    if (imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: "low" },
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const rawJson = completion.choices[0]?.message?.content;
    if (!rawJson) {
      throw new Error("No response from classification model");
    }

    const classification: ClassificationResult = JSON.parse(rawJson);

    // Match against local resource data
    const recommendation = matchResources(classification);

    const response: ClassifyResponse = { classification, recommendation };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[classify] error:", err);
    return NextResponse.json(
      { error: "Classification failed. Please try again." },
      { status: 500 }
    );
  }
}
