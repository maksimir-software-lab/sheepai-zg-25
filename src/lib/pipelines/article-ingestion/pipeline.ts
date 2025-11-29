import { inArray } from "drizzle-orm";
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

	const getExistingArticleUrls = async (
		sourceUrls: string[],
	): Promise<Set<string>> => {
		if (sourceUrls.length === 0) {
			return new Set();
		}

		const existing = await db
			.select({ sourceUrl: articles.sourceUrl })
			.from(articles)
			.where(inArray(articles.sourceUrl, sourceUrls));

		return new Set(existing.map((row) => row.sourceUrl));
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

	const processInParallel = async <TItem, TResult>(
		items: TItem[],
		processor: (item: TItem, index: number) => Promise<TResult>,
		concurrencyLimit: number,
	): Promise<TResult[]> => {
		const results: TResult[] = new Array(items.length);
		let currentIndex = 0;

		const processNext = async (): Promise<void> => {
			while (currentIndex < items.length) {
				const index = currentIndex++;
				results[index] = await processor(items[index], index);
			}
		};

		const workers = Array.from(
			{ length: Math.min(concurrencyLimit, items.length) },
			() => processNext(),
		);

		await Promise.all(workers);
		return results;
	};

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

		console.log("[Article Ingestion] Checking for existing articles...");
		const allUrls = feedItems.map((item) => item.link);
		const existingUrls = await getExistingArticleUrls(allUrls);
		console.log(
			`[Article Ingestion] Found ${existingUrls.size} existing articles`,
		);

		const newItems = feedItems.filter((item) => !existingUrls.has(item.link));
		result.skipped = feedItems.length - newItems.length;
		console.log(
			`[Article Ingestion] ${newItems.length} new articles to process, ${result.skipped} skipped`,
		);

		if (newItems.length === 0) {
			console.log("[Article Ingestion] No new articles to process");
			return result;
		}

		console.log(
			`[Article Ingestion] Processing ${newItems.length} articles with concurrency limit of ${config.batchSize}...`,
		);

		await processInParallel(
			newItems,
			async (rawItem, index) => {
				console.log(
					`[Article Ingestion] Processing article ${index + 1}/${newItems.length}: "${rawItem.title}"`,
				);

				try {
					const processedArticle = await processWithRetry(rawItem);

					if (processedArticle) {
						console.log(
							`[Article Ingestion] Article processed successfully, inserting into database: "${rawItem.title}"`,
						);
						const { tagNames, ...articleData } = processedArticle;

						const [insertedArticle] = await db
							.insert(articles)
							.values(articleData)
							.returning({ id: articles.id });

						console.log(
							`[Article Ingestion] Article inserted with ID: ${insertedArticle.id}`,
						);

						const tagRecords = await tagService.findOrCreateTags(tagNames);
						await tagService.linkTagsToArticle(
							insertedArticle.id,
							tagRecords.map((tag) => tag.id),
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
			},
			config.batchSize,
		);

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
