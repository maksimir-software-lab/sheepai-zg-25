# TL;DR News Aggregator

A personalized news aggregator that delivers relevant, professionally-oriented news articles with AI-generated summaries. Built for the SheepAI Zagreb 2025 hackathon.

## Overview

TL;DR learns from your reading behavior to create a personalized "For You" feed—no manual configuration required. The app uses a TikTok-style learning model to adapt to your interests based on:

- Opening articles
- Expanding summaries
- Liking/disliking content
- Scroll behavior

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 with App Router |
| **Language** | TypeScript 5.9 |
| **Frontend** | React 19.2, Tailwind CSS 4.1, Radix UI |
| **Database** | PostgreSQL (Neon) with pgvector, Drizzle ORM |
| **Authentication** | Clerk |
| **AI** | OpenRouter, OpenAI, Vercel AI SDK |
| **Internationalization** | next-intl |
| **Package Manager** | Bun |
| **Linting** | Biome |

## Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [Neon](https://neon.tech/) PostgreSQL database with pgvector extension
- [Clerk](https://clerk.com/) account for authentication
- [OpenRouter](https://openrouter.ai/) API key for AI features
- [Supabase](https://supabase.com/) account (for storage)

## Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd sheepai-zg-25
bun install
```

### 2. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `DATABASE_URL_MAIN` | Main branch database URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `CRON_SECRET` | Secret for cron job authentication |

Optional:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_AUTH_DISABLED` | Set to `true` to disable auth (dev only) |
| `INFOBIP_API_KEY` | Infobip API key for notifications |
| `INFOBIP_BASE_URL` | Infobip base URL |

### 3. Database Setup

Run the Neon setup script:

```bash
chmod +x scripts/neon-setup.sh
bun neon:setup
```

Generate and run migrations:

```bash
bun db:generate
bun db:migrate
```

### 4. Start Development Server

```bash
bun dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun check` | Run Biome linting and formatting |
| `bun db:generate` | Generate database migrations |
| `bun db:migrate` | Run database migrations |
| `bun neon:setup` | Run Neon database setup script |
| `bun ingest` | Ingest articles from RSS feeds |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── actions/          # Server actions
├── components/       # React components
│   ├── ui/          # shadcn/Radix UI components
│   ├── organisms/   # Complex layouts
│   ├── molecules/   # Reusable component groups
│   └── atoms/       # Basic building blocks
├── db/              # Database layer (Drizzle ORM)
│   ├── schema.ts    # Table definitions
│   └── migrations/  # Migration files
├── hooks/           # Custom React hooks
├── lib/             # Utilities and services
│   ├── services/    # AI and business logic services
│   └── pipelines/   # Data processing pipelines
├── messages/        # Translation files (i18n)
└── prompts/         # AI prompt templates
```

## Key Features

- **Personalized Feed**: AI-driven article recommendations based on reading behavior
- **TL;DR Summaries**: AI-generated summaries, key facts, and "why this matters"
- **Semantic Search**: Find articles by meaning using vector embeddings
- **No Onboarding**: Learns preferences automatically from engagement
- **Mobile-First**: Responsive design optimized for mobile devices

## Architecture

The app uses a service-oriented architecture with:

- **AI Services Layer**: Embedding, LLM, and similarity services
- **Pipelines**: Article ingestion, user profiling, and recommendation ranking
- **Event-Driven Personalization**: Engagement events update user embeddings in real-time

See [PROJECT.md](./PROJECT.md) for detailed architecture documentation.

