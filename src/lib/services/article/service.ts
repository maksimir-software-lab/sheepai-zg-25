import { inArray } from "drizzle-orm";
import { articles } from "@/db/schema";
import type { ArticleDeps } from "./deps";
import type { ArticleData, ArticleForPodcast, IArticleService } from "./types";

export const createArticleService = (deps: ArticleDeps): IArticleService => {
	const { db } = deps;

	const getByIds = async (ids: string[]): Promise<ArticleData[]> => {
		const results = await db
			.select()
			.from(articles)
			.where(inArray(articles.id, ids));

		return results;
	};

	const getForPodcast = async (ids: string[]): Promise<ArticleForPodcast[]> => {
		const results = await db
			.select({
				title: articles.title,
				summary: articles.summary,
				content: articles.content,
			})
			.from(articles)
			.where(inArray(articles.id, ids));

		return results;
	};

	return {
		getByIds,
		getForPodcast,
	};
};
