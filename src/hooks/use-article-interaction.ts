"use client";

import { useCallback, useRef } from "react";
import { recordArticleEngagement } from "@/actions/engagement";

export const useArticleInteraction = (articleId: string) => {
	const hasExpandedSummary = useRef(false);

	const trackExpandSummary = useCallback(async () => {
		if (hasExpandedSummary.current) {
			return;
		}

		hasExpandedSummary.current = true;
		await recordArticleEngagement(articleId, "expand_summary");
	}, [articleId]);

	return {
		trackExpandSummary,
	};
};
