export const FEED_CONFIG = {
	defaultLimit: 20,
	defaultMinSimilarity: 0.0,
} as const;

export type FeedConfig = {
	defaultLimit: number;
	defaultMinSimilarity: number;
};
