export type RawFeedItem = {
	title: string;
	description: string;
	link: string;
	pubDate: Date | null;
	author?: string;
};

export type ScrapedArticle = {
	title: string;
	description: string;
	link: string;
	pubDate: Date | null;
	author?: string;
	contentHtml: string;
	contentMarkdown: string;
};

export type IRssService = {
	fetchFeed: (feedUrl?: string) => Promise<RawFeedItem[]>;
	fetchFeedWithContent: (feedUrl?: string) => Promise<ScrapedArticle[]>;
	scrapeArticleContent: (
		url: string,
	) => Promise<{ html: string | null; markdown: string | null }>;
};
