# TL;DR News aggregator

The news aggregator is a web application that delivers high relevance news articles to the user based on their interests and preferences. It utilitzes modern AI techniques.

The source of the news articles is the RSS feed of [The Hacker News](https://thehackernews.com/).

## Onboarding

1. The user gets asked what they do for work
2. Based on the users response, follow up questions are asked to refine the user's interests and preferences
3. Once the user has provided all necessary info, an LLM creates an interest template for the user
4. Based on this interest template, another LLM creates clusters templates to section interests
5. Embeddings are generated for each cluster template

## Recommendation Algorithm

1. RSS feed delivers new articles
2. Embeddings are generated for each article description
3. Similarity comparison between article embeddings and cluster templates is performed
4. Most similar cluster template is selected.
5. If article is above a similarity threshold to the cluster embedding, the article is recommended to the user
6. If article is not above the similarity threshold, the article is not recommended to the user
