import { and, eq } from "drizzle-orm";
import { engagementEvents } from "@/db/schema";
import type { EngagementDeps } from "./deps";
import type {
	ArticleEngagementStatus,
	EngagementEvent,
	EngagementEventType,
} from "./types";

export type IEngagementService = {
	recordEngagement: (
		userId: string,
		articleId: string,
		eventType: EngagementEventType,
		metadata?: Record<string, unknown>,
	) => Promise<EngagementEvent>;
	removeEngagement: (
		userId: string,
		articleId: string,
		eventType: EngagementEventType,
	) => Promise<void>;
	getArticleEngagement: (
		userId: string,
		articleId: string,
	) => Promise<ArticleEngagementStatus>;
	getEngagementsForArticle: (
		userId: string,
		articleId: string,
	) => Promise<EngagementEvent[]>;
};

export const createEngagementService = (
	deps: EngagementDeps,
): IEngagementService => {
	const { db } = deps;

	const recordEngagement = async (
		userId: string,
		articleId: string,
		eventType: EngagementEventType,
		metadata?: Record<string, unknown>,
	): Promise<EngagementEvent> => {
		if (!userId || !userId.trim()) {
			throw new Error("Failed to record engagement: Invalid user ID");
		}

		if (!articleId || !articleId.trim()) {
			throw new Error("Failed to record engagement: Invalid article ID");
		}

		const validEventTypes: EngagementEventType[] = [
			"open",
			"expand_summary",
			"like",
			"dislike",
			"scroll",
		];

		if (!validEventTypes.includes(eventType)) {
			throw new Error(
				`Failed to record engagement: Invalid event type: ${eventType}`,
			);
		}

		try {
			const [engagement] = await db
				.insert(engagementEvents)
				.values({
					userId,
					articleId,
					eventType,
					metadata,
				})
				.returning();

			return engagement;
		} catch (error) {
			throw new Error(
				`Failed to record engagement: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	};

	const removeEngagement = async (
		userId: string,
		articleId: string,
		eventType: EngagementEventType,
	): Promise<void> => {
		await db
			.delete(engagementEvents)
			.where(
				and(
					eq(engagementEvents.userId, userId),
					eq(engagementEvents.articleId, articleId),
					eq(engagementEvents.eventType, eventType),
				),
			);
	};

	const getArticleEngagement = async (
		userId: string,
		articleId: string,
	): Promise<ArticleEngagementStatus> => {
		const engagements = await db
			.select()
			.from(engagementEvents)
			.where(
				and(
					eq(engagementEvents.userId, userId),
					eq(engagementEvents.articleId, articleId),
				),
			);

		const hasLiked = engagements.some(
			(engagement) => engagement.eventType === "like",
		);
		const hasDisliked = engagements.some(
			(engagement) => engagement.eventType === "dislike",
		);

		return { hasLiked, hasDisliked };
	};

	const getEngagementsForArticle = async (
		userId: string,
		articleId: string,
	): Promise<EngagementEvent[]> => {
		return db
			.select()
			.from(engagementEvents)
			.where(
				and(
					eq(engagementEvents.userId, userId),
					eq(engagementEvents.articleId, articleId),
				),
			);
	};

	return {
		recordEngagement,
		removeEngagement,
		getArticleEngagement,
		getEngagementsForArticle,
	};
};
