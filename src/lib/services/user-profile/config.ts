import type { EngagementEventType } from "@/lib/services/engagement/types";

export const USER_PROFILE_CONFIG = {
	eventWeights: {
		like: 1.0,
		dislike: -0.8,
		expand_summary: 0.6,
		open: 0.5,
		scroll: 0.3,
	} as Record<EngagementEventType, number>,
	temporalDecayDays: 30,
	lowSignalThreshold: 5,
	maxEngagements: 100,
	profileStalenessDays: 1,
	interestBlendRatio: 0.5,
	embeddingDimensions: 2000,
	highSignalEvents: ["like", "dislike"] as EngagementEventType[],
} as const;

export type UserProfileConfig = {
	eventWeights: Record<EngagementEventType, number>;
	temporalDecayDays: number;
	lowSignalThreshold: number;
	maxEngagements: number;
	profileStalenessDays: number;
	interestBlendRatio: number;
	embeddingDimensions: number;
	highSignalEvents: EngagementEventType[];
};
