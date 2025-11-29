"use server";

import { services } from "@/lib/services";

export const scrapeRSS = async (rssUrl?: string) => {
	try {
		const articles = await services.rss.fetchFeedWithContent(rssUrl);

		return {
			success: true,
			data: articles,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
