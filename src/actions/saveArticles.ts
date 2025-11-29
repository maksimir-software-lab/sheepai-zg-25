"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import type { ScrapedArticle } from "@/lib/rssScraper";

export async function saveArticles(scrapedArticles: ScrapedArticle[]) {
	try {
		const savedArticles = [];

		for (const article of scrapedArticles) {
			if (!article.content || !article.mainContentMarkdown) {
				continue;
			}

			const existingArticle = await db
				.select()
				.from(articles)
				.where(eq(articles.sourceUrl, article.sourceUrl))
				.limit(1);

			if (existingArticle.length > 0) {
				continue;
			}

			const result = await db
				.insert(articles)
				.values({
					title: article.title,
					summary: article.summary,
					content: article.content,
					embedding: article.embedding,
					sourceUrl: article.sourceUrl,
					publishedAt: article.publishedAt,
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
}
