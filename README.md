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

### Core Framework

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 14.2.35 | React framework with App Router, server components, API routes |
| [React](https://react.dev) | 18.3.1 | UI component library |
| [TypeScript](https://typescriptlang.org) | 5.x | Type-safe JavaScript |

### Styling & UI

| Technology | Version | Purpose |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com) | 3.4.19 | Utility-first CSS framework |
| [Radix UI](https://radix-ui.com) | Latest | Headless, accessible UI primitives (Dialog, Select, Tabs, Tooltip, Switch, Progress, ScrollArea, Separator, Avatar, Dropdown Menu) |
| [Lucide React](https://lucide.dev) | 1.14.0 | Icon library (200+ icons used across all pages) |
| [class-variance-authority](https://cva.style) | 0.7.1 | Component variant management for Button, Badge, etc. |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 3.5.0 | Merge Tailwind classes without conflicts |
| [clsx](https://github.com/lukeed/clsx) | 2.1.1 | Conditional className utility |
| [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) | 0.5.11 | Form element reset and styling |
| [DM Sans](https://fonts.google.com/specimen/DM+Sans) | — | Primary font (loaded via next/font/google) |

### Authentication

| Technology | Version | Purpose |
|---|---|---|
| [NextAuth.js](https://next-auth.js.org) | 4.24.14 | Authentication framework with JWT strategy |
| Google OAuth 2.0 | — | Social login via GoogleProvider |
| Credentials Provider | — | Email/password login fallback |

### Database & ORM

| Technology | Version | Purpose |
|---|---|---|
| [Prisma](https://prisma.io) | 6.19.3 | Type-safe ORM with schema migrations |
| [Supabase PostgreSQL](https://supabase.com) | — | Managed PostgreSQL database (free tier) |

**Database Models (9):** User, Account, Session, TrendingItem, AffiliateLink, Recommendation, AdCampaign, Earning, ChatMessage, ApiCredential

### AI & Data

| Technology | Version | Purpose |
|---|---|---|
| [OpenAI SDK](https://github.com/openai/openai-node) | 6.37.0 | GPT-4o-mini for AI chat (streaming) and ad copy generation |
| [SerpAPI](https://serpapi.com) | — | Google Trends data for trending product scanner |

### Charts & Data Visualization

| Technology | Version | Purpose |
|---|---|---|
| [Recharts](https://recharts.org) | 3.8.1 | Area charts (earnings over time), donut charts (revenue by network), bar charts (performance) |

### State Management

| Technology | Version | Purpose |
|---|---|---|
| [Zustand](https://zustand-demo.pmnd.rs) | 5.0.13 | Lightweight state management |
| React useState/useEffect | — | Local component state |

### Date Utilities

| Technology | Version | Purpose |
|---|---|---|
| [date-fns](https://date-fns.org) | 4.1.0 | Date formatting and manipulation |

### Build & Dev Tools

| Technology | Version | Purpose |
|---|---|---|
| [PostCSS](https://postcss.org) | 8.5.14 | CSS processing pipeline for Tailwind |
| [Autoprefixer](https://autoprefixer.github.io) | 10.5.0 | Automatic vendor prefixes |
| [ESLint](https://eslint.org) | 9.x | Code linting with Next.js config |

### Deployment & Hosting

| Technology | Purpose |
|---|---|
| [Vercel](https://vercel.com) | Production hosting with automatic deployments from GitHub |
| [GitHub](https://github.com) | Source code repository |

### Affiliate Networks Supported

| Network | Status |
|---|---|
| Amazon Associates | Supported (PA API requires 3 qualifying sales) |
| CJ Affiliate | Supported |
| ShareASale | Supported |
| Impact | Supported |
| ClickBank | Supported |

### Design System

- **Theme:** Clean light — white cards on gray-50 background
- **Primary Color:** Blue-600 (`#2563EB`)
- **Accent Color:** Emerald-500 for positive metrics
- **Font:** DM Sans (400, 500, 600, 700 weights)
- **Shadows:** Soft card shadows (`shadow-card`), elevated shadows (`shadow-raised`)
- **Style Inspiration:** Notion / Linear — warm minimal aesthetic
- **Components:** 14 reusable shadcn-style UI components

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page with Google OAuth
│   ├── (dashboard)/           # Dashboard layout with sidebar + header
│   │   ├── page.tsx           # Main dashboard
│   │   ├── trending/          # Trending products
│   │   ├── recommendations/   # AI recommendations
│   │   ├── chat/              # AI chat advisor
│   │   ├── links/             # Affiliate link management
│   │   ├── ads/               # Google Ads campaigns
│   │   ├── earnings/          # Earnings dashboard
│   │   ├── settings/          # API keys & preferences
│   │   └── help/              # Setup guides
│   └── api/                   # 8 API routes
├── components/
│   ├── ui/                    # 14 reusable UI components
│   ├── charts/                # Earnings, Network, Performance charts
│   ├── chat/                  # Chat message & input components
│   └── dashboard/             # Sidebar, Header, StatCard
├── lib/                       # Auth, DB, OpenAI, utilities
└── types/                     # TypeScript type definitions
prisma/
└── schema.prisma              # 9 database models
```

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

## License

Private — personal use only.
