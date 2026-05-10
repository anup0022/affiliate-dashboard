import { NextRequest, NextResponse } from "next/server";
import { prisma, DEFAULT_USER_ID, ensureDefaultUser } from "@/lib/db";

const USER_ID = DEFAULT_USER_ID;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const network = searchParams.get("network");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "createdAt";

    const where: Record<string, unknown> = { userId: USER_ID };
    if (network) where.affiliateNetwork = network;
    if (status) where.status = status;

    const orderByMap: Record<string, Record<string, string>> = {
      createdAt: { createdAt: "desc" },
      clicks: { clicks: "desc" },
      conversions: { conversions: "desc" },
      revenue: { revenue: "desc" },
    };

    const links = await prisma.affiliateLink.findMany({
      where,
      orderBy: orderByMap[sortBy] || { createdAt: "desc" },
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error("GET /api/affiliate-links error:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate links" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDefaultUser();

    const body = await req.json();
    const { title, url, affiliateNetwork, productName, category, commissionRate } =
      body as {
        title: string;
        url: string;
        affiliateNetwork: string;
        productName?: string;
        category?: string;
        commissionRate?: number;
      };

    if (!title || !url || !affiliateNetwork) {
      return NextResponse.json(
        { error: "title, url, and affiliateNetwork are required" },
        { status: 400 }
      );
    }

    const link = await prisma.affiliateLink.create({
      data: {
        userId: USER_ID,
        title,
        url,
        affiliateNetwork,
        productName: productName || null,
        category: category || null,
        commissionRate: commissionRate ?? null,
      },
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("POST /api/affiliate-links error:", error);
    return NextResponse.json(
      { error: "Failed to create affiliate link" },
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
      url?: string;
      affiliateNetwork?: string;
      productName?: string;
      category?: string;
      commissionRate?: number;
      status?: string;
      clicks?: number;
      conversions?: number;
      revenue?: number;
    };

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.affiliateLink.findFirst({
      where: { id, userId: USER_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Affiliate link not found" },
        { status: 404 }
      );
    }

    const link = await prisma.affiliateLink.update({
      where: { id },
      data,
    });

    return NextResponse.json({ link });
  } catch (error) {
    console.error("PUT /api/affiliate-links error:", error);
    return NextResponse.json(
      { error: "Failed to update affiliate link" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id search param is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.affiliateLink.findFirst({
      where: { id, userId: USER_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Affiliate link not found" },
        { status: 404 }
      );
    }

    await prisma.affiliateLink.delete({ where: { id } });

    return NextResponse.json({ message: "Affiliate link deleted" });
  } catch (error) {
    console.error("DELETE /api/affiliate-links error:", error);
    return NextResponse.json(
      { error: "Failed to delete affiliate link" },
      { status: 500 }
    );
  }
}
