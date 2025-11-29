export const RSS_CONFIG = {
	feedUrl: "https://feeds.feedburner.com/TheHackersNews",
} as const;

export type RssConfig = {
	feedUrl: string;
};
