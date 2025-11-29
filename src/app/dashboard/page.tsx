import { getExploreArticles, getForYouArticles } from "@/actions/getArticles";
import { getRandomArticle } from "@/actions/getRandomArticle";
import { ArticlesList } from "@/components/organisms/ArticlesList";
import { DashboardTabButtons } from "@/components/organisms/DashboardTabButtons";
import { HackOfTheDay } from "@/components/organisms/HackOfTheDay";

interface Props {
	searchParams: Promise<{ tab?: string }>;
}

export default async function Page({ searchParams }: Props) {
	const params = await searchParams;
	const activeTab = params.tab === "explore" ? "explore" : "forYou";

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

	const articles = activeTab === "forYou" ? forYouArticles : exploreArticles;

	return (
		<div className="space-y-12">
			{hackOfTheDay && <HackOfTheDay article={hackOfTheDay} />}
			<DashboardTabButtons />
			<ArticlesList articles={articles} />
		</div>
	);
}
