import { desc, eq, sql } from "drizzle-orm";
import { articles, userInterests } from "@/db/schema";
import type { FeedDeps } from "./deps";
import type { Article, FeedArticle, FeedOptions, SearchOptions } from "./types";

export type IFeedService = {
	getPersonalizedFeed: (
		userId: string,
		options?: FeedOptions,
	) => Promise<FeedArticle[]>;
	getRecentFeed: (options?: FeedOptions) => Promise<Article[]>;
	searchArticles: (
		query: string,
		options?: SearchOptions,
	) => Promise<FeedArticle[]>;
};

export const createFeedService = (deps: FeedDeps): IFeedService => {
	const { db, similarityService, embeddingService, config } = deps;

	const computeAverageEmbedding = (embeddings: number[][]): number[] => {
		if (embeddings.length === 0) {
			return [];
		}

		const dimensions = embeddings[0].length;
		const result = new Array(dimensions).fill(0);

		for (const embedding of embeddings) {
			for (let index = 0; index < dimensions; index++) {
				result[index] += embedding[index];
			}
		}

		for (let index = 0; index < dimensions; index++) {
			result[index] /= embeddings.length;
		}

		return result;
	};

	const getPersonalizedFeed = async (
		userId: string,
		options?: FeedOptions,
	): Promise<FeedArticle[]> => {
		const limit = options?.limit ?? config.defaultLimit;
		const minSimilarity = options?.minSimilarity ?? config.defaultMinSimilarity;

		const interests = await db
			.select()
			.from(userInterests)
			.where(eq(userInterests.userId, userId));

		if (interests.length === 0) {
			const recentArticles = await getRecentFeed({ limit });
			return recentArticles.map((article) => ({
				article,
				similarity: 0,
			}));
		}

		const embeddings = interests.map((interest) => interest.embedding);
		const averageEmbedding = computeAverageEmbedding(embeddings);

		const similarArticles = await similarityService.findSimilarArticles(
			averageEmbedding,
			{
				topK: limit,
				minSimilarity,
			},
		);

		return similarArticles.map((result) => ({
			article: result.article,
			similarity: result.similarity,
		}));
	};

	const getRecentFeed = async (options?: FeedOptions): Promise<Article[]> => {
		const limit = options?.limit ?? config.defaultLimit;

		return db
			.select()
			.from(articles)
			.orderBy(
				desc(sql`COALESCE(${articles.publishedAt}, ${articles.createdAt})`),
			)
			.limit(limit);
	};

	const searchArticles = async (
		query: string,
		options?: SearchOptions,
	): Promise<FeedArticle[]> => {
		if (!query.trim()) {
			throw new Error(
				"Failed to search articles: Search query cannot be empty",
			);
		}

		const limit = options?.limit ?? config.defaultLimit;
		const minSimilarity = options?.minSimilarity ?? config.defaultMinSimilarity;

		try {
			const queryEmbedding = await embeddingService.generate(query);

			const similarArticles = await similarityService.findSimilarArticles(
				queryEmbedding,
				{
					topK: limit,
					minSimilarity,
				},
			);

			return similarArticles.map((result) => ({
				article: result.article,
				similarity: result.similarity,
			}));
		} catch (error) {
			throw new Error(
				`Failed to search articles: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	};

	return {
		getPersonalizedFeed,
		getRecentFeed,
		searchArticles,
	};
};
