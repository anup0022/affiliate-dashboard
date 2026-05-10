import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const USER_ID = "user_default";

function maskKey(key: string): string {
  if (key.length <= 4) return "****";
  return "*".repeat(key.length - 4) + key.slice(-4);
}

export async function GET() {
  try {
    const credentials = await prisma.apiCredential.findMany({
      where: { userId: USER_ID },
      orderBy: { createdAt: "desc" },
    });

    const masked = credentials.map((cred) => ({
      id: cred.id,
      service: cred.service,
      apiKey: maskKey(cred.apiKey),
      apiSecret: cred.apiSecret ? maskKey(cred.apiSecret) : null,
      accessToken: cred.accessToken ? maskKey(cred.accessToken) : null,
      isActive: cred.isActive,
      createdAt: cred.createdAt,
      updatedAt: cred.updatedAt,
    }));

    return NextResponse.json({ credentials: masked });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch API credentials" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, apiKey, apiSecret, accessToken, isActive } = body as {
      service: string;
      apiKey: string;
      apiSecret?: string;
      accessToken?: string;
      isActive?: boolean;
    };

    if (!service || !apiKey) {
      return NextResponse.json(
        { error: "service and apiKey are required" },
        { status: 400 }
      );
    }

    const credential = await prisma.apiCredential.upsert({
      where: {
        userId_service: { userId: USER_ID, service },
      },
      update: {
        apiKey,
        apiSecret: apiSecret || null,
        accessToken: accessToken || null,
        isActive: isActive ?? true,
      },
      create: {
        userId: USER_ID,
        service,
        apiKey,
        apiSecret: apiSecret || null,
        accessToken: accessToken || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      credential: {
        id: credential.id,
        service: credential.service,
        apiKey: maskKey(credential.apiKey),
        isActive: credential.isActive,
        createdAt: credential.createdAt,
        updatedAt: credential.updatedAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to save API credential" },
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

    const existing = await prisma.apiCredential.findFirst({
      where: { id, userId: USER_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "API credential not found" },
        { status: 404 }
      );
    }

    await prisma.apiCredential.delete({ where: { id } });

    return NextResponse.json({ message: "API credential deleted" });
  } catch (error) {
    console.error("DELETE /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to delete API credential" },
      { status: 500 }
    );
  }
}
