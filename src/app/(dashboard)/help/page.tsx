"use client"

import { useState } from "react"
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Zap,
  Database,
  Bot,
  ShoppingCart,
  Share2,
  Megaphone,
  TrendingUp,
  MessageSquare,
  Key,
  Globe,
  CreditCard,
  Shield,
  Rocket,
  BookOpen,
  AlertTriangle,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────
interface GuideStep {
  step: number
  title: string
  description: string
  code?: string
  link?: { url: string; label: string }
  warning?: string
  tip?: string
}

interface GuideSection {
  id: string
  icon: React.ElementType
  title: string
  subtitle: string
  difficulty: "Easy" | "Medium" | "Advanced"
  estimatedTime: string
  category: string
  steps: GuideStep[]
}

// ── Copy button ────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

// ── Code block ─────────────────────────────────────────
function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative mt-2 rounded-lg bg-gray-900 border border-gray-800 overflow-hidden">
      <CopyButton text={code} />
      <pre className="p-4 pr-12 text-sm text-emerald-400 font-mono overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ── All guide data ─────────────────────────────────────
const guides: GuideSection[] = [
  {
    id: "getting-started",
    icon: Rocket,
    title: "Getting Started",
    subtitle: "First-time setup to get AffiliateIQ running on your machine",
    difficulty: "Easy",
    estimatedTime: "5 min",
    category: "Setup",
    steps: [
      {
        step: 1,
        title: "Install Dependencies",
        description: "Open your terminal, navigate to the project folder, and install all required packages.",
        code: "cd affiliate-dashboard\nnpm install",
      },
      {
        step: 2,
        title: "Create your Environment File",
        description: "Copy the example environment file. This file holds all your secret keys and settings. Never share this file with anyone.",
        code: "cp .env.example .env",
        warning: "The .env file contains sensitive data. It is already in .gitignore so it won't be pushed to GitHub.",
      },
      {
        step: 3,
        title: "Set up the Database",
        description: "You need a PostgreSQL database. The easiest free option is Supabase (see the Database Setup guide below). Once you have a database URL, add it to your .env file.",
        code: 'DATABASE_URL="postgresql://user:password@host:5432/dbname"',
      },
      {
        step: 4,
        title: "Push the Database Schema",
        description: "This creates all the required tables in your database. Run this command once after setting up your database.",
        code: "npx prisma db push",
      },
      {
        step: 5,
        title: "Start the App",
        description: "Launch the development server and open the app in your browser.",
        code: "npm run dev",
        tip: "The app will open at http://localhost:3000. If port 3000 is in use, it will try 3001.",
      },
    ],
  },
  {
    id: "database-setup",
    icon: Database,
    title: "Database Setup (Supabase)",
    subtitle: "Set up a free PostgreSQL database using Supabase",
    difficulty: "Easy",
    estimatedTime: "5 min",
    category: "Setup",
    steps: [
      {
        step: 1,
        title: "Create a Supabase Account",
        description: "Go to Supabase and sign up for a free account using your GitHub or email.",
        link: { url: "https://supabase.com", label: "supabase.com" },
      },
      {
        step: 2,
        title: "Create a New Project",
        description: "Click 'New Project', choose a name (e.g. 'affiliate-dashboard'), set a strong database password, and select a region close to you. Save the password somewhere safe.",
        tip: "Choose a region closest to where you'll deploy the app for best performance.",
      },
      {
        step: 3,
        title: "Get your Database URL",
        description: "Go to Project Settings > Database. Find the 'Connection string' section and click 'URI'. Copy the connection string.",
      },
      {
        step: 4,
        title: "Add to your .env File",
        description: "Replace [YOUR-PASSWORD] with the database password you set in step 2.",
        code: 'DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres"',
      },
      {
        step: 5,
        title: "Push the Schema",
        description: "Run this command to create all required tables in your Supabase database.",
        code: "npx prisma db push",
        tip: "You can view your tables in the Supabase dashboard under 'Table Editor'.",
      },
    ],
  },
  {
    id: "openai-setup",
    icon: Bot,
    title: "Connect OpenAI (AI Chat & Recommendations)",
    subtitle: "Get an OpenAI API key to power the AI Chat Advisor and smart recommendations",
    difficulty: "Easy",
    estimatedTime: "3 min",
    category: "AI",
    steps: [
      {
        step: 1,
        title: "Create an OpenAI Account",
        description: "Go to OpenAI's platform and sign up or log in.",
        link: { url: "https://platform.openai.com", label: "platform.openai.com" },
      },
      {
        step: 2,
        title: "Add Billing (Pay-as-you-go)",
        description: "Go to Settings > Billing and add a payment method. OpenAI charges per API call. For normal use, expect $5-20/month. You can set a monthly spending limit to control costs.",
        link: { url: "https://platform.openai.com/settings/organization/billing/overview", label: "OpenAI Billing" },
        tip: "Start with a $10 spending limit. You can always increase it later.",
      },
      {
        step: 3,
        title: "Generate an API Key",
        description: "Go to API Keys page, click 'Create new secret key', give it a name like 'AffiliateIQ', and copy the key immediately. You won't be able to see it again.",
        link: { url: "https://platform.openai.com/api-keys", label: "OpenAI API Keys" },
        warning: "Copy and save your API key immediately. OpenAI will not show it again after you close the dialog.",
      },
      {
        step: 4,
        title: "Add to your .env File",
        description: "Paste your API key into the .env file.",
        code: 'OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxx"',
      },
      {
        step: 5,
        title: "Add via Settings Page (Alternative)",
        description: "You can also add your API key directly in the app. Go to Settings > API Keys > OpenAI, paste your key, and click 'Save & Connect'.",
        tip: "The AI Chat and AI Recommendations features will start working immediately after adding the key.",
      },
    ],
  },
  {
    id: "amazon-associates",
    icon: ShoppingCart,
    title: "Connect Amazon Associates",
    subtitle: "Set up Amazon's affiliate program to earn commissions on product referrals",
    difficulty: "Medium",
    estimatedTime: "15 min",
    category: "Affiliate Networks",
    steps: [
      {
        step: 1,
        title: "Sign Up for Amazon Associates",
        description: "Go to the Amazon Associates homepage and click 'Sign Up'. You'll need an Amazon account. Fill in your website/app info, preferred store ID, and how you drive traffic.",
        link: { url: "https://affiliate-program.amazon.com", label: "Amazon Associates" },
      },
      {
        step: 2,
        title: "Get your Associate Tag",
        description: "After approval, your Associate Tag (also called Tracking ID) is shown in the top-left of your Associates dashboard. It looks like 'yourname-20'.",
        tip: "You can create multiple tracking IDs for different campaigns to track performance separately.",
      },
      {
        step: 3,
        title: "Get Product Advertising API Access",
        description: "To pull product data and earnings automatically, you need API access. Go to Tools > Product Advertising API in your Associates dashboard. You need at least 3 qualifying sales in the first 180 days to get API access.",
        link: { url: "https://affiliate-program.amazon.com/assoc_credentials/home", label: "PA API Credentials" },
        warning: "API access requires 3 qualifying sales first. You can still use AffiliateIQ with manual link entry while building up sales.",
      },
      {
        step: 4,
        title: "Generate API Credentials",
        description: "Once approved for the API, click 'Add Credentials'. You'll receive an Access Key and Secret Key.",
      },
      {
        step: 5,
        title: "Add to your .env File",
        description: "Add all three values to your .env file.",
        code: 'AMAZON_ASSOCIATE_TAG="yourname-20"\nAMAZON_ACCESS_KEY="AKIAIOSFODNN7EXAMPLE"\nAMAZON_SECRET_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"',
      },
      {
        step: 6,
        title: "Start Creating Links",
        description: "Go to Affiliate Links in the dashboard, click 'Add New Link', select 'Amazon' as the network, and paste any Amazon product URL. You can find product links using Amazon's SiteStripe toolbar on amazon.com.",
        tip: "Use the Amazon SiteStripe bar (appears at the top of Amazon when logged in as an Associate) to quickly generate affiliate links while browsing.",
      },
    ],
  },
  {
    id: "cj-affiliate",
    icon: Share2,
    title: "Connect CJ Affiliate",
    subtitle: "Join CJ (formerly Commission Junction) to access thousands of advertiser programs",
    difficulty: "Medium",
    estimatedTime: "10 min",
    category: "Affiliate Networks",
    steps: [
      {
        step: 1,
        title: "Sign Up at CJ Affiliate",
        description: "Go to CJ.com and click 'Sign Up' as a Publisher. Fill out your profile including your website and traffic information.",
        link: { url: "https://www.cj.com", label: "cj.com" },
      },
      {
        step: 2,
        title: "Wait for Approval",
        description: "CJ will review your application. This usually takes 1-3 business days. You'll receive an email when approved.",
        tip: "Having an active website with some content significantly improves approval chances.",
      },
      {
        step: 3,
        title: "Join Advertiser Programs",
        description: "Once approved, go to Advertisers > Browse and apply to individual advertiser programs. Some auto-approve while others may take a few days.",
      },
      {
        step: 4,
        title: "Get your API Key",
        description: "Go to Account > API Access in your CJ dashboard. Click 'Request API Key'. Once approved, copy your personal API key.",
        link: { url: "https://members.cj.com/member/publisher/home.do", label: "CJ Dashboard" },
      },
      {
        step: 5,
        title: "Add to your .env File",
        description: "Paste your CJ API key.",
        code: 'CJ_API_KEY="your-cj-api-key-here"',
      },
      {
        step: 6,
        title: "Connect in Settings",
        description: "Go to Settings > API Keys > CJ Affiliate, paste the key, and click 'Save & Connect'. Your CJ earnings will start syncing automatically.",
      },
    ],
  },
  {
    id: "shareasale",
    icon: Share2,
    title: "Connect ShareASale",
    subtitle: "Join ShareASale for access to a wide range of merchant affiliate programs",
    difficulty: "Medium",
    estimatedTime: "10 min",
    category: "Affiliate Networks",
    steps: [
      {
        step: 1,
        title: "Sign Up as an Affiliate",
        description: "Go to ShareASale and sign up as an affiliate. You'll need a website URL and basic information about your promotion methods.",
        link: { url: "https://www.shareasale.com/info/affiliates/", label: "ShareASale Affiliates" },
      },
      {
        step: 2,
        title: "Complete your Profile",
        description: "After sign-up, complete your profile and payment information. ShareASale requires W-9 (US) or W-8BEN (international) tax forms.",
      },
      {
        step: 3,
        title: "Get API Credentials",
        description: "Go to Tools > Links > ShareASale API in your dashboard. You'll find your API Token and API Secret. You also need your Affiliate ID (shown in the top-right of the dashboard).",
        link: { url: "https://account.shareasale.com/a-apiManager.cfm", label: "ShareASale API Manager" },
      },
      {
        step: 4,
        title: "Add to your .env File",
        description: "Add both your API key and secret.",
        code: 'SHAREASALE_API_KEY="your-affiliate-id"\nSHARESALE_SECRET="your-api-secret"',
      },
      {
        step: 5,
        title: "Connect in Settings",
        description: "Go to Settings > API Keys > ShareASale, enter your credentials, and click 'Save & Connect'.",
        tip: "ShareASale has thousands of merchants. Browse their marketplace to find products in your niche.",
      },
    ],
  },
  {
    id: "impact",
    icon: Share2,
    title: "Connect Impact",
    subtitle: "Join Impact partnership platform used by many popular SaaS and DTC brands",
    difficulty: "Medium",
    estimatedTime: "10 min",
    category: "Affiliate Networks",
    steps: [
      {
        step: 1,
        title: "Sign Up at Impact",
        description: "Go to Impact.com and sign up as a Partner (affiliate). Fill in your website, social media, and promotion details.",
        link: { url: "https://impact.com", label: "impact.com" },
      },
      {
        step: 2,
        title: "Apply to Brand Programs",
        description: "Once your account is active, browse the marketplace and apply to brands you want to promote. Popular brands on Impact include Canva, Hostinger, Semrush, and many more.",
      },
      {
        step: 3,
        title: "Get API Credentials",
        description: "Go to Settings > API in your Impact dashboard. You'll find your Account SID and Auth Token.",
      },
      {
        step: 4,
        title: "Add to your .env File",
        description: "Add your Impact credentials.",
        code: 'IMPACT_ACCOUNT_SID="your-account-sid"\nIMPACT_AUTH_TOKEN="your-auth-token"',
      },
      {
        step: 5,
        title: "Connect in Settings",
        description: "Go to Settings > API Keys > Impact, enter your credentials, and click 'Save & Connect'.",
        tip: "Impact is widely used by SaaS companies. If you're in the tech/software niche, this is a must-have network.",
      },
    ],
  },
  {
    id: "clickbank",
    icon: CreditCard,
    title: "Connect ClickBank",
    subtitle: "Access digital products and info-products through ClickBank's marketplace",
    difficulty: "Easy",
    estimatedTime: "5 min",
    category: "Affiliate Networks",
    steps: [
      {
        step: 1,
        title: "Create a ClickBank Account",
        description: "Go to ClickBank and click 'Start Here'. Fill in your personal information to create an account. ClickBank is free to join.",
        link: { url: "https://www.clickbank.com", label: "clickbank.com" },
      },
      {
        step: 2,
        title: "Get your Nickname (Account ID)",
        description: "Your ClickBank nickname is your unique affiliate ID. You'll use this to generate hoplinks (affiliate links) for products.",
      },
      {
        step: 3,
        title: "Get API Credentials",
        description: "Go to Settings > API Keys in your ClickBank dashboard. Create a new API key with permissions for Reporting and Analytics.",
      },
      {
        step: 4,
        title: "Add to your .env File",
        description: "Add your ClickBank API credentials.",
        code: 'CLICKBANK_API_KEY="your-clerk-api-key"\nCLICKBANK_SECRET="your-developer-api-key"',
      },
      {
        step: 5,
        title: "Browse the Marketplace",
        description: "Explore the ClickBank marketplace to find high-gravity products (high gravity = many affiliates making sales). Add products you want to promote via the Affiliate Links page.",
        link: { url: "https://www.clickbank.com/marketplace/", label: "ClickBank Marketplace" },
        tip: "Look for products with a Gravity score above 30 and a good commission rate (many offer 50-75% on digital products).",
      },
    ],
  },
  {
    id: "google-ads",
    icon: Megaphone,
    title: "Set Up Google Ads",
    subtitle: "Run paid ad campaigns for your affiliate products directly from the dashboard",
    difficulty: "Advanced",
    estimatedTime: "30 min",
    category: "Advertising",
    steps: [
      {
        step: 1,
        title: "Create a Google Ads Account",
        description: "Go to Google Ads and create an account. You'll need a Google account. During setup, you can skip creating your first campaign (choose 'Switch to Expert Mode' then 'Create account without a campaign').",
        link: { url: "https://ads.google.com", label: "Google Ads" },
        tip: "Start with 'Expert Mode' to have full control over your campaigns.",
      },
      {
        step: 2,
        title: "Set Up Billing",
        description: "Go to Tools > Billing > Settings and add a payment method. Google Ads charges you based on your ad spend.",
        warning: "Set a daily budget limit to avoid unexpected charges. Start small ($5-10/day) while testing.",
      },
      {
        step: 3,
        title: "Get your Customer ID",
        description: "Your Google Ads Customer ID is the 10-digit number shown in the top-right of your Google Ads dashboard (format: xxx-xxx-xxxx). Remove the dashes when adding to .env.",
      },
      {
        step: 4,
        title: "Apply for API Access (Developer Token)",
        description: "Go to Tools > API Center in your Google Ads account. Apply for a Developer Token. For personal use, choose 'Basic Access'. This approval process can take 1-2 weeks.",
        link: { url: "https://ads.google.com/aw/apicenter", label: "Google Ads API Center" },
        warning: "Developer token approval takes 1-2 weeks. You can use the dashboard with mock data while waiting.",
      },
      {
        step: 5,
        title: "Create OAuth 2.0 Credentials",
        description: "Go to Google Cloud Console > APIs & Services > Credentials. Create an OAuth 2.0 Client ID (type: Web Application). Add http://localhost:3000/api/auth/callback/google as an authorized redirect URI.",
        link: { url: "https://console.cloud.google.com/apis/credentials", label: "Google Cloud Console" },
      },
      {
        step: 6,
        title: "Generate a Refresh Token",
        description: "Use the OAuth 2.0 Playground or the google-ads-api library to generate a refresh token. This allows the app to access your Google Ads account without you logging in each time.",
        link: { url: "https://developers.google.com/oauthplayground/", label: "OAuth 2.0 Playground" },
      },
      {
        step: 7,
        title: "Add to your .env File",
        description: "Add all your Google Ads credentials.",
        code: 'GOOGLE_ADS_CLIENT_ID="your-oauth-client-id.apps.googleusercontent.com"\nGOOGLE_ADS_CLIENT_SECRET="your-oauth-client-secret"\nGOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"\nGOOGLE_ADS_REFRESH_TOKEN="your-refresh-token"\nGOOGLE_ADS_CUSTOMER_ID="1234567890"',
      },
      {
        step: 8,
        title: "Test the Connection",
        description: "Go to the Google Ads page in the dashboard. If the warning banner disappears and you see 'Connected' status, you're good to go. Try creating a test campaign with a small budget.",
        tip: "Start with a $5/day budget on a single product to learn how Google Ads works before scaling up.",
      },
    ],
  },
  {
    id: "google-trends",
    icon: TrendingUp,
    title: "Set Up Google Trends (SerpAPI)",
    subtitle: "Enable real-time trending data scanning using Google Trends via SerpAPI",
    difficulty: "Easy",
    estimatedTime: "5 min",
    category: "Data Sources",
    steps: [
      {
        step: 1,
        title: "Create a SerpAPI Account",
        description: "SerpAPI provides easy access to Google Trends data. Sign up for a free account (100 free searches/month).",
        link: { url: "https://serpapi.com", label: "serpapi.com" },
        tip: "The free tier gives you 100 searches/month which is enough for daily trending scans.",
      },
      {
        step: 2,
        title: "Get your API Key",
        description: "After sign-up, go to your Dashboard. Your API key is displayed right on the main page.",
        link: { url: "https://serpapi.com/dashboard", label: "SerpAPI Dashboard" },
      },
      {
        step: 3,
        title: "Add to your .env File",
        description: "Paste your SerpAPI key.",
        code: 'GOOGLE_TRENDS_API_KEY="your-serpapi-key-here"',
      },
      {
        step: 4,
        title: "Test the Trending Scanner",
        description: "Go to the Trending page in the dashboard and click 'Scan Now'. You should see real trending data populate within a few seconds.",
      },
    ],
  },
  {
    id: "reddit-api",
    icon: MessageSquare,
    title: "Set Up Reddit API",
    subtitle: "Pull trending topics and discussions from Reddit for product research",
    difficulty: "Easy",
    estimatedTime: "5 min",
    category: "Data Sources",
    steps: [
      {
        step: 1,
        title: "Go to Reddit App Preferences",
        description: "Log into Reddit and go to your app preferences page.",
        link: { url: "https://www.reddit.com/prefs/apps", label: "Reddit App Preferences" },
      },
      {
        step: 2,
        title: "Create a New App",
        description: "Scroll down and click 'create another app'. Choose 'script' type, give it a name like 'AffiliateIQ', set the redirect URI to http://localhost:3000, and click 'create app'.",
      },
      {
        step: 3,
        title: "Copy your Credentials",
        description: "After creating the app, you'll see a Client ID (under the app name) and a Secret. Copy both.",
      },
      {
        step: 4,
        title: "Add to your .env File",
        description: "Add your Reddit app credentials.",
        code: 'REDDIT_CLIENT_ID="your-reddit-client-id"\nREDDIT_CLIENT_SECRET="your-reddit-client-secret"',
      },
      {
        step: 5,
        title: "Connect in Settings",
        description: "Go to Settings > API Keys > Reddit, enter your credentials, and click 'Save & Connect'. The Trending Scanner will now include Reddit data.",
        tip: "Reddit is great for finding trending products in subreddits like r/BuyItForLife, r/deals, and niche communities.",
      },
    ],
  },
  {
    id: "nextauth-setup",
    icon: Shield,
    title: "Authentication Setup (NextAuth)",
    subtitle: "Configure secure login for your dashboard",
    difficulty: "Easy",
    estimatedTime: "2 min",
    category: "Setup",
    steps: [
      {
        step: 1,
        title: "Set NextAuth Secret",
        description: "Generate a random secret string for NextAuth. You can use the command below or make up a long random string (at least 32 characters).",
        code: "openssl rand -base64 32",
      },
      {
        step: 2,
        title: "Add to your .env File",
        description: "Add the secret and the URL where your app runs.",
        code: 'NEXTAUTH_SECRET="your-generated-secret-here"\nNEXTAUTH_URL="http://localhost:3000"',
        tip: "When you deploy to Vercel, change NEXTAUTH_URL to your production URL.",
      },
      {
        step: 3,
        title: "Create your Admin Account",
        description: "For now, you can create your user directly in the database. Go to Supabase > Table Editor > User table, and add a row with your email and a password. Or simply use Google Sign-In — your account will be created automatically on first login.",
        tip: "Using Google Sign-In is the easiest option. Just set up Google OAuth (see the guide below) and sign in — no manual database entry needed.",
      },
    ],
  },
  {
    id: "google-oauth",
    icon: Globe,
    title: "Set Up Google Sign-In",
    subtitle: "Let users sign in with their Google account — no password needed",
    difficulty: "Easy",
    estimatedTime: "5 min",
    category: "Setup",
    steps: [
      {
        step: 1,
        title: "Go to Google Cloud Console",
        description: "Open the Google Cloud Console and sign in with your Google account. If you don't have a project yet, create one (e.g. 'AffiliateIQ').",
        link: { url: "https://console.cloud.google.com", label: "Google Cloud Console" },
      },
      {
        step: 2,
        title: "Enable the Google+ API",
        description: "Go to APIs & Services > Library. Search for 'Google+ API' (or 'Google Identity') and click 'Enable'. This allows your app to use Google sign-in.",
        link: { url: "https://console.cloud.google.com/apis/library", label: "API Library" },
      },
      {
        step: 3,
        title: "Configure OAuth Consent Screen",
        description: "Go to APIs & Services > OAuth consent screen. Choose 'External' user type. Fill in: App name ('AffiliateIQ'), User support email, and Developer contact email. Click 'Save and Continue' through the remaining steps.",
        link: { url: "https://console.cloud.google.com/apis/credentials/consent", label: "OAuth Consent Screen" },
        tip: "For personal use, you can leave the app in 'Testing' mode — you just need to add your own email as a test user.",
      },
      {
        step: 4,
        title: "Create OAuth Client ID",
        description: "Go to APIs & Services > Credentials. Click 'Create Credentials' > 'OAuth client ID'. Choose 'Web application'. Add these Authorized redirect URIs:\n• http://localhost:3000/api/auth/callback/google (for local dev)\n• https://your-app.vercel.app/api/auth/callback/google (for production)",
        link: { url: "https://console.cloud.google.com/apis/credentials", label: "Credentials Page" },
        warning: "The redirect URI must match exactly — including the path /api/auth/callback/google. If it doesn't match, Google sign-in will fail.",
      },
      {
        step: 5,
        title: "Copy Client ID and Secret",
        description: "After creating the OAuth client, Google will show you the Client ID and Client Secret. Copy both values.",
        warning: "Save these credentials somewhere safe. You can always find them again in the Credentials page, but it's good practice to keep a backup.",
      },
      {
        step: 6,
        title: "Add to your .env File",
        description: "Paste your Google OAuth credentials into the .env file.",
        code: 'GOOGLE_CLIENT_ID="123456789-abcdef.apps.googleusercontent.com"\nGOOGLE_CLIENT_SECRET="GOCSPX-your-secret-here"',
      },
      {
        step: 7,
        title: "Test Google Sign-In",
        description: "Restart your dev server (npm run dev) and go to the login page. You should see a 'Continue with Google' button. Click it to sign in with your Google account. Your user account will be created automatically on first sign-in.",
        tip: "If you're in 'Testing' mode on Google Cloud, make sure your Google email is added as a test user in the OAuth consent screen settings.",
      },
    ],
  },
  {
    id: "deploy-vercel",
    icon: Globe,
    title: "Deploy to Vercel",
    subtitle: "Make your dashboard live on the internet with Vercel's free hosting",
    difficulty: "Medium",
    estimatedTime: "10 min",
    category: "Deployment",
    steps: [
      {
        step: 1,
        title: "Push Code to GitHub",
        description: "Create a GitHub repository and push your project code. Make sure .env is NOT committed (it's already in .gitignore).",
        code: "git init\ngit add .\ngit commit -m \"Initial commit\"\ngit remote add origin https://github.com/yourusername/affiliate-dashboard.git\ngit push -u origin main",
      },
      {
        step: 2,
        title: "Sign Up on Vercel",
        description: "Go to Vercel and sign up with your GitHub account.",
        link: { url: "https://vercel.com", label: "vercel.com" },
      },
      {
        step: 3,
        title: "Import your Project",
        description: "Click 'New Project', select your affiliate-dashboard repository from GitHub, and click 'Import'.",
      },
      {
        step: 4,
        title: "Add Environment Variables",
        description: "Before deploying, add ALL your environment variables from .env into Vercel's Environment Variables section. Add each key-value pair one by one.",
        warning: "Do NOT skip this step. The app will not work without environment variables configured in Vercel.",
      },
      {
        step: 5,
        title: "Deploy",
        description: "Click 'Deploy'. Vercel will build and deploy your app. You'll get a live URL like https://affiliate-dashboard.vercel.app.",
        tip: "You can add a custom domain in Vercel's project settings for a more professional look.",
      },
      {
        step: 6,
        title: "Update NEXTAUTH_URL",
        description: "After deployment, update the NEXTAUTH_URL environment variable in Vercel to your production URL.",
        code: 'NEXTAUTH_URL="https://your-app.vercel.app"',
      },
    ],
  },
]

