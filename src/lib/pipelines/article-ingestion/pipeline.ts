import { eq } from "drizzle-orm";
import { articles } from "@/db/schema";
import type { ScrapedArticle } from "@/lib/services/rss/types";
import type { ArticleIngestionDeps } from "./deps";
import type { IngestResult, ProcessedArticle } from "./types";

export type IArticleIngestionPipeline = {
	ingestNewArticles: () => Promise<IngestResult>;
};

export const createArticleIngestionPipeline = (
	deps: ArticleIngestionDeps,
): IArticleIngestionPipeline => {
	const {
		config,
		db,
		rssService,
		articleSummaryService,
		embeddingService,
		tagService,
	} = deps;

	const articleExists = async (sourceUrl: string): Promise<boolean> => {
		const existing = await db
			.select({ id: articles.id })
			.from(articles)
			.where(eq(articles.sourceUrl, sourceUrl))
			.limit(1);

		return existing.length > 0;
	};

	const processArticle = async (
		rawItem: ScrapedArticle,
	): Promise<ProcessedArticle> => {
		console.log(
			`[Article Processing] Generating summary for: "${rawItem.title}"`,
		);
		const summary = await articleSummaryService.generateSummary(
			rawItem.title,
			rawItem.description,
		);
		console.log(
			`[Article Processing] Summary generated (${summary.summary.length} chars), ${summary.keyFacts.length} key facts, ${summary.tags.length} tags`,
		);

		const embeddingInput = [summary.summary, summary.keyFacts.join(" ")].join(
			"\n\n",
		);
		console.log(
			`[Article Processing] Generating embedding (input length: ${embeddingInput.length} chars)`,
		);

		const embedding = await embeddingService.generate(embeddingInput);
		console.log(
			`[Article Processing] Embedding generated (dimensions: ${embedding.length})`,
		);

		return {
			title: rawItem.title,
			summary: summary.summary,
			keyFacts: summary.keyFacts,
			content: rawItem.contentHtml,
			embedding,
			sourceUrl: rawItem.link,
			publishedAt: rawItem.pubDate,
			tagNames: summary.tags,
		};
	};

	const sleep = (ms: number): Promise<void> =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const processWithRetry = async (
		rawItem: ScrapedArticle,
	): Promise<ProcessedArticle | null> => {
		let lastError: Error | null = null;

		for (let attempt = 0; attempt < config.maxRetries; attempt++) {
			try {
				if (attempt > 0) {
					console.log(
						`[Article Processing] Retry attempt ${attempt + 1}/${config.maxRetries} for: "${rawItem.title}"`,
					);
				}
				return await processArticle(rawItem);
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));
				const errorMessage = lastError.message;
				console.error(
					`[Article Processing] Attempt ${attempt + 1} failed for "${rawItem.title}": ${errorMessage}`,
				);

				if (attempt < config.maxRetries - 1) {
					const delayMs = config.retryDelayMs * (attempt + 1);
					console.log(
						`[Article Processing] Waiting ${delayMs}ms before retry...`,
					);
					await sleep(delayMs);
				}
			}
		}

		console.error(
			`[Article Processing] All ${config.maxRetries} attempts failed for: "${rawItem.title}"`,
		);
		throw lastError;
	};

	const ingestNewArticles = async (): Promise<IngestResult> => {
		console.log("[Article Ingestion] Starting ingestion process...");

		const result: IngestResult = {
			totalFetched: 0,
			newArticles: 0,
			skipped: 0,
			failed: 0,
			errors: [],
		};

		console.log("[Article Ingestion] Fetching RSS feed with full content...");
		const feedItems = await rssService.fetchFeedWithContent();
		result.totalFetched = feedItems.length;
		console.log(
			`[Article Ingestion] Fetched ${feedItems.length} items with full HTML content`,
		);

		for (let index = 0; index < feedItems.length; index++) {
			const rawItem = feedItems[index];
			console.log(
				`[Article Ingestion] Processing article ${index + 1}/${feedItems.length}: "${rawItem.title}"`,
			);

			try {
				console.log(
					`[Article Ingestion] Checking if article exists: ${rawItem.link}`,
				);
				const exists = await articleExists(rawItem.link);

				if (exists) {
					console.log(
						`[Article Ingestion] Article already exists, skipping: "${rawItem.title}"`,
					);
					result.skipped++;
					continue;
				}

				console.log(
					`[Article Ingestion] Processing new article: "${rawItem.title}"`,
				);
				const processedArticle = await processWithRetry(rawItem);

				if (processedArticle) {
					console.log(
						`[Article Ingestion] Article processed successfully, inserting into database...`,
					);
					const { tagNames, ...articleData } = processedArticle;

					const [insertedArticle] = await db
						.insert(articles)
						.values(articleData)
						.returning({ id: articles.id });

					console.log(
						`[Article Ingestion] Article inserted with ID: ${insertedArticle.id}`,
					);
					console.log(
						`[Article Ingestion] Processing ${tagNames.length} tags: ${tagNames.join(", ")}`,
					);

					const tagRecords = await tagService.findOrCreateTags(tagNames);
					console.log(
						`[Article Ingestion] Found/created ${tagRecords.length} tags`,
					);

					await tagService.linkTagsToArticle(
						insertedArticle.id,
						tagRecords.map((tag) => tag.id),
					);
					console.log(
						`[Article Ingestion] Tags linked to article ID ${insertedArticle.id}`,
					);

					result.newArticles++;
					console.log(
						`[Article Ingestion] Successfully ingested article: "${rawItem.title}"`,
					);
				}
			} catch (error) {
				result.failed++;
				const errorMessage =
					error instanceof Error ? error.message : String(error);
				console.error(
					`[Article Ingestion] Failed to process "${rawItem.title}": ${errorMessage}`,
					error,
				);
				result.errors.push(
					`Failed to process "${rawItem.title}": ${errorMessage}`,
				);
			}
		}

		console.log("[Article Ingestion] Ingestion complete!");
		console.log(
			`[Article Ingestion] Results: ${result.newArticles} new, ${result.skipped} skipped, ${result.failed} failed`,
		);

		return result;
	};

	return {
		ingestNewArticles,
	};
};
