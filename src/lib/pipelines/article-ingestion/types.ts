import type { articles } from "@/db/schema";

export type ProcessedArticle = typeof articles.$inferInsert & {
	tagNames: string[];
};

export type IngestResult = {
	totalFetched: number;
	newArticles: number;
	skipped: number;
	failed: number;
	errors: string[];
};
