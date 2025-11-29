import * as cheerio from "cheerio";
import Parser from "rss-parser";
import TurndownService from "turndown";

interface RSSItem {
	title: string;
	link: string;
	pubDate: string;
	author?: string;
	description?: string;
}

export interface ScrapedArticle {
	title: string;
	summary: string;
	content: string;
	embedding: number[];
	sourceUrl: string;
	publishedAt: Date | null;
	author?: string;
	description?: string;
	mainContent: string | null;
	mainContentMarkdown: string | null;
	error?: string;
}

const scrapeArticleContent = async (
	url: string,
): Promise<{ html: string | null; markdown: string | null }> => {
	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const html = await response.text();
		const $ = cheerio.load(html);

		const articleBody = $(".articlebody");

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

export const scrapeRSSFeed = async (
	rssUrl: string,
): Promise<ScrapedArticle[]> => {
	const parser = new Parser();

	try {
		const feed = await parser.parseURL(rssUrl);

		const scrapedArticlesWithNulls = await Promise.all(
			feed.items.map(async (item) => {
				const articleData: RSSItem = {
					title: item.title ?? "",
					link: item.link ?? "",
					pubDate: item.pubDate ?? "",
					author: item.creator ?? item.author,
					description: item.contentSnippet ?? item.content,
				};

				const { html, markdown } = await scrapeArticleContent(articleData.link);

				if (!markdown || !html) {
					return null;
				}

				const dummyEmbedding = Array.from({ length: 3_072 }, () => 0);

				const publishedDate = articleData.pubDate
					? new Date(articleData.pubDate)
					: null;

				const cleanDescription =
					articleData.description?.replace(/[^\x20-\x7E\n\r\t]/g, "").trim() ||
					"No summary available";

				const cleanTitle = articleData.title
					.replace(/[^\x20-\x7E\n\r\t]/g, "")
					.trim();

				const scrapedArticle: ScrapedArticle = {
					title: cleanTitle,
					summary: cleanDescription.slice(0, 500),
					content: markdown,
					embedding: dummyEmbedding,
					sourceUrl: articleData.link,
					publishedAt: publishedDate,
					author: articleData.author,
					description: cleanDescription,
					mainContent: html,
					mainContentMarkdown: markdown,
					error: undefined,
				};

				return scrapedArticle;
			}),
		);

		const scrapedArticles = scrapedArticlesWithNulls.filter(
			(article): article is ScrapedArticle => article !== null,
		);

		return scrapedArticles;
	} catch (error) {
		console.error("Error parsing RSS feed:", error);
		throw new Error(`Failed to parse RSS feed: ${error}`);
	}
};
