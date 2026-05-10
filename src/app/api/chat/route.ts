import { NextRequest } from "next/server";
import { prisma, DEFAULT_USER_ID, ensureDefaultUser } from "@/lib/db";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are AffiliateIQ Assistant, an expert affiliate marketing advisor. You help users choose the best affiliate products to promote, optimize their campaigns, and maximize earnings. You have access to trending data and can provide specific, actionable advice. Be concise but thorough.`;

const USER_ID = DEFAULT_USER_ID;

export async function POST(req: NextRequest) {
  try {
    // Check for OpenAI API key first
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "OpenAI API key is not configured. Please add your API key in Settings → API Keys, or set the OPENAI_API_KEY environment variable.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const openai = new OpenAI({ apiKey });

    const body = await req.json();
    const { message, history } = body as {
      message: string;
      history?: Array<{ role: string; content: string }>;
    };

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "message is required and must be a string" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    messages.push({ role: "user", content: message });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      stream: true,
    });

    let assistantContent = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              controller.enqueue(new TextEncoder().encode(delta));
            }
          }
          controller.close();

          // Save messages to database without blocking the stream
          // Using edge runtime compatible fetch to own API or direct DB call
          // In edge runtime, Prisma may not be available. If so, use a separate
          // endpoint or queue. Here we attempt a best-effort save.
          try {
            await ensureDefaultUser();
            await Promise.all([
              prisma.chatMessage.create({
                data: { userId: USER_ID, role: "user", content: message },
              }),
              prisma.chatMessage.create({
                data: { userId: USER_ID, role: "assistant", content: assistantContent },
              }),
            ]);
          } catch {
            console.error("Failed to save chat messages to database");
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);

    let errorMessage = "Failed to process chat message";
    if (error instanceof OpenAI.AuthenticationError) {
      errorMessage =
        "Invalid OpenAI API key. Please check your key in Settings → API Keys.";
    } else if (error instanceof OpenAI.RateLimitError) {
      errorMessage =
        "OpenAI rate limit exceeded or insufficient credits. Please check your OpenAI billing at platform.openai.com.";
    } else if (error instanceof OpenAI.APIError) {
      errorMessage = `OpenAI API error: ${error.message}`;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
