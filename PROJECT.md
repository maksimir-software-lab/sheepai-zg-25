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
