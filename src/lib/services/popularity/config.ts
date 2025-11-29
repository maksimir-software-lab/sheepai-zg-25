export const POPULARITY_CONFIG = {
	defaultTrendingWindowHours: 48,
	engagementWeights: {
		open: 1,
		expand_summary: 2,
		like: 3,
		dislike: -1,
		scroll: 0.5,
	},
} as const;

export type PopularityConfig = typeof POPULARITY_CONFIG;
