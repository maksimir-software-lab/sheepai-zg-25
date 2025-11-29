import type { articles } from "@/db/schema";

export type Article = typeof articles.$inferSelect;

export type FeedArticle = {
	article: Article;
	similarity: number;
};

export type FeedOptions = {
	limit?: number;
	minSimilarity?: number;
};

export type SearchOptions = {
	limit?: number;
	minSimilarity?: number;
};
