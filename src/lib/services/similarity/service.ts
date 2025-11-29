import { and, cosineDistance, desc, eq, gte, sql } from "drizzle-orm";
import { articles, userInterests, userProfiles } from "@/db/schema";
import type { SimilarityDeps } from "./deps";
import type {
	ArticleSimilarityResult,
	InterestSimilarityResult,
	SimilarityOptions,
	SimilarityProvider,
	UserProfileSimilarityResult,
} from "./types";

export const createSimilarityService = (
	deps: SimilarityDeps,
): SimilarityProvider => {
	const { db, config } = deps;

	const findSimilarArticles = async (
		embedding: number[],
		options?: SimilarityOptions,
	): Promise<ArticleSimilarityResult[]> => {
		const topK = options?.topK ?? config.defaultTopK;
		const minSimilarity = options?.minSimilarity ?? config.defaultMinSimilarity;

		const similarity = sql<number>`1 - (${cosineDistance(articles.embedding, embedding)})`;

		const results = await db
			.select({
				article: articles,
				similarity,
			})
			.from(articles)
			.where(gte(similarity, minSimilarity))
			.orderBy(desc(similarity))
			.limit(topK);

		return results;
	};

	const findSimilarInterests = async (
		embedding: number[],
		userId: string,
		options?: SimilarityOptions,
	): Promise<InterestSimilarityResult[]> => {
		const topK = options?.topK ?? config.defaultTopK;
		const minSimilarity = options?.minSimilarity ?? config.defaultMinSimilarity;

		const similarity = sql<number>`1 - (${cosineDistance(userInterests.embedding, embedding)})`;

		const results = await db
			.select({
				interest: userInterests,
				similarity,
			})
			.from(userInterests)
			.where(
				and(eq(userInterests.userId, userId), gte(similarity, minSimilarity)),
			)
			.orderBy(desc(similarity))
			.limit(topK);

		return results;
	};

	const findSimilarUserProfiles = async (
		embedding: number[],
		options?: SimilarityOptions,
	): Promise<UserProfileSimilarityResult[]> => {
		const topK = options?.topK ?? config.defaultTopK;
		const minSimilarity = options?.minSimilarity ?? config.defaultMinSimilarity;

		const similarity = sql<number>`1 - (${cosineDistance(userProfiles.embedding, embedding)})`;

		const results = await db
			.select({
				profile: userProfiles,
				similarity,
			})
			.from(userProfiles)
			.where(gte(similarity, minSimilarity))
			.orderBy(desc(similarity))
			.limit(topK);

		return results;
	};

	return {
		findSimilarArticles,
		findSimilarInterests,
		findSimilarUserProfiles,
	};
};
