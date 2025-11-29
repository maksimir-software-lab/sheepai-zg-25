export const FEED_CONFIG = {
	defaultLimit: 20,
	defaultMinSimilarity: 0.0,

	weights: {
		similarity: 0.4,
		recency: 0.25,
		popularity: 0.2,
		exploration: 0.15,
	},

	recencyDecayDays: 7,

	explorationBoostForUnseenTags: 0.3,
	randomExplorationFactor: 0.1,

	candidateMultiplier: 3,
} as const;

export type FeedConfig = typeof FEED_CONFIG;
