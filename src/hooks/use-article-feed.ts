"use client";

import { useCallback, useEffect, useState } from "react";
import { getPersonalizedFeed, getRecentFeed } from "@/actions/feed";
import type { FeedArticle, FeedOptions } from "@/lib/services";

type UseArticleFeedOptions = FeedOptions & {
	personalized?: boolean;
};

export const useArticleFeed = (options?: UseArticleFeedOptions) => {
	const [articles, setArticles] = useState<FeedArticle[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchFeed = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			if (options?.personalized === false) {
				const result = await getRecentFeed({
					limit: options?.limit,
					minSimilarity: options?.minSimilarity,
				});
				setArticles(
					result.map((article) => ({
						article,
						similarity: 0,
					})),
				);
			} else {
				const result = await getPersonalizedFeed({
					limit: options?.limit,
					minSimilarity: options?.minSimilarity,
				});
				setArticles(result);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch feed");
		} finally {
			setIsLoading(false);
		}
	}, [options?.personalized, options?.limit, options?.minSimilarity]);

	useEffect(() => {
		fetchFeed();
	}, [fetchFeed]);

	return {
		articles,
		isLoading,
		error,
		refetch: fetchFeed,
	};
};
