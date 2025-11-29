export const ARTICLE_INGESTION_CONFIG = {
	batchSize: 10,
	maxRetries: 3,
	retryDelayMs: 1000,
} as const;

export type ArticleIngestionConfig = {
	batchSize: number;
	maxRetries: number;
	retryDelayMs: number;
};
