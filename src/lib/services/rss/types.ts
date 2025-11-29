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
