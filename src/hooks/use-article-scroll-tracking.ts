"use client";

import { type RefObject, useCallback, useEffect, useRef } from "react";
import { useArticleViewTracking } from "./use-article-view-tracking";

type ScrollTrackingOptions = {
	throttleMs?: number;
};

export const useArticleScrollTracking = (
	articleId: string,
	containerRef: RefObject<HTMLElement | null>,
	options: ScrollTrackingOptions = {},
) => {
	const { throttleMs = 100 } = options;
	const { trackOpen, trackScrollProgress } = useArticleViewTracking(articleId);
	const lastScrollTime = useRef(0);

	const calculateScrollPercentage = useCallback(
		(container: HTMLElement): number => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			const scrollableHeight = scrollHeight - clientHeight;

			if (scrollableHeight <= 0) {
				return 1;
			}

			return Math.min(scrollTop / scrollableHeight, 1);
		},
		[],
	);

	const handleScroll = useCallback(() => {
		const now = Date.now();

		if (now - lastScrollTime.current < throttleMs) {
			return;
		}

		lastScrollTime.current = now;

		const container = containerRef.current;

		if (!container) {
			return;
		}

		const scrollPercentage = calculateScrollPercentage(container);
		trackScrollProgress(scrollPercentage);
	}, [
		containerRef,
		calculateScrollPercentage,
		trackScrollProgress,
		throttleMs,
	]);

	useEffect(() => {
		const container = containerRef.current;

		if (!container) {
			return;
		}

		container.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, [containerRef, handleScroll]);

	return {
		trackOpen,
	};
};
