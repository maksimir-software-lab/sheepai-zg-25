"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ArticleCard } from "@/components/molecules/ArticleCard";

interface Article {
	id: string;
	title: string;
	summary: string;
	sourceUrl: string;
	publishedAt: string | null;
}

interface Props {
	forYouArticles: Article[];
	exploreArticles: Article[];
}

export const DashboardTabs: React.FC<Props> = ({
	forYouArticles,
	exploreArticles,
}) => {
	const t = useTranslations("dashboard.tabs");
	const [activeTab, setActiveTab] = useState<"forYou" | "explore">("forYou");

	const articles = activeTab === "forYou" ? forYouArticles : exploreArticles;

	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="mb-16">
				<div className="inline-flex p-1.5 bg-muted/50 backdrop-blur-sm rounded-2xl gap-2 border border-border/50">
					<button
						type="button"
						onClick={() => setActiveTab("forYou")}
						className={`cursor-pointer px-10 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${
							activeTab === "forYou"
								? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
								: "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:scale-102 hover:shadow-md"
						}`}
					>
						{t("forYou")}
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("explore")}
						className={`cursor-pointer px-10 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${
							activeTab === "explore"
								? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
								: "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:scale-102 hover:shadow-md"
						}`}
					>
						{t("explore")}
					</button>
				</div>
			</div>

			<div className="space-y-6">
				{articles.length === 0 ? (
					<div className="text-center py-24">
						<div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center backdrop-blur-sm border border-border/50">
							<svg
								className="w-10 h-10 text-muted-foreground/60"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-label={t("noArticlesAriaLabel")}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-bold text-foreground mb-2">
							{t("noArticles")}
						</h3>
						<p className="text-base text-muted-foreground">
							{t("noArticlesDescription")}
						</p>
					</div>
				) : (
					articles.map((article, index) => (
						<ArticleCard
							key={article.id}
							article={article}
							animationDelay={index * 60}
						/>
					))
				)}
			</div>
		</div>
	);
};
