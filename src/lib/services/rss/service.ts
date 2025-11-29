import * as cheerio from "cheerio";
import Parser from "rss-parser";
import TurndownService from "turndown";
import type { RssDeps } from "./deps";
import type { RawFeedItem, ScrapedArticle } from "./types";

export type IRssService = {
	fetchFeed: (feedUrl?: string) => Promise<RawFeedItem[]>;
	fetchFeedWithContent: (feedUrl?: string) => Promise<ScrapedArticle[]>;
	scrapeArticleContent: (
		url: string,
	) => Promise<{ html: string | null; markdown: string | null }>;
};

export const createRssService = (deps: RssDeps): IRssService => {
	const { config } = deps;
	const parser = new Parser();

	const cleanText = (text: string): string => {
		return text.replace(/[^\x20-\x7E\n\r\t]/g, "").trim();
	};

	const scrapeArticleContent = async (
		url: string,
	): Promise<{ html: string | null; markdown: string | null }> => {
		try {
			const response = await fetch(url, {
				headers: {
					"User-Agent": config.userAgent,
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const html = await response.text();
			const $ = cheerio.load(html);

			const articleBody = $(config.contentSelector);

			if (articleBody.length === 0) {
				return { html: null, markdown: null };
			}

			articleBody.find("a[href] img[src^='data:image']").each((_, element) => {
				const img = $(element);
				const link = img.parent("a");

				if (link.length > 0) {
					const realUrl = link.attr("href");

					if (realUrl) {
						img.attr("src", realUrl);
					}
				}
			});

			const mainContentHtml = articleBody.html();

			if (!mainContentHtml) {
				return { html: null, markdown: null };
			}

			const turndownService = new TurndownService({
				headingStyle: "atx",
				codeBlockStyle: "fenced",
			});

			const markdown = turndownService.turndown(mainContentHtml);

			return { html: mainContentHtml, markdown };
		} catch (error) {
			console.error(`Error scraping ${url}:`, error);
			return { html: null, markdown: null };
		}
	};

	const fetchFeed = async (feedUrl?: string): Promise<RawFeedItem[]> => {
		const targetUrl = feedUrl ?? config.feedUrl;
		const feed = await parser.parseURL(targetUrl);

		return feed.items.map((item) => ({
			title: cleanText(item.title ?? ""),
			description: cleanText(item.contentSnippet ?? item.content ?? ""),
			link: item.link ?? "",
			pubDate: item.pubDate ? new Date(item.pubDate) : null,
			author: item.creator ?? item.author,
		}));
	};

	const fetchFeedWithContent = async (
		feedUrl?: string,
	): Promise<ScrapedArticle[]> => {
		const feedItems = await fetchFeed(feedUrl);

		const scrapedArticlesWithNulls = await Promise.all(
			feedItems.map(async (item) => {
				const { html, markdown } = await scrapeArticleContent(item.link);

				if (!markdown || !html) {
					return null;
				}

				return {
					...item,
					contentHtml: html,
					contentMarkdown: markdown,
				};
			}),
		);

		return scrapedArticlesWithNulls.filter(
			(article): article is ScrapedArticle => article !== null,
		);
	};

	return {
		fetchFeed,
		fetchFeedWithContent,
		scrapeArticleContent,
	};
};
