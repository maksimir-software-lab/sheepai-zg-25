"use server";

import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";

export const getForYouArticles = async () => {
	try {
		const forYouArticles = await db
			.select({
				id: articles.id,
				title: articles.title,
				summary: articles.summary,
				sourceUrl: articles.sourceUrl,
				publishedAt: articles.publishedAt,
			})
			.from(articles)
			.orderBy(desc(articles.publishedAt))
			.limit(5);

		return {
			success: true,
			articles: forYouArticles,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};

export const getExploreArticles = async () => {
	try {
		const exploreArticles = await db
			.select({
				id: articles.id,
				title: articles.title,
				summary: articles.summary,
				sourceUrl: articles.sourceUrl,
				publishedAt: articles.publishedAt,
			})
			.from(articles)
			.orderBy(desc(articles.publishedAt))
			.limit(25)
			.offset(5);

		return {
			success: true,
			articles: exploreArticles,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
