# AffiliateIQ

Smart affiliate marketing dashboard with trending product scanner, AI chat advisor, and earnings tracking.

**Live:** [https://affiliate-dashboard-livid.vercel.app](https://affiliate-dashboard-livid.vercel.app)

## Features

- **Dashboard** — Earnings overview, stat cards, setup checklist, charts
- **Trending Scanner** — Discover trending products with trend scores
- **AI Chat Advisor** — GPT-powered affiliate marketing advice (streaming)
- **Recommendations** — AI-generated product recommendations with confidence scores
- **Affiliate Links** — Manage links across Amazon, CJ, ShareASale, Impact, ClickBank
- **Google Ads** — Campaign management with AI ad copy generation
- **Earnings** — Revenue tracking with charts, breakdowns, CSV export
- **Settings** — Connect API keys for all services
- **Help & Setup** — Step-by-step guides for every integration

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 3, DM Sans font
- **Auth:** NextAuth.js v4 (Google OAuth + Credentials)
- **Database:** Supabase PostgreSQL via Prisma ORM
- **AI:** OpenAI GPT-4o-mini (streaming)
- **Charts:** Recharts
- **Hosting:** Vercel

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/anup0022/affiliate-dashboard.git
   cd affiliate-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```

4. Generate Prisma client and push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth sessions |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for dev) |
| `OPENAI_API_KEY` | OpenAI API key for AI chat |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SERPAPI_KEY` | SerpAPI key for Google Trends data |
