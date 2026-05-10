import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, keywords, targetAudience } = body as {
      productName: string;
      keywords: string[];
      targetAudience: string;
    };

    if (!productName) {
      return NextResponse.json(
        { error: "productName is required" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Google Ads copywriter specializing in affiliate marketing. Generate high-converting ad copy. Respond ONLY with valid JSON — no markdown, no code fences.",
        },
        {
          role: "user",
          content: `Generate Google Ads copy for the following product:

Product: ${productName}
Keywords: ${keywords?.join(", ") || "N/A"}
Target Audience: ${targetAudience || "General"}

Provide 5 ad variations. Each must have:
- 3 headlines (max 30 chars each)
- 2 descriptions (max 90 chars each)
- A display URL path suggestion

Respond with this exact JSON structure:
{
  "adCopies": [
    {
      "headlines": ["string", "string", "string"],
      "descriptions": ["string", "string"],
      "displayPath": "string",
      "estimatedCTR": "string"
    }
  ]
}`,
        },
      ],
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 502 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: content },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("POST /api/ads/generate-copy error:", error);
    return NextResponse.json(
      { error: "Failed to generate ad copy" },
      { status: 500 }
    );
  }
}
