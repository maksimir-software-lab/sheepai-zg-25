import { and, desc, eq, gt, sql } from "drizzle-orm";
import {
	articles,
	engagementEvents,
	userInterests,
	userProfiles,
} from "@/db/schema";
import type { EngagementEventType } from "@/lib/services/engagement/types";
import type { UserProfileDeps } from "./deps";
import type { IUserProfileService, UserProfile } from "./types";

export const createUserProfileService = (
	deps: UserProfileDeps,
): IUserProfileService => {
	const { db, config } = deps;

	const computeTemporalDecay = (eventDate: Date): number => {
		const now = Date.now();
		const daysSinceEvent = (now - eventDate.getTime()) / (1000 * 60 * 60 * 24);
		return Math.exp(-daysSinceEvent / config.temporalDecayDays);
	};

	const computeWeightedEmbedding = (
		engagementsWithEmbeddings: Array<{
			eventType: EngagementEventType;
			createdAt: Date;
			embedding: number[];
		}>,
	): number[] | null => {
		if (engagementsWithEmbeddings.length === 0) {
			return null;
		}

		const weightedEmbedding = new Array<number>(
			config.embeddingDimensions,
		).fill(0);
		let totalWeight = 0;

		for (const engagement of engagementsWithEmbeddings) {
			const eventWeight = config.eventWeights[engagement.eventType] ?? 0;
			const temporalDecay = computeTemporalDecay(engagement.createdAt);
			const weight = eventWeight * temporalDecay;

			for (let index = 0; index < engagement.embedding.length; index++) {
				weightedEmbedding[index] += engagement.embedding[index] * weight;
			}
			totalWeight += Math.abs(weight);
		}

		if (totalWeight === 0) {
			return null;
		}

		for (let index = 0; index < weightedEmbedding.length; index++) {
			weightedEmbedding[index] /= totalWeight;
		}

		return weightedEmbedding;
	};

	const blendEmbeddings = (
		engagementEmbedding: number[],
		interestEmbedding: number[],
	): number[] => {
		const blendedEmbedding = new Array<number>(config.embeddingDimensions);
		const engagementRatio = config.interestBlendRatio;
		const interestRatio = 1 - config.interestBlendRatio;

		for (let index = 0; index < config.embeddingDimensions; index++) {
			blendedEmbedding[index] =
				engagementEmbedding[index] * engagementRatio +
				interestEmbedding[index] * interestRatio;
		}

		return blendedEmbedding;
	};

	const computeAverageInterestEmbedding = (
		interests: Array<{ embedding: number[] }>,
	): number[] | null => {
		if (interests.length === 0) {
			return null;
		}

		const averageEmbedding = new Array<number>(config.embeddingDimensions).fill(
			0,
		);

		for (const interest of interests) {
			for (let index = 0; index < interest.embedding.length; index++) {
				averageEmbedding[index] += interest.embedding[index];
			}
		}

		for (let index = 0; index < averageEmbedding.length; index++) {
			averageEmbedding[index] /= interests.length;
		}

		return averageEmbedding;
	};

	const updateProfile = async (userId: string): Promise<UserProfile | null> => {
		const engagementsWithEmbeddings = await db
			.select({
				eventType: engagementEvents.eventType,
				createdAt: engagementEvents.createdAt,
				embedding: articles.embedding,
			})
			.from(engagementEvents)
			.innerJoin(articles, eq(engagementEvents.articleId, articles.id))
			.where(eq(engagementEvents.userId, userId))
			.orderBy(desc(engagementEvents.createdAt))
			.limit(config.maxEngagements);

		const engagementEmbedding = computeWeightedEmbedding(
			engagementsWithEmbeddings,
		);

		const interests = await db
			.select({ embedding: userInterests.embedding })
			.from(userInterests)
			.where(eq(userInterests.userId, userId));

		const interestEmbedding = computeAverageInterestEmbedding(interests);

		let finalEmbedding: number[] | null = null;

		if (engagementEmbedding && interestEmbedding) {
			finalEmbedding = blendEmbeddings(engagementEmbedding, interestEmbedding);
		} else if (engagementEmbedding) {
			finalEmbedding = engagementEmbedding;
		} else if (interestEmbedding) {
			finalEmbedding = interestEmbedding;
		}

		if (!finalEmbedding) {
			return null;
		}

		const [profile] = await db
			.insert(userProfiles)
			.values({
				userId,
				embedding: finalEmbedding,
				engagementCount: engagementsWithEmbeddings.length,
				lastUpdatedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: userProfiles.userId,
				set: {
					embedding: finalEmbedding,
					engagementCount: engagementsWithEmbeddings.length,
					lastUpdatedAt: new Date(),
				},
			})
			.returning();

		return profile;
	};

	const shouldUpdateProfile = async (
		userId: string,
		eventType: EngagementEventType,
	): Promise<boolean> => {
		if (config.highSignalEvents.includes(eventType)) {
			return true;
		}

		const [existingProfile] = await db
			.select()
			.from(userProfiles)
			.where(eq(userProfiles.userId, userId))
			.limit(1);

		if (!existingProfile) {
			const [engagementCount] = await db
				.select({ count: sql<number>`count(*)` })
				.from(engagementEvents)
				.where(eq(engagementEvents.userId, userId));

			return (engagementCount?.count ?? 0) >= config.lowSignalThreshold;
		}

		const [newEngagementCount] = await db
			.select({ count: sql<number>`count(*)` })
			.from(engagementEvents)
			.where(
				and(
					eq(engagementEvents.userId, userId),
					gt(engagementEvents.createdAt, existingProfile.lastUpdatedAt),
				),
			);

		return (newEngagementCount?.count ?? 0) >= config.lowSignalThreshold;
	};

	const getProfile = async (userId: string): Promise<UserProfile | null> => {
		const [profile] = await db
			.select()
			.from(userProfiles)
			.where(eq(userProfiles.userId, userId))
			.limit(1);

		return profile ?? null;
	};

	return {
		updateProfile,
		shouldUpdateProfile,
		getProfile,
	};
};
