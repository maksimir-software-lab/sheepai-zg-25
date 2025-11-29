export const RSS_CONFIG = {
	feedUrl: "https://feeds.feedburner.com/TheHackersNews",
	contentSelector: ".articlebody",
	userAgent:
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
} as const;

export type RssConfig = {
	feedUrl: string;
	contentSelector: string;
	userAgent: string;
};
