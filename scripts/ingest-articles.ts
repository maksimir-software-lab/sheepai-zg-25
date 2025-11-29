import "dotenv/config";
import { db } from "@/db";
import { ARTICLE_INGESTION_CONFIG } from "@/lib/pipelines/article-ingestion/config";
import { createArticleIngestionPipeline } from "@/lib/pipelines/article-ingestion/pipeline";
import { services } from "@/lib/services";
import { createArticleSummaryService } from "@/lib/services/article-summary/service";
import { RSS_CONFIG } from "@/lib/services/rss/config";
import { createRssService } from "@/lib/services/rss/service";
import { createTagService } from "@/lib/services/tag/service";

const main = async () => {
	console.log("Starting article ingestion...\n");

	const rssService = createRssService({
		config: RSS_CONFIG,
	});

	const articleSummaryService = createArticleSummaryService({
		llmService: services.llm,
	});

	const tagService = createTagService({
		db,
	});

	const pipeline = createArticleIngestionPipeline({
		config: ARTICLE_INGESTION_CONFIG,
		db,
		rssService,
		articleSummaryService,
		embeddingService: services.embedding,
		tagService,
	});

	const result = await pipeline.ingestNewArticles();

	console.log("Ingestion complete!\n");
	console.log(`  Total fetched: ${result.totalFetched}`);
	console.log(`  New articles:  ${result.newArticles}`);
	console.log(`  Skipped:       ${result.skipped}`);
	console.log(`  Failed:        ${result.failed}`);

	if (result.errors.length > 0) {
		console.log("\nErrors:");
		for (const error of result.errors) {
			console.log(`  - ${error}`);
		}
	}
};

main().catch((error) => {
	console.error("Ingestion failed:", error);
	process.exit(1);
});
