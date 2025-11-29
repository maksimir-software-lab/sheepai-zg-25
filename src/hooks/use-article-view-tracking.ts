"use client";

import { useCallback, useRef } from "react";
import { recordArticleEngagement } from "@/actions/engagement";

const SCROLL_THRESHOLDS = [0.25, 0.5, 0.75, 1.0] as const;

export const useArticleViewTracking = (articleId: string) => {
	const hasTrackedOpen = useRef(false);
	const openTime = useRef<number | null>(null);
	const trackedThresholds = useRef<Set<number>>(new Set());

	const trackOpen = useCallback(async () => {
		if (hasTrackedOpen.current) {
			return;
		}

		hasTrackedOpen.current = true;
		openTime.current = Date.now();
		await recordArticleEngagement(articleId, "open");
	}, [articleId]);

	const trackScrollProgress = useCallback(
		async (scrollPercentage: number) => {
			const thresholdToTrack = SCROLL_THRESHOLDS.find(
				(threshold) =>
					scrollPercentage >= threshold &&
					!trackedThresholds.current.has(threshold),
			);

			if (!thresholdToTrack) {
				return;
			}

			trackedThresholds.current.add(thresholdToTrack);

			const timeSpent = openTime.current
				? Date.now() - openTime.current
				: undefined;

			await recordArticleEngagement(articleId, "scroll", {
				scrollDepth: thresholdToTrack,
				timeSpent,
			});
		},
		[articleId],
	);

	return {
		trackOpen,
		trackScrollProgress,
	};
};
