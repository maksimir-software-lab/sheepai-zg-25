import { getExploreArticles, getForYouArticles } from "@/actions/getArticles";
import { getRandomArticle } from "@/actions/getRandomArticle";
import { DashboardTabs } from "@/components/organisms/DashboardTabs";
import { HackOfTheDay } from "@/components/organisms/HackOfTheDay";

export default async function Page() {
	const [forYouResult, exploreResult] = await Promise.all([
		getForYouArticles(),
		getExploreArticles(),
	]);

	const forYouArticles = forYouResult.success
		? (forYouResult.articles?.map((article) => ({
				...article,
				publishedAt: article.publishedAt
					? article.publishedAt.toISOString()
					: null,
			})) ?? [])
		: [];
	const exploreArticles = exploreResult.success
		? (exploreResult.articles?.map((article) => ({
				...article,
				publishedAt: article.publishedAt
					? article.publishedAt.toISOString()
					: null,
			})) ?? [])
		: [];

	const allArticleIds = [
		...forYouArticles.map((a) => a.id),
		...exploreArticles.map((a) => a.id),
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
