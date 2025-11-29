import type { engagementEvents } from "@/db/schema";

export type EngagementEventType =
	| "open"
	| "expand_summary"
	| "like"
	| "dislike"
	| "scroll";

export type EngagementEvent = typeof engagementEvents.$inferSelect;

export type ArticleEngagementStatus = {
	hasLiked: boolean;
	hasDisliked: boolean;
};

export type BatchArticleEngagementMap = Record<string, ArticleEngagementStatus>;
