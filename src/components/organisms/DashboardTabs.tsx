"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { getBatchArticleEngagement } from "@/actions/engagement";
import {
	getArticlesByTags,
	getPersonalizedFeed,
	getRecentFeed,
} from "@/actions/feed";
import { getMostEngagedArticle } from "@/actions/getMostEngagedArticle";
import { ArticleCard } from "@/components/molecules/ArticleCard";
import { ArticleCardSkeleton } from "@/components/molecules/ArticleCardSkeleton";
import { TagChips } from "@/components/molecules/TagChips";
import { ArticleOfTheDay } from "@/components/organisms/ArticleOfTheDay";

interface Article {
	id: string;
	title: string;
	summary: string;
	sourceUrl: string;
	publishedAt: string | null;
}

interface EngagementStatus {
	hasLiked: boolean;
	hasDisliked: boolean;
}

interface TabData {
	articles: Article[];
	engagementMap: Record<string, EngagementStatus>;
	isLoading: boolean;
	hasFetched: boolean;
}

export const DashboardTabsNavigation: React.FC = () => {
	const t = useTranslations("dashboard.tabs");
	const searchParams = useSearchParams();
	const router = useRouter();
	const tabParam = searchParams.get("tab");
	const [activeTab, setActiveTab] = useState<"forYou" | "explore">(
		tabParam === "explore" ? "explore" : "forYou",
	);

	useEffect(() => {
		const currentTabParam = searchParams.get("tab");
		if (currentTabParam === "explore") {
			setActiveTab("explore");
		} else if (currentTabParam === "forYou" || currentTabParam === null) {
			setActiveTab("forYou");
		}
	}, [searchParams]);

	const handleTabChange = (tab: "forYou" | "explore") => {
		setActiveTab(tab);
		const params = new URLSearchParams(searchParams.toString());
		if (tab === "explore") {
			params.set("tab", "explore");
		} else {
			params.delete("tab");
		}
		router.push(`/dashboard?${params.toString()}`);
	};

	return (
		<div className="w-full max-w-6xl mx-auto mb-8 hidden md:block">
			<div className="flex p-1.5 bg-muted/50 backdrop-blur-sm rounded-2xl gap-2 border border-border/50 w-full">
				<button
					type="button"
					onClick={() => handleTabChange("forYou")}
					className={`cursor-pointer flex-1 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${
						activeTab === "forYou"
							? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
							: "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:scale-102 hover:shadow-md"
					}`}
				>
					{t("forYou")}
				</button>
				<button
					type="button"
					onClick={() => handleTabChange("explore")}
					className={`cursor-pointer flex-1 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${
						activeTab === "explore"
							? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
							: "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:scale-102 hover:shadow-md"
					}`}
				>
					{t("explore")}
				</button>
			</div>
		</div>
	);
};

export const DashboardTabsSkeleton: React.FC = () => {
	const skeletonKeys = [
		"skeleton-card-1",
		"skeleton-card-2",
		"skeleton-card-3",
		"skeleton-card-4",
		"skeleton-card-5",
	];

	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="space-y-6">
				{skeletonKeys.map((key, index) => (
					<ArticleCardSkeleton key={key} animationDelay={index * 60} />
				))}
			</div>
		</div>
	);
};

