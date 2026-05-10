import { NextRequest, NextResponse } from "next/server";
import { prisma, DEFAULT_USER_ID, ensureDefaultUser } from "@/lib/db";

const USER_ID = DEFAULT_USER_ID;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const network = searchParams.get("network");
    const period = searchParams.get("period");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const aggregate = searchParams.get("aggregate") === "true";

    const where: Record<string, unknown> = { userId: USER_ID };
    if (network) where.affiliateNetwork = network;
    if (period) where.period = period;
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);
      where.createdAt = dateFilter;
    }

    if (aggregate) {
      const earnings = await prisma.earning.groupBy({
        by: ["affiliateNetwork"],
        where,
        _sum: { amount: true },
        _count: { id: true },
        _avg: { amount: true },
      });

      const totalAmount = earnings.reduce(
        (sum, e) => sum + (e._sum.amount || 0),
        0
      );

      return NextResponse.json({
        aggregated: earnings.map((e) => ({
          network: e.affiliateNetwork,
          totalAmount: e._sum.amount || 0,
          averageAmount: e._avg.amount || 0,
          count: e._count.id,
        })),
        totalAmount,
      });
    }

    const earnings = await prisma.earning.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ earnings });
  } catch (error) {
    console.error("GET /api/earnings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch earnings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDefaultUser();

    const body = await req.json();
    const { affiliateNetwork, amount, currency, period, source, details } =
      body as {
        affiliateNetwork: string;
        amount: number;
        currency?: string;
        period: string;
        source?: string;
        details?: Record<string, string | number | boolean>;
      };

    if (!affiliateNetwork || amount === undefined || !period) {
      return NextResponse.json(
        { error: "affiliateNetwork, amount, and period are required" },
        { status: 400 }
      );
    }

    // In production: pull earnings data from affiliate network APIs
    // const amazonEarnings = await amazonAPI.getEarnings(dateRange);
    // const shareASaleEarnings = await shareASaleAPI.getEarnings(dateRange);

    const earning = await prisma.earning.create({
      data: {
        userId: USER_ID,
        affiliateNetwork,
        amount,
        currency: currency || "USD",
        period,
        source: source || undefined,
        details: details || undefined,
      },
    });

    return NextResponse.json({ earning }, { status: 201 });
  } catch (error) {
    console.error("POST /api/earnings error:", error);
    return NextResponse.json(
      { error: "Failed to create earning record" },
      { status: 500 }
    );
  }
}
