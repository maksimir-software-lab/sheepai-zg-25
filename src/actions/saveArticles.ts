"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import type { ScrapedArticle } from "@/lib/services/rss/types";

const EMBEDDING_DIMENSIONS = 2000;

export const saveArticles = async (scrapedArticles: ScrapedArticle[]) => {
	try {
		const savedArticles = [];
		const placeholderEmbedding = Array.from(
			{ length: EMBEDDING_DIMENSIONS },
			() => 0,
		);

		for (const article of scrapedArticles) {
			if (!article.contentMarkdown) {
				continue;
			}

			const existingArticle = await db
				.select()
				.from(articles)
				.where(eq(articles.sourceUrl, article.link))
				.limit(1);

			if (existingArticle.length > 0) {
				continue;
			}

			const result = await db
				.insert(articles)
				.values({
					title: article.title,
					summary: article.description,
					keyFacts: [],
					content: article.contentMarkdown,
					embedding: placeholderEmbedding,
					sourceUrl: article.link,
					publishedAt: article.pubDate,
				})
				.returning();

			savedArticles.push(result.at(0));
		}

		return {
			success: true,
			count: savedArticles.length,
			articles: savedArticles,
		};
	} catch (error) {
		console.error("Error saving articles:", error);

		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