export const DashboardTabs: React.FC = () => {
	const t = useTranslations("dashboard.tabs");
	const searchParams = useSearchParams();
	const tabParam = searchParams.get("tab");
	const activeTab = tabParam === "explore" ? "explore" : "forYou";

	const [forYouData, setForYouData] = useState<TabData>({
		articles: [],
		engagementMap: {},
		isLoading: false,
		hasFetched: false,
	});

	const [exploreData, setExploreData] = useState<TabData>({
		articles: [],
		engagementMap: {},
		isLoading: false,
		hasFetched: false,
	});

	const [articleOfTheDay, setArticleOfTheDay] = useState<Article | null>(null);
	const [articleOfTheDayFetched, setArticleOfTheDayFetched] = useState(false);

	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [tagFilteredData, setTagFilteredData] = useState<TabData>({
		articles: [],
		engagementMap: {},
		isLoading: false,
		hasFetched: false,
	});

	const fetchForYou = useCallback(async () => {
		setForYouData((prev) => ({ ...prev, isLoading: true }));

		try {
			const result = await getPersonalizedFeed({ limit: 10 });
			const articles = result.map((scoredArticle) => ({
				id: scoredArticle.article.id,
				title: scoredArticle.article.title,
				summary: scoredArticle.article.summary,
				sourceUrl: scoredArticle.article.sourceUrl,
				publishedAt: scoredArticle.article.publishedAt
					? scoredArticle.article.publishedAt.toISOString()
					: null,
			}));

			const articleIds = articles.map((article) => article.id);
			const engagementMap = await getBatchArticleEngagement(articleIds);

			setForYouData({
				articles,
				engagementMap,
				isLoading: false,
				hasFetched: true,
			});
		} catch {
			setForYouData((prev) => ({
				...prev,
				isLoading: false,
				hasFetched: true,
			}));
		}
	}, []);

	const fetchArticleOfTheDay = useCallback(async () => {
		try {
			const mostEngagedResult = await getMostEngagedArticle();
			if (mostEngagedResult.success && mostEngagedResult.article) {
				const article = {
					...mostEngagedResult.article,
					publishedAt: mostEngagedResult.article.publishedAt
						? mostEngagedResult.article.publishedAt.toISOString()
						: null,
				};
				setArticleOfTheDay(article);
			}
		} catch {
			setArticleOfTheDay(null);
		} finally {
			setArticleOfTheDayFetched(true);
		}
	}, []);

	const fetchExplore = useCallback(async () => {
		setExploreData((prev) => ({ ...prev, isLoading: true }));

		try {
			const result = await getRecentFeed({ limit: 25 });
			const articles = result.map((article) => ({
				id: article.id,
				title: article.title,
				summary: article.summary,
				sourceUrl: article.sourceUrl,
				publishedAt: article.publishedAt
					? article.publishedAt.toISOString()
					: null,
			}));

			const articleIds = articles.map((article) => article.id);
			const engagementMap = await getBatchArticleEngagement(articleIds);

			setExploreData({
				articles,
				engagementMap,
				isLoading: false,
				hasFetched: true,
			});
		} catch {
			setExploreData((prev) => ({
				...prev,
				isLoading: false,
				hasFetched: true,
			}));
		}
	}, []);

	const fetchTagFilteredArticles = useCallback(async (tagSlugs: string[]) => {
		if (tagSlugs.length === 0) {
			setTagFilteredData({
				articles: [],
				engagementMap: {},
				isLoading: false,
				hasFetched: false,
			});
			return;
		}

		setTagFilteredData((prev) => ({ ...prev, isLoading: true }));

		try {
			const result = await getArticlesByTags(tagSlugs, 25);
			const articles = result.map((article) => ({
				id: article.id,
				title: article.title,
				summary: article.summary,
				sourceUrl: article.sourceUrl,
				publishedAt: article.publishedAt
					? article.publishedAt.toISOString()
					: null,
			}));

			const articleIds = articles.map((article) => article.id);
			const engagementMap = await getBatchArticleEngagement(articleIds);

			setTagFilteredData({
				articles,
				engagementMap,
				isLoading: false,
				hasFetched: true,
			});
		} catch {
			setTagFilteredData((prev) => ({
				...prev,
				isLoading: false,
				hasFetched: true,
			}));
		}
	}, []);

	const handleTagsChange = useCallback(
		(newTags: string[]) => {
			setSelectedTags(newTags);
			fetchTagFilteredArticles(newTags);
		},
		[fetchTagFilteredArticles],
	);

	useEffect(() => {
		if (activeTab === "forYou" && !forYouData.hasFetched) {
			fetchForYou();
		} else if (activeTab === "explore") {
			if (!exploreData.hasFetched) {
				fetchExplore();
			}
			if (!articleOfTheDayFetched) {
				fetchArticleOfTheDay();
			}
		}
	}, [
		activeTab,
		forYouData.hasFetched,
		exploreData.hasFetched,
		articleOfTheDayFetched,
		fetchForYou,
		fetchExplore,
		fetchArticleOfTheDay,
	]);

	const isTagFiltering = activeTab === "explore" && selectedTags.length > 0;
	const currentData = isTagFiltering
		? tagFilteredData
		: activeTab === "forYou"
			? forYouData
			: exploreData;

	if (currentData.isLoading || (!currentData.hasFetched && !isTagFiltering)) {
		return <DashboardTabsSkeleton />;
	}

	const articlesToDisplay =
		activeTab === "explore" && articleOfTheDay && !isTagFiltering
			? currentData.articles.filter(
					(article) => article.id !== articleOfTheDay.id,
				)
			: currentData.articles;

	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="space-y-6">
				{activeTab === "explore" && (
					<TagChips
						selectedTags={selectedTags}
						onTagsChange={handleTagsChange}
					/>
				)}
				{activeTab === "explore" && articleOfTheDay && !isTagFiltering && (
					<ArticleOfTheDay article={articleOfTheDay} />
				)}
				{tagFilteredData.isLoading ? (
					<DashboardTabsSkeleton />
				) : articlesToDisplay.length === 0 &&
					!(activeTab === "explore" && articleOfTheDay && !isTagFiltering) ? (
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
					articlesToDisplay.map((article, index) => (
						<ArticleCard
							key={article.id}
							article={article}
							animationDelay={index * 60}
							initialEngagement={currentData.engagementMap[article.id]}
						/>
					))
				)}
			</div>
		</div>
	);
};
