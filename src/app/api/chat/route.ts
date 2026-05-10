import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are AffiliateIQ Assistant, an expert affiliate marketing advisor. You help users choose the best affiliate products to promote, optimize their campaigns, and maximize earnings. You have access to trending data and can provide specific, actionable advice. Be concise but thorough.`;

const USER_ID = "user_default";

export async function POST(req: NextRequest) {
  try {
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
            // Edge runtime note: if Prisma doesn't work in edge, wrap this
            // in a separate serverless function call. For now we attempt it.
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
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
