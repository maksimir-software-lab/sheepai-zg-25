"use server";

import { gte, notInArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";

export const getRandomArticle = async (excludeIds: string[] = []) => {
	try {
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);

		const conditions = [gte(articles.publishedAt, todayStart)];

		if (excludeIds.length > 0) {
			conditions.push(notInArray(articles.id, excludeIds));
		}

		const result = await db
			.select({
				id: articles.id,
				title: articles.title,
				summary: articles.summary,
				sourceUrl: articles.sourceUrl,
				publishedAt: articles.publishedAt,
			})
			.from(articles)
			.orderBy(sql`RANDOM()`)
			.limit(1);

		if (result.length === 0) {
			return {
				success: false,
				error: "No articles found",
			};
		}

		return {
			success: true,
			article: result.at(0),
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
