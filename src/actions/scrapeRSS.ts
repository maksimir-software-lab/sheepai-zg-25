"use server";

import { services } from "@/lib/services";
import { saveArticles } from "./saveArticles";

export const scrapeRSS = async (rssUrl?: string) => {
	try {
		const articles = await services.rss.fetchFeedWithContent(rssUrl);

		const saveResult = await saveArticles(articles);

		if (!saveResult.success) {
			return {
				success: false,
				error: saveResult.error,
			};
		}

		return {
			success: true,
			totalScraped: articles.length,
			savedCount: saveResult.count ?? 0,
			articles: saveResult.articles?.map((article) => ({
				id: article?.id,
				title: article?.title,
				sourceUrl: article?.sourceUrl,
				publishedAt: article?.publishedAt,
			})),
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
