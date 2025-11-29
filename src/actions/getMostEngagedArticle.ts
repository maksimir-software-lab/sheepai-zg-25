"use server";

import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { articles, engagementEvents } from "@/db/schema";

export const getMostEngagedArticle = async () => {
	try {
		const result = await db
			.select({
				id: articles.id,
				title: articles.title,
				summary: articles.summary,
				sourceUrl: articles.sourceUrl,
				publishedAt: articles.publishedAt,
				engagementCount: count(engagementEvents.id),
			})
			.from(articles)
			.leftJoin(engagementEvents, eq(articles.id, engagementEvents.articleId))
			.groupBy(articles.id)
			.orderBy(desc(count(engagementEvents.id)))
			.limit(1);

		if (result.length === 0) {
			return {
				success: false,
				error: "No articles found",
			};
		}

		const article = result.at(0);
		return {
			success: true,
			article: article
				? {
						id: article.id,
						title: article.title,
						summary: article.summary,
						sourceUrl: article.sourceUrl,
						publishedAt: article.publishedAt,
					}
				: undefined,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
