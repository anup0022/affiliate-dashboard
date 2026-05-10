import { NextRequest, NextResponse } from "next/server";
import { prisma, DEFAULT_USER_ID, ensureDefaultUser } from "@/lib/db";

const USER_ID = DEFAULT_USER_ID;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");

    const where: Record<string, unknown> = { userId: USER_ID };
    if (status) where.status = status;
    if (platform) where.platform = platform;

    const campaigns = await prisma.adCampaign.findMany({
      where,
      include: { affiliateLink: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("GET /api/ads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ad campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDefaultUser();

    const body = await req.json();
    const {
      title,
      platform,
      affiliateLinkId,
      budget,
      adCopy,
      targetKeywords,
      startDate,
      endDate,
    } = body as {
      title: string;
      platform?: string;
      affiliateLinkId?: string;
      budget: number;
      adCopy?: string;
      targetKeywords?: string[];
      startDate?: string;
      endDate?: string;
    };

    if (!title || budget === undefined) {
      return NextResponse.json(
        { error: "title and budget are required" },
        { status: 400 }
      );
    }

    if (affiliateLinkId) {
      const link = await prisma.affiliateLink.findFirst({
        where: { id: affiliateLinkId, userId: USER_ID },
      });
      if (!link) {
        return NextResponse.json(
          { error: "Affiliate link not found" },
          { status: 404 }
        );
      }
    }

    // In production: call Google Ads API to create campaign
    // const googleAdsCampaign = await googleAdsClient.campaigns.create({ ... });

    const campaign = await prisma.adCampaign.create({
      data: {
        userId: USER_ID,
        title,
        platform: platform || "google",
        affiliateLinkId: affiliateLinkId || null,
        budget,
        adCopy: adCopy || null,
        targetKeywords: targetKeywords || [],
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: "draft",
      },
      include: { affiliateLink: true },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("POST /api/ads error:", error);
    return NextResponse.json(
      { error: "Failed to create ad campaign" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body as {
      id: string;
      title?: string;
      platform?: string;
      affiliateLinkId?: string;
      budget?: number;
      spent?: number;
      impressions?: number;
      clicks?: number;
      conversions?: number;
      status?: string;
      adCopy?: string;
      targetKeywords?: string[];
      startDate?: string;
      endDate?: string;
    };

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.adCampaign.findFirst({
      where: { id, userId: USER_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Ad campaign not found" },
        { status: 404 }
      );
    }

    // In production: sync status changes with Google Ads API
    // if (data.status === 'active') await googleAdsClient.campaigns.enable(existing.externalId);
    // if (data.status === 'paused') await googleAdsClient.campaigns.pause(existing.externalId);

    const updateData: Record<string, unknown> = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    const campaign = await prisma.adCampaign.update({
      where: { id },
      data: updateData,
      include: { affiliateLink: true },
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("PUT /api/ads error:", error);
    return NextResponse.json(
      { error: "Failed to update ad campaign" },
      { status: 500 }
    );
  }
}
