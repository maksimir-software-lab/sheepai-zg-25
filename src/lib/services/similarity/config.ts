export const SIMILARITY_CONFIG = {
	defaultTopK: 10,
	defaultMinSimilarity: 0.0,
} as const;

export type SimilarityConfig = {
	defaultTopK: number;
	defaultMinSimilarity: number;
};
