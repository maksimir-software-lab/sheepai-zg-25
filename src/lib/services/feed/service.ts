import { desc, eq, inArray, sql } from "drizzle-orm";
import {
	articles,
	articleTags,
	engagementEvents,
	userInterests,
} from "@/db/schema";
import type { FeedDeps } from "./deps";
import type {
	Article,
	FeedArticle,
	FeedOptions,
	ScoredArticle,
	SearchOptions,
} from "./types";

export type IFeedService = {
	getPersonalizedFeed: (
		userId: string,
		options?: FeedOptions,
	) => Promise<ScoredArticle[]>;
	getRecentFeed: (options?: FeedOptions) => Promise<Article[]>;
	searchArticles: (
		query: string,
		options?: SearchOptions,
	) => Promise<FeedArticle[]>;
};

export const createFeedService = (deps: FeedDeps): IFeedService => {
	const {
		db,
		similarityService,
		embeddingService,
		userProfileService,
		popularityService,
		config,
	} = deps;

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

	const isProfileFresh = (lastUpdatedAt: Date): boolean => {
		const oneHourAgo = Date.now() - 60 * 60 * 1000;
		return lastUpdatedAt.getTime() > oneHourAgo;
	};

	const computeRecencyScore = (article: Article): number => {
		const publishDate = article.publishedAt ?? article.createdAt;
		const daysSincePublished =
			(Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
		return Math.exp(-daysSincePublished / config.recencyDecayDays);
	};

	const computePopularityScore = (
		trendingScore: number,
		likeRatio: number,
		maxTrendingScore: number,
	): number => {
		const normalizedTrending =
			maxTrendingScore > 0 ? trendingScore / maxTrendingScore : 0;
		return normalizedTrending * 0.7 + likeRatio * 0.3;
	};

	const getEngagedArticleIds = async (userId: string): Promise<Set<string>> => {
		const engagements = await db
			.select({ articleId: engagementEvents.articleId })
			.from(engagementEvents)
			.where(eq(engagementEvents.userId, userId));

		return new Set(engagements.map((engagement) => engagement.articleId));
	};

	const getUserSeenTagIds = async (userId: string): Promise<Set<string>> => {
		const seenTags = await db
			.select({ tagId: articleTags.tagId })
			.from(engagementEvents)
			.innerJoin(
				articleTags,
				eq(engagementEvents.articleId, articleTags.articleId),
			)
			.where(eq(engagementEvents.userId, userId));

		return new Set(seenTags.map((tag) => tag.tagId));
	};

	const getArticleTagIds = async (
		articleIds: string[],
	): Promise<Map<string, string[]>> => {
		if (articleIds.length === 0) {
			return new Map();
		}

		const tagResults = await db
			.select({
				articleId: articleTags.articleId,
				tagId: articleTags.tagId,
			})
			.from(articleTags)
			.where(inArray(articleTags.articleId, articleIds));

		const articleTagMap = new Map<string, string[]>();
		for (const result of tagResults) {
			const existing = articleTagMap.get(result.articleId) ?? [];
			existing.push(result.tagId);
			articleTagMap.set(result.articleId, existing);
		}

		return articleTagMap;
	};

	const computeExplorationScore = (
		articleTagIds: string[],
		userSeenTagIds: Set<string>,
	): number => {
		if (articleTagIds.length === 0) {
			return config.randomExplorationFactor * Math.random();
		}

		const unseenTagCount = articleTagIds.filter(
			(tagId) => !userSeenTagIds.has(tagId),
		).length;
		const unseenRatio = unseenTagCount / articleTagIds.length;

		const diversityBoost = unseenRatio * config.explorationBoostForUnseenTags;
		const randomBoost = config.randomExplorationFactor * Math.random();

		return Math.min(1, diversityBoost + randomBoost);
	};

	const computeFinalScore = (scores: {
		similarity: number;
		recency: number;
		popularity: number;
		exploration: number;
	}): number => {
		return (
			config.weights.similarity * scores.similarity +
			config.weights.recency * scores.recency +
			config.weights.popularity * scores.popularity +
			config.weights.exploration * scores.exploration
		);
	};

	const getPersonalizedFeed = async (
		userId: string,
		options?: FeedOptions,
	): Promise<ScoredArticle[]> => {
		const limit = options?.limit ?? config.defaultLimit;
		const minSimilarity = options?.minSimilarity ?? config.defaultMinSimilarity;
		const excludeEngaged = options?.excludeEngaged ?? true;

		const candidateLimit = limit * config.candidateMultiplier;

		const userProfile = await userProfileService.getProfile(userId);

		let candidateArticles: Array<{ article: Article; similarity: number }>;

		if (userProfile && isProfileFresh(userProfile.lastUpdatedAt)) {
			candidateArticles = await similarityService.findSimilarArticles(
				userProfile.embedding,
				{ topK: candidateLimit, minSimilarity },
			);
		} else {
			const interests = await db
				.select()
				.from(userInterests)
				.where(eq(userInterests.userId, userId));

			if (interests.length === 0) {
				const recentArticles = await getRecentFeed({ limit });
				return recentArticles.map((article) => ({
					article,
					scores: {
						similarity: 0,
						recency: computeRecencyScore(article),
						popularity: 0,
						exploration: Math.random() * config.randomExplorationFactor,
						final: 0,
					},
				}));
			}

			const embeddings = interests.map((interest) => interest.embedding);
			const averageEmbedding = computeAverageEmbedding(embeddings);

			candidateArticles = await similarityService.findSimilarArticles(
				averageEmbedding,
				{ topK: candidateLimit, minSimilarity },
			);
		}

		let filteredCandidates = candidateArticles;
		if (excludeEngaged) {
			const engagedArticleIds = await getEngagedArticleIds(userId);
			filteredCandidates = candidateArticles.filter(
				(candidate) => !engagedArticleIds.has(candidate.article.id),
			);
		}

		if (filteredCandidates.length === 0) {
			return [];
		}

		const articleIds = filteredCandidates.map(
			(candidate) => candidate.article.id,
		);
		const popularityMap =
			await popularityService.getBatchPopularity(articleIds);

		const userSeenTagIds = await getUserSeenTagIds(userId);
		const articleTagMap = await getArticleTagIds(articleIds);

		const maxTrendingScore = Math.max(
			...Array.from(popularityMap.values()).map((pop) => pop.trendingScore),
			1,
		);

		const scoredArticles: ScoredArticle[] = filteredCandidates.map(
			(candidate) => {
				const popularity = popularityMap.get(candidate.article.id);
				const articleTagIds = articleTagMap.get(candidate.article.id) ?? [];

				const scores = {
					similarity: candidate.similarity,
					recency: computeRecencyScore(candidate.article),
					popularity: computePopularityScore(
						popularity?.trendingScore ?? 0,
						popularity?.likeRatio ?? 0.5,
						maxTrendingScore,
					),
					exploration: computeExplorationScore(articleTagIds, userSeenTagIds),
					final: 0,
				};

				scores.final = computeFinalScore(scores);

				return { article: candidate.article, scores };
			},
		);

		scoredArticles.sort(
			(articleA, articleB) => articleB.scores.final - articleA.scores.final,
		);

		return scoredArticles.slice(0, limit);
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
