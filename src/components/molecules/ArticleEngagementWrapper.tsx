"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useArticleEngagement } from "@/hooks/use-article-engagement";
import { useArticleViewTracking } from "@/hooks/use-article-view-tracking";

interface Props {
	articleId: string;
}

export const ArticleEngagementWrapper: React.FC<Props> = ({ articleId }) => {
	const t = useTranslations("article.engagement");
	const { trackOpen } = useArticleViewTracking(articleId);
	const { like, dislike, hasLiked, hasDisliked, isLoading } =
		useArticleEngagement(articleId);

	useEffect(() => {
		trackOpen();
	}, [trackOpen]);

	return (
		<div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-6">
			<span className="text-sm font-medium text-muted-foreground">
				{t("question")}
			</span>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={like}
					disabled={isLoading}
					className={`p-2.5 cursor-pointer rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
						hasLiked
							? "bg-green-500/20 text-green-600 hover:bg-green-500/30"
							: "bg-muted/50 text-muted-foreground hover:bg-green-500/10 hover:text-green-600"
					}`}
					aria-label={t("likeAriaLabel")}
				>
					<svg
						className="w-5 h-5"
						fill={hasLiked ? "currentColor" : "none"}
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
						/>
					</svg>
				</button>

				<button
					type="button"
					onClick={dislike}
					disabled={isLoading}
					className={`p-2.5 cursor-pointer rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
						hasDisliked
							? "bg-red-500/20 text-red-600 hover:bg-red-500/30"
							: "bg-muted/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
					}`}
					aria-label={t("dislikeAriaLabel")}
				>
					<svg
						className="w-5 h-5"
						fill={hasDisliked ? "currentColor" : "none"}
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};
