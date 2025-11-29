import type { articles, userInterests, userProfiles } from "@/db/schema";

export type SimilarityOptions = {
	topK?: number;
	minSimilarity?: number;
};

export type ArticleSimilarityResult = {
	article: typeof articles.$inferSelect;
	similarity: number;
};

export type InterestSimilarityResult = {
	interest: typeof userInterests.$inferSelect;
	similarity: number;
};

export type UserProfileSimilarityResult = {
	profile: typeof userProfiles.$inferSelect;
	similarity: number;
};

export type SimilarityProvider = {
	findSimilarArticles: (
		embedding: number[],
		options?: SimilarityOptions,
	) => Promise<ArticleSimilarityResult[]>;
	findSimilarInterests: (
		embedding: number[],
		userId: string,
		options?: SimilarityOptions,
	) => Promise<InterestSimilarityResult[]>;
	findSimilarUserProfiles: (
		embedding: number[],
		options?: SimilarityOptions,
	) => Promise<UserProfileSimilarityResult[]>;
};