// ── Difficulty badge colors ────────────────────────────
const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Advanced: "bg-red-50 text-red-700 border border-red-200",
}

// ── Category colors ────────────────────────────────────
const categoryColors: Record<string, string> = {
  Setup: "bg-blue-50 text-blue-700 border border-blue-200",
  AI: "bg-purple-50 text-purple-700 border border-purple-200",
  "Affiliate Networks": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Advertising: "bg-orange-50 text-orange-700 border border-orange-200",
  "Data Sources": "bg-teal-50 text-teal-700 border border-teal-200",
  Deployment: "bg-pink-50 text-pink-700 border border-pink-200",
}

// ── Icon background colors per category ────────────────
const iconColors: Record<string, { bg: string; text: string }> = {
  Setup: { bg: "bg-blue-50", text: "text-blue-600" },
  AI: { bg: "bg-purple-50", text: "text-purple-600" },
  "Affiliate Networks": { bg: "bg-indigo-50", text: "text-indigo-600" },
  Advertising: { bg: "bg-orange-50", text: "text-orange-600" },
  "Data Sources": { bg: "bg-teal-50", text: "text-teal-600" },
  Deployment: { bg: "bg-pink-50", text: "text-pink-600" },
}

// ── Expandable guide component ─────────────────────────
function GuideCard({ guide }: { guide: GuideSection }) {
  const [expanded, setExpanded] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const Icon = guide.icon
  const allDone = completedSteps.length === guide.steps.length
  const colors = iconColors[guide.category] || { bg: "bg-gray-50", text: "text-gray-600" }

  function toggleStep(step: number) {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    )
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl border shadow-sm transition-all duration-200",
        expanded ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-100 hover:border-gray-200"
      )}
    >
      {/* Header - clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", colors.bg)}>
              <Icon className={cn("h-5 w-5", colors.text)} />
            </div>

            {/* Title area */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-base font-semibold text-gray-900">{guide.title}</h3>
                {allDone && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 line-clamp-1">{guide.subtitle}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", difficultyColors[guide.difficulty])}>
                  {guide.difficulty}
                </span>
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", categoryColors[guide.category])}>
                  {guide.category}
                </span>
                <span className="text-xs text-gray-400">~{guide.estimatedTime}</span>
                <span className="text-xs text-gray-400">
                  {completedSteps.length}/{guide.steps.length} steps
                </span>
              </div>
            </div>

            {/* Expand chevron */}
            <div className="shrink-0 pt-1 text-gray-400">
              {expanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </div>

          {/* Progress bar */}
          {completedSteps.length > 0 && !allDone && (
            <div className="mt-3 ml-15">
              <div className="h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(completedSteps.length / guide.steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </button>

      {/* Expanded steps */}
      {expanded && (
        <div className="px-5 pb-5">
          <div className="ml-0 md:ml-15 space-y-6 border-t border-gray-100 pt-5">
            {guide.steps.map((s) => {
              const done = completedSteps.includes(s.step)
              return (
                <div key={s.step} className="relative">
                  {/* Step header */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleStep(s.step)}
                      className="shrink-0 mt-0.5"
                      title={done ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={cn(
                          "text-sm font-semibold",
                          done ? "text-gray-400 line-through" : "text-gray-900"
                        )}
                      >
                        Step {s.step}: {s.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                        {s.description}
                      </p>

                      {/* Link */}
                      {s.link && (
                        <a
                          href={s.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {s.link.label}
                        </a>
                      )}

                      {/* Code block */}
                      {s.code && <CodeBlock code={s.code} />}

                      {/* Warning */}
                      {s.warning && (
                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
                          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800 leading-relaxed">{s.warning}</p>
                        </div>
                      )}

                      {/* Tip */}
                      {s.tip && (
                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-200 px-3 py-2.5">
                          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800 leading-relaxed">{s.tip}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────
export default function HelpPage() {
  const [filter, setFilter] = useState<string>("All")
  const categories = ["All", "Setup", "AI", "Affiliate Networks", "Advertising", "Data Sources", "Deployment"]

  const filtered =
    filter === "All" ? guides : guides.filter((g) => g.category === filter)

  const totalSteps = guides.reduce((sum, g) => sum + g.steps.length, 0)

  return (
    <div className="space-y-8 max-w-4xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Help & Setup Guide
            </h1>
            <p className="text-gray-500">
              Step-by-step instructions to configure everything
            </p>
          </div>
        </div>
      </div>

      {/* Quick start banner */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Start</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              New here? Follow these 3 steps to get started:
              <span className="font-semibold text-gray-900"> Getting Started</span> {"→"}{" "}
              <span className="font-semibold text-gray-900">Database Setup</span> {"→"}{" "}
              <span className="font-semibold text-gray-900">Connect OpenAI</span>.
              Everything else is optional and can be added later.
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>{guides.length} guides</span>
              <span>{totalSteps} total steps</span>
              <span>~90 min for full setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all",
              filter === cat
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            )}
          >
            {cat}
            {cat !== "All" && (
              <span className="ml-1.5 text-[10px] opacity-70">
                ({guides.filter((g) => g.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Guides list */}
      <div className="space-y-3">
        {filtered.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>

      {/* Footer help text */}
      <div className="text-center py-6 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Need more help? Use the{" "}
          <span className="text-blue-600 font-medium">AI Chat</span> for any questions about setup, configuration, or affiliate marketing strategies.
        </p>
      </div>
    </div>
  )
}
