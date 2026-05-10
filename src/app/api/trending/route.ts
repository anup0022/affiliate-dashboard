import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const source = searchParams.get("source");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const sortBy = searchParams.get("sortBy") || "trendScore";

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (source) where.source = source;

    const orderBy =
      sortBy === "createdAt"
        ? { createdAt: "desc" as const }
        : { trendScore: "desc" as const };

    const [items, total] = await Promise.all([
      prisma.trendingItem.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.trendingItem.count({ where }),
    ]);

    return NextResponse.json({ items, total, limit, offset });
  } catch (error) {
    console.error("GET /api/trending error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending items" },
      { status: 500 }
    );
  }
}

function generateSampleTrendingItems() {
  const items = [
    {
      title: "Apple Vision Pro",
      description:
        "Apple's mixed-reality headset continues to dominate search trends as new apps launch weekly.",
      category: "tech",
      trendScore: 95.2,
      source: "google_trends",
      sourceUrl: "https://trends.google.com",
      affiliateNetwork: "Amazon Associates",
      estimatedCommission: 4.0,
      searchVolume: 823000,
      competition: "high",
    },
    {
      title: "Portable Power Station 1000W",
      description:
        "Surge in interest for portable power stations driven by outdoor recreation and emergency preparedness.",
      category: "tech",
      trendScore: 88.7,
      source: "reddit",
      sourceUrl: "https://reddit.com/r/preppers",
      affiliateNetwork: "Amazon Associates",
      estimatedCommission: 6.0,
      searchVolume: 412000,
      competition: "medium",
    },
    {
      title: "GLP-1 Weight Loss Supplements",
      description:
        "Natural GLP-1 agonist supplements trending as alternatives to prescription medications.",
      category: "health",
      trendScore: 92.1,
      source: "google_trends",
      sourceUrl: "https://trends.google.com",
      affiliateNetwork: "ShareASale",
      estimatedCommission: 15.0,
      searchVolume: 1200000,
      competition: "high",
    },
    {
      title: "AI Trading Bot Software",
      description:
        "Automated trading platforms using AI are seeing massive search volume growth.",
      category: "finance",
      trendScore: 85.3,
      source: "reddit",
      sourceUrl: "https://reddit.com/r/algotrading",
      affiliateNetwork: "CJ Affiliate",
      estimatedCommission: 25.0,
      searchVolume: 390000,
      competition: "medium",
    },
    {
      title: "Standing Desk Converter",
      description:
        "Ergonomic desk converters continue trending as remote work remains dominant.",
      category: "tech",
      trendScore: 78.4,
      source: "google_trends",
      sourceUrl: "https://trends.google.com",
      affiliateNetwork: "Amazon Associates",
      estimatedCommission: 5.0,
      searchVolume: 275000,
      competition: "medium",
    },
    {
      title: "Mushroom Coffee Blend",
      description:
        "Functional mushroom coffee blends gaining rapid popularity in the wellness space.",
      category: "health",
      trendScore: 81.6,
      source: "tiktok",
      sourceUrl: "https://tiktok.com",
      affiliateNetwork: "ShareASale",
      estimatedCommission: 20.0,
      searchVolume: 510000,
      competition: "low",
    },
    {
      title: "Robo-Advisor Platforms",
      description:
        "Automated investment platforms trending with younger demographics entering the market.",
      category: "finance",
      trendScore: 76.9,
      source: "google_trends",
      sourceUrl: "https://trends.google.com",
      affiliateNetwork: "Impact",
      estimatedCommission: 50.0,
      searchVolume: 340000,
      competition: "high",
    },
    {
      title: "Smart Ring Fitness Tracker",
      description:
        "Wearable smart rings overtaking traditional fitness bands in consumer interest.",
      category: "tech",
      trendScore: 89.5,
      source: "reddit",
      sourceUrl: "https://reddit.com/r/gadgets",
      affiliateNetwork: "Amazon Associates",
      estimatedCommission: 4.5,
      searchVolume: 620000,
      competition: "medium",
    },
    {
      title: "Red Light Therapy Panel",
      description:
        "At-home red light therapy devices surging in the biohacking and skincare communities.",
      category: "health",
      trendScore: 83.2,
      source: "tiktok",
      sourceUrl: "https://tiktok.com",
      affiliateNetwork: "ShareASale",
      estimatedCommission: 12.0,
      searchVolume: 480000,
      competition: "low",
    },
    {
      title: "High-Yield Savings Account Comparisons",
      description:
        "Interest rate comparison tools and HYSA content seeing record search volumes.",
      category: "finance",
      trendScore: 91.0,
      source: "google_trends",
      sourceUrl: "https://trends.google.com",
      affiliateNetwork: "CJ Affiliate",
      estimatedCommission: 35.0,
      searchVolume: 890000,
      competition: "high",
    },
  ];
  return items;
}

export async function POST() {
  try {
    const sampleItems = generateSampleTrendingItems();

    const created = await prisma.trendingItem.createMany({
      data: sampleItems,
    });

    const items = await prisma.trendingItem.findMany({
      orderBy: { trendScore: "desc" },
      take: 10,
    });

    return NextResponse.json(
      { message: `Trending scan complete. Created ${created.count} items.`, items },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/trending error:", error);
    return NextResponse.json(
      { error: "Failed to run trending scan" },
      { status: 500 }
    );
  }
}
