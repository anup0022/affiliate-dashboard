import { NextRequest } from "next/server";
import { prisma, DEFAULT_USER_ID, ensureDefaultUser } from "@/lib/db";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are AffiliateIQ Assistant, an expert affiliate marketing advisor. You help users choose the best affiliate products to promote, optimize their campaigns, and maximize earnings. You have access to trending data and can provide specific, actionable advice. Be concise but thorough.`;

const USER_ID = DEFAULT_USER_ID;

/**
 * Resolve which AI provider to use and return a configured OpenAI client + model name.
 * Priority: DB preference → env vars → whichever key is available.
 */
async function resolveProvider(): Promise<{
  client: OpenAI;
  model: string;
  provider: string;
} | null> {
  // 1. Check DB for saved provider preference and keys
  let preferredProvider = "openai"; // default
  let githubToken: string | null = null;
  let openaiKey: string | null = null;

  try {
    const creds = await prisma.apiCredential.findMany({
      where: { userId: USER_ID, isActive: true },
    });

    const providerPref = creds.find((c) => c.service === "ai-provider");
    if (providerPref) {
      preferredProvider = providerPref.apiKey; // stores "openai" or "github-copilot"
    }

    const ghCred = creds.find((c) => c.service === "github-copilot");
    if (ghCred) githubToken = ghCred.apiKey;

    const oaiCred = creds.find((c) => c.service === "openai");
    if (oaiCred) openaiKey = oaiCred.apiKey;
  } catch {
    // DB might not be accessible, fall through to env vars
  }

  // 2. Also check env vars
  if (!openaiKey) openaiKey = process.env.OPENAI_API_KEY || null;
  if (!githubToken) githubToken = process.env.GITHUB_TOKEN || null;

  // 3. Resolve based on preference
  if (preferredProvider === "github-copilot" && githubToken) {
    return {
      client: new OpenAI({
        apiKey: githubToken,
        baseURL: "https://models.inference.ai.azure.com",
      }),
      model: "gpt-4o-mini",
      provider: "GitHub Copilot",
    };
  }

  if (preferredProvider === "openai" && openaiKey) {
    return {
      client: new OpenAI({ apiKey: openaiKey }),
      model: "gpt-4o-mini",
      provider: "OpenAI",
    };
  }

  // 4. Fallback: try whichever key is available
  if (githubToken) {
    return {
      client: new OpenAI({
        apiKey: githubToken,
        baseURL: "https://models.inference.ai.azure.com",
      }),
      model: "gpt-4o-mini",
      provider: "GitHub Copilot",
    };
  }

  if (openaiKey) {
    return {
      client: new OpenAI({ apiKey: openaiKey }),
      model: "gpt-4o-mini",
      provider: "OpenAI",
    };
  }

  return null; // No provider available
}

export async function POST(req: NextRequest) {
  try {
    const resolved = await resolveProvider();

    if (!resolved) {
      return new Response(
        JSON.stringify({
          error:
            "No AI provider configured. Go to Settings → API Keys and add your OpenAI or GitHub Copilot token, then select your preferred provider in Settings → Preferences.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const { client, model, provider } = resolved;

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

    const response = await client.chat.completions.create({
      model,
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

          // Save messages to database
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
        "Invalid API key. Please check your key in Settings → API Keys.";
    } else if (error instanceof OpenAI.RateLimitError) {
      errorMessage =
        "Rate limit exceeded or insufficient credits. Check your billing or try GitHub Copilot as an alternative provider in Settings → Preferences.";
    } else if (error instanceof OpenAI.APIError) {
      errorMessage = `API error: ${error.message}`;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
