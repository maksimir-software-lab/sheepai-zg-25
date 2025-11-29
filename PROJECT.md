# TL;DR News Aggregator

The TL;DR News Aggregator is a web application that delivers highly relevant, professionally oriented news articles with concise summaries and key facts. It adapts dynamically to the user's reading behavior using modern AI techniques and a TikTok-style learning model.

The sole source of news is the RSS feed of [The Hacker News](https://thehackernews.com/).

## Problem Statement

- Long articles: Prefer summarized version to decide is it worthwhile  
- Falsely generated information: Require high-confident, reliable content  
- Large amount of news: Wants to follow only categories of interest  
- Manual website checking: Receive scheduled updates  
- Plain text articles: Wants richer presentation formats  

## User Experience

The application requires **no explicit onboarding** or manual preference setup.  
Instead of asking the user what they want, it learns from what they actually engage with.

Upon opening the app, users immediately receive:

- A personalized “For You” feed
- Professionally relevant categories (e.g., Security, AI, New Tools, Research, Industry News)
- TL;DR summaries, key facts, and “Why this matters”

All personalization happens automatically based on reading behavior:

- Opening articles  
- Expanding summaries  
- Liking / disliking  
- Scrolling behavior (quick skip vs. slow read)

This creates a **fast-adapting professional news feed** without user configuration.

## Explorative Search

To avoid filter bubbles and encourage discovery, users can:

- Search across all summarized articles (embedding based search)
- Browse topic-based sections  
- View trending/high-impact stories (based on recence, urgency and user engagement)

Exploration signals also improve personalization.

## Recommendation Algorithm

1. RSS feed delivers new articles  
2. LLM generates a TL;DR, key facts, tags
3. Embeddings are generated for articles using summary + key facts  
4. A user embedding is continuously updated from engagement behavior  
5. Similarity, relevance, recency, and popularity are all combined into a dynamic score  
6. Articles are ranked to produce a personalized, real-time “For You” feed  
7. An exploration factor ensures new, diverse topics are always shown  

This approach is extendable in the future to additional RSS feeds or custom sources, while remaining fully focused on Hacker News for the hackathon version.

## System Architecture

- Frontend
  - Next.js app router with React and TypeScript
  - Tailwind CSS + shadcn/ui for a mobile-first UI
  - Client components collect engagement events (open, expand summary, like, dislike, scroll) and send them to the backend
- Backend
  - Next.js server actions and route handlers encapsulate use-cases (fetch feed, record engagement, add interest)
  - A dedicated services layer in `src/lib/services` provides small, composable AI and similarity building blocks
  - Domain-specific pipelines in `src/lib` orchestrate services to implement the recommendation algorithm
- Database
  - PostgreSQL with `pgvector` via Drizzle ORM
  - Core tables:
    - `articles`: title, raw content, summary, embedding, source URL, timestamps
    - `users`: authenticated users
    - `user_interests`: manual interests as embeddings
    - `engagement_events`: fine-grained interaction events
    - `user_profiles`: continuously updated user embedding and engagement metadata
- AI Layer
  - All AI access is routed through a thin services layer
  - Dependency injection allows easy swapping of models or providers without touching business logic

## AI Services Layer

The AI layer is split into three atomic, composable services:

- Embedding Service
  - Generates high-dimensional embeddings from text (e.g. article summaries, user interests)
  - Backed by OpenRouter’s embedding API and `pgvector` in the database
  - Used wherever the system needs to map text into the shared semantic space
- LLM Service
  - Generates TL;DRs, key facts, tags, and other structured outputs
  - Wraps the OpenRouter provider for the Vercel AI SDK
  - Exposes two main entrypoints:
    - `generateText`: free-form text generation
    - `generateObject`: schema-driven JSON generation using Zod schemas
- Similarity Service
  - Uses Drizzle ORM + `pgvector` to run fast cosine similarity queries
  - Provides focused functions:
    - `findSimilarArticles`: given an embedding, returns top-k similar articles
    - `findSimilarInterests`: given an embedding and user, returns similar stored interests
    - `findSimilarUserProfiles`: given an embedding, returns similar user profiles
  - Also supports generic similarity queries for future use-cases

## AI Pipelines

These services are composed into higher-level, domain-specific pipelines that implement the full recommendation loop.

### Article Ingestion Pipeline

1. RSS feed fetcher pulls new Hacker News articles on a schedule.
2. The LLM service generates a TL;DR, key facts, tags, and “why this matters” for each article.
3. The embedding service computes an embedding from the summary + key facts (and optionally the title).
4. The article, summary, metadata, and embedding are stored in the `articles` table, indexed with an HNSW cosine index.

This creates the semantic corpus that all personalization and search operate on.

### User Interest Pipeline

1. Users can explicitly add interests (e.g. “AI security”, “Kubernetes performance”).
2. The embedding service embeds the interest text into the same vector space as articles.
3. The embedding is stored in `user_interests` for that user.
4. The similarity service can immediately surface articles similar to these interests.

Explicit interests act as strong, stable anchors for personalization.

### Engagement → User Profile Pipeline

1. Every interaction is logged in `engagement_events` with:
   - `event_type`: open, expand_summary, like, dislike, scroll
   - `article_id`, `user_id`, and optional metadata (such as scroll duration)
2. On a schedule or after a threshold of new events, the system:
   - Loads the user’s recent events within a sliding time window
   - Applies event-type weights (likes > opens, dislikes push the profile away)
   - Applies temporal decay so recent interactions matter more than old ones
3. The pipeline combines:
   - Weighted article embeddings from engagement events
   - Manual interest embeddings from `user_interests`
4. It computes a single user embedding and writes it to `user_profiles`:
   - `embedding`: the current representation of the user’s interests
   - `engagement_count`: number of events considered
   - `last_updated_at`: used for cache invalidation and staleness checks

This creates a continuously adapting user representation without explicit onboarding.

### Recommendation & Ranking Pipeline

1. When a user requests their “For You” feed:
   - The system loads the user embedding from `user_profiles`
   - If none exists yet, it falls back to a cold-start strategy (e.g. trending articles)
2. The similarity service retrieves a candidate set of similar articles using cosine similarity against `articles.embedding`.
3. Candidates are post-processed:
   - Filter out articles the user has already read or quickly skipped
   - Optionally enforce a minimum similarity threshold
4. Each candidate is scored by combining:
   - Similarity to the user embedding
   - Recency (time decay)
   - Popularity (engagement-driven or click-through based)
   - Exploration factor (boosts less-seen tags or topics)
5. The top-ranked articles are returned as the “For You” feed and category feeds.

This pipeline closes the loop: as users interact, their profile embedding shifts, which changes which articles are most relevant.

### Explorative Search Pipeline

On top of the same article embeddings, the system supports:

- Semantic search over summaries and key facts using the similarity service
- Topic-based sections backed by tags generated by the LLM service
- Trending views that combine recency and global engagement metrics

Signals from search and exploration feed back into `engagement_events`, improving future personalization.
