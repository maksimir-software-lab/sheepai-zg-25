import { eq, gte, inArray, sql } from "drizzle-orm";
import { engagementEvents } from "@/db/schema";
import type { PopularityDeps } from "./deps";
import type { ArticlePopularityStats, PopularityOptions } from "./types";

export type IPopularityService = {
	getArticlePopularity: (
		articleId: string,
	) => Promise<ArticlePopularityStats | null>;
	getBatchPopularity: (
		articleIds: string[],
	) => Promise<Map<string, ArticlePopularityStats>>;
	getTrendingArticleIds: (options?: PopularityOptions) => Promise<string[]>;
};

export const createPopularityService = (
	deps: PopularityDeps,
): IPopularityService => {
	const { db, config } = deps;

	const getArticlePopularity = async (
		articleId: string,
	): Promise<ArticlePopularityStats | null> => {
		const stats = await db
			.select({
				articleId: engagementEvents.articleId,
				totalEngagements: sql<number>`count(*)`,
				likes: sql<number>`count(*) filter (where ${engagementEvents.eventType} = 'like')`,
				dislikes: sql<number>`count(*) filter (where ${engagementEvents.eventType} = 'dislike')`,
				opens: sql<number>`count(*) filter (where ${engagementEvents.eventType} = 'open')`,
			})
			.from(engagementEvents)
			.where(eq(engagementEvents.articleId, articleId))
			.groupBy(engagementEvents.articleId);

		if (stats.length === 0) {
			return {
				articleId,
				totalEngagements: 0,
				likes: 0,
				dislikes: 0,
				opens: 0,
				likeRatio: 0.5,
				trendingScore: 0,
			};
		}

		const stat = stats[0];
		const totalVotes = stat.likes + stat.dislikes;
		const likeRatio = totalVotes > 0 ? stat.likes / totalVotes : 0.5;

		const trendingScore =
			stat.opens * config.engagementWeights.open +
			stat.likes * config.engagementWeights.like +
			stat.dislikes * config.engagementWeights.dislike;

		return {
			...stat,
			likeRatio,
			trendingScore,
		};
	};

	const getBatchPopularity = async (
		articleIds: string[],
	): Promise<Map<string, ArticlePopularityStats>> => {
		if (articleIds.length === 0) {
			return new Map();
		}

		const stats = await db
			.select({
				articleId: engagementEvents.articleId,
				totalEngagements: sql<number>`count(*)`,
				likes: sql<number>`count(*) filter (where ${engagementEvents.eventType} = 'like')`,
				dislikes: sql<number>`count(*) filter (where ${engagementEvents.eventType} = 'dislike')`,
				opens: sql<number>`count(*) filter (where ${engagementEvents.eventType} = 'open')`,
			})
			.from(engagementEvents)
			.where(inArray(engagementEvents.articleId, articleIds))
			.groupBy(engagementEvents.articleId);

		const popularityMap = new Map<string, ArticlePopularityStats>();

		for (const articleId of articleIds) {
			const stat = stats.find((statItem) => statItem.articleId === articleId);
			if (stat) {
				const totalVotes = stat.likes + stat.dislikes;
				const likeRatio = totalVotes > 0 ? stat.likes / totalVotes : 0.5;
				const trendingScore =
					stat.opens * config.engagementWeights.open +
					stat.likes * config.engagementWeights.like +
					stat.dislikes * config.engagementWeights.dislike;

				popularityMap.set(articleId, { ...stat, likeRatio, trendingScore });
			} else {
				popularityMap.set(articleId, {
					articleId,
					totalEngagements: 0,
					likes: 0,
					dislikes: 0,
					opens: 0,
					likeRatio: 0.5,
					trendingScore: 0,
				});
			}
		}

		return popularityMap;
	};

	const getTrendingArticleIds = async (
		options?: PopularityOptions,
	): Promise<string[]> => {
		const windowHours =
			options?.trendingWindowHours ?? config.defaultTrendingWindowHours;
		const windowStart = new Date(Date.now() - windowHours * 60 * 60 * 1000);

		const trending = await db
			.select({
				articleId: engagementEvents.articleId,
				score: sql<number>`
					sum(case 
						when ${engagementEvents.eventType} = 'like' then ${config.engagementWeights.like}
						when ${engagementEvents.eventType} = 'dislike' then ${config.engagementWeights.dislike}
						when ${engagementEvents.eventType} = 'open' then ${config.engagementWeights.open}
						when ${engagementEvents.eventType} = 'expand_summary' then ${config.engagementWeights.expand_summary}
						when ${engagementEvents.eventType} = 'scroll' then ${config.engagementWeights.scroll}
						else 0
					end)
				`,
			})
			.from(engagementEvents)
			.where(gte(engagementEvents.createdAt, windowStart))
			.groupBy(engagementEvents.articleId)
			.orderBy(sql`score desc`)
			.limit(100);

		return trending.map((item) => item.articleId);
	};

	return {
		getArticlePopularity,
		getBatchPopularity,
		getTrendingArticleIds,
	};
};
