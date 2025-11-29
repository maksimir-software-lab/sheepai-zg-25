"use server";

import { scrapeRSSFeed } from "@/lib/rssScraper";

export async function scrapeRSS(rssUrl: string) {
	try {
		const articles = await scrapeRSSFeed(rssUrl);

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
}
