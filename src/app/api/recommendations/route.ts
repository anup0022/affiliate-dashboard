import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { openai } from "@/lib/openai";

const USER_ID = "user_default";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { userId: USER_ID };
    if (status) where.status = status;
    if (category) where.category = category;

    const recommendations = await prisma.recommendation.findMany({
      where,
      include: { trendingItem: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("GET /api/recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const trendingItems = await prisma.trendingItem.findMany({
      orderBy: { trendScore: "desc" },
      take: 20,
    });

    if (trendingItems.length === 0) {
      return NextResponse.json(
        { error: "No trending items found. Run a trending scan first." },
        { status: 400 }
      );
    }

    const trendingSummary = trendingItems
      .map(
        (item) =>
          `- ${item.title} (Category: ${item.category}, Score: ${item.trendScore}, Network: ${item.affiliateNetwork || "N/A"}, Commission: ${item.estimatedCommission || "N/A"}%, Search Volume: ${item.searchVolume || "N/A"}, Competition: ${item.competition || "N/A"})`
      )
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert affiliate marketing analyst. Analyze trending items and provide affiliate marketing recommendations. Respond ONLY with valid JSON — no markdown, no code fences.",
        },
        {
          role: "user",
          content: `Analyze these trending items and recommend the top 5 affiliate marketing opportunities. For each, provide a title, description, reasoning, category, confidence score (0-1), suggested affiliate network, estimated monthly earnings, and 3 action items.

Trending Items:
${trendingSummary}

Respond with this exact JSON structure:
{
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "reasoning": "string",
      "category": "string",
      "confidence": 0.0,
      "affiliateNetwork": "string",
      "estimatedEarnings": 0.0,
      "actionItems": ["string", "string", "string"],
      "trendingItemTitle": "string"
    }
  ]
}`,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 502 }
      );
    }

    let parsed: {
      recommendations: Array<{
        title: string;
        description: string;
        reasoning: string;
        category: string;
        confidence: number;
        affiliateNetwork: string;
        estimatedEarnings: number;
        actionItems: string[];
        trendingItemTitle: string;
      }>;
    };
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: content },
        { status: 502 }
      );
    }

    const trendingMap = new Map(
      trendingItems.map((item) => [item.title, item.id])
    );

    const savedRecommendations = await Promise.all(
      parsed.recommendations.map((rec) =>
        prisma.recommendation.create({
          data: {
            userId: USER_ID,
            title: rec.title,
            description: rec.description,
            reasoning: rec.reasoning,
            category: rec.category,
            confidence: rec.confidence,
            affiliateNetwork: rec.affiliateNetwork,
            estimatedEarnings: rec.estimatedEarnings,
            actionItems: rec.actionItems,
            trendingItemId: trendingMap.get(rec.trendingItemTitle) || null,
            status: "new",
          },
          include: { trendingItem: true },
        })
      )
    );

    return NextResponse.json(
      { recommendations: savedRecommendations },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
