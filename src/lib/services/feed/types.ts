import type { articles } from "@/db/schema";

export type Article = typeof articles.$inferSelect;

export type ArticleScores = {
	similarity: number;
	recency: number;
	popularity: number;
	exploration: number;
	final: number;
};

export type ScoredArticle = {
	article: Article;
	scores: ArticleScores;
};

export type FeedArticle = {
	article: Article;
	similarity: number;
};

export type FeedOptions = {
	limit?: number;
	minSimilarity?: number;
	excludeEngaged?: boolean;
};

export type SearchOptions = {
	limit?: number;
	minSimilarity?: number;
};
