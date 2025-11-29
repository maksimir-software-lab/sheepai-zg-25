export type RawFeedItem = {
	title: string;
	description: string;
	link: string;
	pubDate: Date | null;
};

export type IRssService = {
	fetchFeed: () => Promise<RawFeedItem[]>;
};
