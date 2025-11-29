import "dotenv/config";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { services } from "@/lib/services";
import type { PodcastFormat } from "@/lib/services/podcast/types";

const DEFAULT_ARTICLE_COUNT = 2;

const getLatestArticleIds = async (count: number): Promise<string[]> => {
	const latestArticles = await db
		.select({ id: articles.id, title: articles.title })
		.from(articles)
		.orderBy(desc(articles.createdAt))
		.limit(count);

	console.log("Found articles:");
	latestArticles.map((article, index) =>
		console.log(`  ${index + 1}. [ID: ${article.id}] ${article.title}`),
	);
	console.log();

	return latestArticles.map((article) => article.id);
};

const parseArgs = (): { format: PodcastFormat; articleCount: number } => {
	const args = process.argv.slice(2);
	const formatArg = args.find((arg) => arg.startsWith("--format="));
	const countArg = args.find((arg) => arg.startsWith("--count="));

	const format: PodcastFormat =
		formatArg?.split("=").at(1) === "news-broadcast"
			? "news-broadcast"
			: "podcast";

	const articleCount = countArg
		? Number.parseInt(
				countArg.split("=").at(1) ?? String(DEFAULT_ARTICLE_COUNT),
				10,
			)
		: DEFAULT_ARTICLE_COUNT;

	return { format, articleCount };
};

const main = async () => {
	const { format, articleCount } = parseArgs();

	console.log("=".repeat(60));
	console.log("Podcast Generation Test");
	console.log("=".repeat(60));
	console.log();
	console.log(`Format: ${format}`);
	console.log(`Articles to include: ${articleCount}`);
	console.log();

	console.log("Fetching latest articles from database...");
	const articleIds = await getLatestArticleIds(articleCount);

	if (articleIds.length === 0) {
		console.error("No articles found in database. Run 'bun ingest' first.");
		process.exit(1);
	}

	console.log("Generating podcast...");
	console.log("  - Fetching article content");
	console.log("  - Generating script with LLM");
	console.log("  - Converting to speech");
	console.log("  - Concatenating audio segments");
	console.log("  - Uploading to storage");
	console.log();

	const startTime = Date.now();

	const result = await services.podcast.generateFromArticles({
		articleIds,
		format,
	});

	const durationInSeconds = (Date.now() - startTime) / 1_000;

	console.log("=".repeat(60));
	console.log("Generation Complete!");
	console.log("=".repeat(60));
	console.log();
	console.log(`Duration: ${durationInSeconds.toFixed(2)}s`);
	console.log(`Storage path: ${result.path}`);
	console.log();
	console.log("Public URL:");
	console.log(result.publicUrl);
};

main().catch((error) => {
	console.error("Podcast generation failed:", error);
	process.exit(1);
});
