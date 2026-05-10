import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Validation rules per service
const SERVICE_RULES: Record<
  string,
  {
    prefix?: string;
    minLength: number;
    label: string;
    liveCheck?: boolean;
  }
> = {
  openai: {
    prefix: "sk-",
    minLength: 20,
    label: "OpenAI",
    liveCheck: true,
  },
  serpapi: {
    minLength: 20,
    label: "SerpAPI",
    liveCheck: true,
  },
  "google-ads": {
    minLength: 10,
    label: "Google Ads",
  },
  amazon: {
    minLength: 10,
    label: "Amazon Associates",
  },
  cj: {
    minLength: 10,
    label: "CJ Affiliate",
  },
  shareasale: {
    minLength: 8,
    label: "ShareASale",
  },
  impact: {
    minLength: 10,
    label: "Impact",
  },
  clickbank: {
    minLength: 8,
    label: "ClickBank",
  },
  reddit: {
    minLength: 10,
    label: "Reddit",
  },
};

async function validateOpenAI(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const client = new OpenAI({ apiKey, timeout: 10000 });
    // Lightweight call — just list models (no tokens used)
    await client.models.list();
    return { valid: true };
  } catch (err) {
    if (err instanceof OpenAI.AuthenticationError) {
      return { valid: false, error: "Invalid API key. Check your key at platform.openai.com/api-keys" };
    }
    if (err instanceof OpenAI.RateLimitError) {
      return {
        valid: false,
        error: "API key is valid but rate-limited or has no credits. Check your billing at platform.openai.com",
      };
    }
    return {
      valid: false,
      error: `Could not verify key: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

async function validateSerpAPI(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const url = `https://serpapi.com/account.json?api_key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      return { valid: true };
    }
    if (res.status === 401) {
      return { valid: false, error: "Invalid SerpAPI key. Get yours at serpapi.com/manage-api-key" };
    }
    return { valid: false, error: `SerpAPI returned status ${res.status}` };
  } catch {
    return { valid: false, error: "Could not reach SerpAPI. Check your network connection." };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, apiKey } = body as { service: string; apiKey: string };

    if (!service || !apiKey) {
      return NextResponse.json(
        { valid: false, error: "service and apiKey are required" },
        { status: 400 }
      );
    }

    const rules = SERVICE_RULES[service];
    if (!rules) {
      return NextResponse.json(
        { valid: false, error: `Unknown service: ${service}` },
        { status: 400 }
      );
    }

    // --- Format checks ---
    const trimmed = apiKey.trim();
    if (trimmed.length < rules.minLength) {
      return NextResponse.json({
        valid: false,
        error: `${rules.label} API key is too short. Expected at least ${rules.minLength} characters.`,
      });
    }

    if (rules.prefix && !trimmed.startsWith(rules.prefix)) {
      return NextResponse.json({
        valid: false,
        error: `${rules.label} API key should start with "${rules.prefix}".`,
      });
    }

    // --- Live validation for supported services ---
    if (service === "openai") {
      const result = await validateOpenAI(trimmed);
      return NextResponse.json(result);
    }

    if (service === "serpapi") {
      const result = await validateSerpAPI(trimmed);
      return NextResponse.json(result);
    }

    // For other services, format check passed — accept it
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("POST /api/settings/validate-key error:", error);
    return NextResponse.json(
      { valid: false, error: "Validation failed due to a server error" },
      { status: 500 }
    );
  }
}
