"use server";

import { currentUser } from "@clerk/nextjs/server";
import type { EngagementEventType } from "@/lib/services";
import { services } from "@/lib/services";

export const recordArticleEngagement = async (
	articleId: string,
	eventType: EngagementEventType,
	metadata?: Record<string, unknown>,
) => {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	return services.engagement.recordEngagement(
		user.id,
		articleId,
		eventType,
		metadata,
	);
};

export const removeArticleEngagement = async (
	articleId: string,
	eventType: EngagementEventType,
) => {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	return services.engagement.removeEngagement(user.id, articleId, eventType);
};

export const getArticleEngagement = async (articleId: string) => {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	return services.engagement.getArticleEngagement(user.id, articleId);
};
