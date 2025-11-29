"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";

export const getArticle = async (id: string) => {
	try {
		const article = await db
			.select({
				id: articles.id,
				title: articles.title,
				summary: articles.summary,
				content: articles.content,
				sourceUrl: articles.sourceUrl,
				publishedAt: articles.publishedAt,
			})
			.from(articles)
			.where(eq(articles.id, id))
			.limit(1);

		if (article.length === 0) {
			return {
				success: false,
				error: "Article not found",
			};
		}

		return {
			success: true,
			article: article.at(0),
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
