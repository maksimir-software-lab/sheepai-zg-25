"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	getArticleEngagement,
	recordArticleEngagement,
	removeArticleEngagement,
} from "@/actions/engagement";

export { useArticleInteraction } from "./use-article-interaction";
export { useArticleScrollTracking } from "./use-article-scroll-tracking";
export { useArticleViewTracking } from "./use-article-view-tracking";

export const useArticleEngagement = (articleId: string) => {
	const [hasLiked, setHasLiked] = useState(false);
	const [hasDisliked, setHasDisliked] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchEngagement = async () => {
			try {
				const engagement = await getArticleEngagement(articleId);
				setHasLiked(engagement.hasLiked);
				setHasDisliked(engagement.hasDisliked);
			} catch {
				setHasLiked(false);
				setHasDisliked(false);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEngagement();
	}, [articleId]);

	const like = useCallback(async () => {
		if (hasLiked) {
			await removeArticleEngagement(articleId, "like");
			setHasLiked(false);
			return;
		}

		if (hasDisliked) {
			await removeArticleEngagement(articleId, "dislike");
			setHasDisliked(false);
		}

		await recordArticleEngagement(articleId, "like");
		setHasLiked(true);
	}, [articleId, hasLiked, hasDisliked]);

	const dislike = useCallback(async () => {
		if (hasDisliked) {
			await removeArticleEngagement(articleId, "dislike");
			setHasDisliked(false);
			return;
		}

		if (hasLiked) {
			await removeArticleEngagement(articleId, "like");
			setHasLiked(false);
		}

		await recordArticleEngagement(articleId, "dislike");
		setHasDisliked(true);
	}, [articleId, hasLiked, hasDisliked]);

	return useMemo(
		() => ({
			like,
			dislike,
			hasLiked,
			hasDisliked,
			isLoading,
		}),
		[like, dislike, hasLiked, hasDisliked, isLoading],
	);
};
