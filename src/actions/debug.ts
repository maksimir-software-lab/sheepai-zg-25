"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { articles, articleTags, tags } from "@/db/schema";
import { ARTICLE_INGESTION_CONFIG } from "@/lib/pipelines/article-ingestion/config";
import { createArticleIngestionPipeline } from "@/lib/pipelines/article-ingestion/pipeline";
import type { IngestResult } from "@/lib/pipelines/article-ingestion/types";
import { services } from "@/lib/services";
import { createArticleSummaryService } from "@/lib/services/article-summary/service";
import { createTagService } from "@/lib/services/tag/service";

export const triggerIngestion = async (): Promise<IngestResult> => {
	const articleSummaryService = createArticleSummaryService({
		llmService: services.llm,
	});

	const tagService = createTagService({
		db,
	});

	const pipeline = createArticleIngestionPipeline({
		config: ARTICLE_INGESTION_CONFIG,
		db,
		rssService: services.rss,
		articleSummaryService,
		embeddingService: services.embedding,
		tagService,
	});

	return pipeline.ingestNewArticles();
};

export type ArticleWithTags = {
	id: string;
	title: string;
	summary: string;
	sourceUrl: string;
	publishedAt: Date | null;
	createdAt: Date;
	tags: Array<{ id: string; name: string; slug: string }>;
};

export const getArticlesWithTags = async (): Promise<ArticleWithTags[]> => {
	const articlesWithTags = await db
		.select({
			id: articles.id,
			title: articles.title,
			summary: articles.summary,
			sourceUrl: articles.sourceUrl,
			publishedAt: articles.publishedAt,
			createdAt: articles.createdAt,
			tagId: tags.id,
			tagName: tags.name,
			tagSlug: tags.slug,
		})
		.from(articles)
		.leftJoin(articleTags, eq(articles.id, articleTags.articleId))
		.leftJoin(tags, eq(articleTags.tagId, tags.id))
		.orderBy(articles.createdAt);

	const articlesMap = new Map<
		string,
		Omit<ArticleWithTags, "tags"> & {
			tags: Array<{ id: string; name: string; slug: string }>;
		}
	>();

	for (const row of articlesWithTags) {
		if (!articlesMap.has(row.id)) {
			articlesMap.set(row.id, {
				id: row.id,
				title: row.title,
				summary: row.summary,
				sourceUrl: row.sourceUrl,
				publishedAt: row.publishedAt,
				createdAt: row.createdAt,
				tags: [],
			});
		}

		const article = articlesMap.get(row.id);
		if (article && row.tagId && row.tagName && row.tagSlug) {
			article.tags.push({
				id: row.tagId,
				name: row.tagName,
				slug: row.tagSlug,
			});
		}
	}

	return Array.from(articlesMap.values());
};

export type TagWithCount = {
	id: string;
	name: string;
	slug: string;
	articleCount: number;
	createdAt: Date;
};

export const getTagsWithCounts = async (): Promise<TagWithCount[]> => {
	const tagsWithCounts = await db
		.select({
			id: tags.id,
			name: tags.name,
			slug: tags.slug,
			createdAt: tags.createdAt,
			articleCount: sql<number>`count(${articleTags.articleId})::int`,
		})
		.from(tags)
		.leftJoin(articleTags, eq(tags.id, articleTags.tagId))
		.groupBy(tags.id)
		.orderBy(tags.name);

	return tagsWithCounts.map((tag) => ({
		id: tag.id,
		name: tag.name,
		slug: tag.slug,
		articleCount: tag.articleCount,
		createdAt: tag.createdAt,
	}));
};

export const clearAllData = async (): Promise<{
	articlesDeleted: number;
	tagsDeleted: number;
}> => {
	const deletedArticles = await db
		.delete(articles)
		.returning({ id: articles.id });
	const deletedTags = await db.delete(tags).returning({ id: tags.id });

	return {
		articlesDeleted: deletedArticles.length,
		tagsDeleted: deletedTags.length,
	};
};
