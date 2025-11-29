import { getPersonalizedFeed, getRecentFeed } from "@/actions/feed";
import { getRandomArticle } from "@/actions/getRandomArticle";
import { DashboardTabs } from "@/components/organisms/DashboardTabs";
import { HackOfTheDay } from "@/components/organisms/HackOfTheDay";

export default async function Page() {
	const [forYouResult, exploreResult] = await Promise.all([
		getPersonalizedFeed({ limit: 10 }).catch(() => []),
		getRecentFeed({ limit: 25 }),
	]);

	const forYouArticles = forYouResult.map((scoredArticle) => ({
		id: scoredArticle.article.id,
		title: scoredArticle.article.title,
		summary: scoredArticle.article.summary,
		sourceUrl: scoredArticle.article.sourceUrl,
		publishedAt: scoredArticle.article.publishedAt
			? scoredArticle.article.publishedAt.toISOString()
			: null,
	}));

	const exploreArticles = exploreResult.map((article) => ({
		id: article.id,
		title: article.title,
		summary: article.summary,
		sourceUrl: article.sourceUrl,
		publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
	}));

	const allArticleIds = [
		...forYouArticles.map((article) => article.id),
		...exploreArticles.map((article) => article.id),
	];

	const randomArticleResult = await getRandomArticle(allArticleIds);
	const hackOfTheDay = randomArticleResult.success
		? randomArticleResult.article
			? {
					...randomArticleResult.article,
					publishedAt: randomArticleResult.article.publishedAt
						? randomArticleResult.article.publishedAt.toISOString()
						: null,
				}
			: null
		: null;

	return (
		<div className="space-y-12">
			{hackOfTheDay && <HackOfTheDay article={hackOfTheDay} />}
			<DashboardTabs
				forYouArticles={forYouArticles}
				exploreArticles={exploreArticles}
			/>
		</div>
	);
}
