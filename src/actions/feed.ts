"use server";

import { currentUser } from "@clerk/nextjs/server";
import type { FeedOptions, SearchOptions } from "@/lib/services";
import { services } from "@/lib/services";

export const getPersonalizedFeed = async (options?: FeedOptions) => {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	return services.feed.getPersonalizedFeed(user.id, options);
};

export const getRecentFeed = async (options?: FeedOptions) => {
	return services.feed.getRecentFeed(options);
};

export const searchArticles = async (
	query: string,
	options?: SearchOptions,
) => {
	return services.feed.searchArticles(query, options);
};
