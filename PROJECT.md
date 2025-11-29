# NewsEgg - TL;DR News Aggregator

NewsEgg is a web application that delivers relevant, professionally oriented news articles with AI-generated summaries and personalized recommendations. It learns from user behavior to create a personalized "For You" feed using embedding-based similarity matching.

The primary news source is the RSS feed of [The Hacker News](https://thehackernews.com/).

## Problem Statement

- Long articles: Prefer summarized version to decide if worthwhile
- Information overload: Want to follow only categories of interest
- Manual website checking: Receive curated updates
- Plain text articles: Want richer presentation with key facts

## User Experience

### Onboarding

Users go through a lightweight 2-step onboarding:

1. Describe themselves (e.g., "I'm a backend developer interested in security")
2. Select interest categories (Technology, Business, Science, Health, etc.)

These interests are embedded and stored to bootstrap personalization before engagement data exists.

### Dashboard

The main interface has two tabs:

- **For You**: Personalized feed ranked by similarity to user profile, recency, popularity, and exploration factor
- **Explore**: Recent articles with tag-based filtering and "Article of the Day" (most engaged article)

### Article Experience

- Article cards show title, summary, publish date, and relevance score
- Like/dislike buttons for explicit feedback
- Full article view with personalized TL;DR summary based on user interests
- Link to original source

### Search

Semantic search across all articles using embedding similarity.

## System Architecture

### Frontend

- Next.js 16 app router with React and TypeScript
- Tailwind CSS + shadcn/ui for mobile-first UI
- next-intl for internationalization
- Client hooks for engagement tracking, search, and feed management

### Backend

- Next.js server actions for all data operations
- Dependency-injected services layer in `src/lib/services`
- Pipelines in `src/lib/pipelines` for multi-step workflows

### Database

PostgreSQL with `pgvector` via Drizzle ORM on Neon.

**Tables:**

- `users`: Clerk-authenticated users (id, email)
- `articles`: title, summary, key_facts, content, embedding (2000 dimensions), source_url, timestamps
- `tags`: name, slug for categorization
- `article_tags`: many-to-many relationship
- `user_interests`: free-text interests with embeddings
- `user_tag_interests`: selected category interests
- `engagement_events`: open, expand_summary, like, dislike, scroll events with metadata
- `user_profiles`: continuously updated user embedding and engagement count
- `article_tldrs`: cached personalized/generic TL;DR summaries per article/user
- `newsletter_articles`: tracks which articles were sent in newsletters

All embedding columns use HNSW cosine indexes for fast similarity queries.

### External Services

- **OpenRouter**: LLM access (text generation, structured output) and embeddings
- **Supabase Storage**: Audio file storage for podcasts
- **Clerk**: Authentication
- **InfoBip**: Email delivery for newsletters

## AI Services Layer

### Embedding Service

- Generates 2000-dimension embeddings via OpenRouter
- Used for articles, user interests, and search queries
- Supports single and batch generation

### LLM Service

- Wraps Vercel AI SDK with OpenRouter provider
- `generateText`: free-form text generation
- `generateObject`: schema-driven JSON generation using Zod schemas

### Similarity Service

Uses Drizzle + pgvector for cosine similarity queries:

- `findSimilarArticles`: given an embedding, returns top-k similar articles
- `findSimilarInterests`: given an embedding and user, returns similar stored interests
- `findSimilarUserProfiles`: given an embedding, returns similar user profiles

## Pipelines & Services

### Article Ingestion Pipeline

1. RSS service fetches feed and scrapes full HTML content from each article
2. Article summary service generates summary, key facts, and tags via LLM
3. Embedding service computes embedding from summary + key facts
4. Tag service finds or creates tags and links them to the article
5. Article is stored with all metadata and embedding

### User Profile Service

Maintains a continuously updated user embedding:

1. Loads recent engagement events with article embeddings
2. Applies event-type weights (likes > opens, dislikes push away)
3. Applies temporal decay (recent interactions matter more)
4. Blends with explicit interest embeddings
5. Stores single user embedding in `user_profiles`

Profile updates are triggered after high-signal events (like/dislike) or after a threshold of low-signal events.

### Feed Service

**Personalized Feed:**

1. Load user embedding from `user_profiles`
2. If no profile exists, fall back to averaging user interest embeddings
3. If no interests, return recent articles
4. Query similar articles via cosine similarity
5. Filter out already-engaged articles
6. Score each candidate by combining:
   - Similarity to user embedding
   - Recency (exponential decay)
   - Popularity (trending score + like ratio)
   - Exploration factor (boosts unseen tags + random factor)
7. Return top-ranked articles

**Recent Feed:** Returns articles ordered by publish date.

**Search:** Embeds query and returns similar articles.

### Engagement Service

Records interaction events:

- `open`: user opened article
- `expand_summary`: user expanded TL;DR
- `like`/`dislike`: explicit feedback
- `scroll`: scroll behavior with duration metadata

Triggers profile updates when appropriate.

### Article TL;DR Service

Generates on-demand personalized summaries:

1. Check for cached TL;DR for article + user combination
2. If user has tag interests, generate personalized summary explaining relevance
3. Otherwise generate generic summary
4. Cache result for future requests

### Newsletter Service

Generates and sends personalized email digests:

1. Get personalized feed for user
2. Filter out already-sent articles
3. Generate overall TL;DR summarizing the batch
4. Generate detailed summary for each article
5. Generate podcast audio from articles
6. Build HTML email and send via InfoBip
7. Record sent articles to avoid duplicates

### Podcast Service

Generates audio podcasts from articles:

1. Fetch article data
2. Generate conversational script via LLM (supports different formats)
3. Generate speech segments via OpenAI TTS
4. Concatenate audio buffers
5. Upload to Supabase storage
6. Return public URL

### Storage Service

Manages file uploads to Supabase Storage with separate buckets:

- `files`: general files
- `images`: image assets
- `audio`: podcast audio files

## Frontend Hooks

- `useArticleFeed`: fetches and manages article feed state
- `useArticleEngagement`: handles like/dislike with optimistic updates
- `useArticleViewTracking`: tracks article opens
- `useArticleScrollTracking`: tracks scroll behavior
- `useSearch`: semantic search with loading/error states
- `useUserInterests`: manages user interest CRUD

## Cron Jobs

- `/api/cron/ingest`: Scheduled article ingestion from RSS feed

## Configuration

All services use dependency injection with configurable options:

- Feed weights (similarity, recency, popularity, exploration)
- Embedding dimensions
- Event weights for profile updates
- Temporal decay rates
- Rate limits and batch sizes
