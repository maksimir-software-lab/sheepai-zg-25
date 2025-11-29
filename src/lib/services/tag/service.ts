import { desc, eq, inArray, sql } from "drizzle-orm";
import { articles, articleTags, tags } from "@/db/schema";
import type { Article } from "../feed/types";
import type { TagDeps } from "./deps";
import type { Tag, TagWithCount } from "./types";

export type ITagService = {
	normalizeSlug: (name: string) => string;
	findOrCreateTags: (tagNames: string[]) => Promise<Tag[]>;
	linkTagsToArticle: (articleId: string, tagIds: string[]) => Promise<void>;
	getAllTags: () => Promise<TagWithCount[]>;
	getArticlesByTags: (tagSlugs: string[], limit?: number) => Promise<Article[]>;
};

export const createTagService = (deps: TagDeps): ITagService => {
	const { db } = deps;

	const normalizeSlug = (name: string): string => {
		return name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	};

	const findOrCreateTags = async (tagNames: string[]): Promise<Tag[]> => {
		if (tagNames.length === 0) {
			return [];
		}

		const normalizedTags = tagNames.map((name) => ({
			name: name.trim(),
			slug: normalizeSlug(name),
		}));

		const uniqueSlugs = [...new Set(normalizedTags.map((tag) => tag.slug))];
		const uniqueTags = uniqueSlugs.map((slug) => {
			const original = normalizedTags.find((tag) => tag.slug === slug);
			return { name: original?.name ?? slug, slug };
		});

		const existingTags = await db
			.select()
			.from(tags)
			.where(inArray(tags.slug, uniqueSlugs));

		const existingSlugs = new Set(existingTags.map((tag) => tag.slug));
		const newTags = uniqueTags.filter((tag) => !existingSlugs.has(tag.slug));

		if (newTags.length > 0) {
			const insertedTags = await db
				.insert(tags)
				.values(newTags)
				.onConflictDoNothing()
				.returning();

			return [...existingTags, ...insertedTags];
		}

		return existingTags;
	};

	const linkTagsToArticle = async (
		articleId: string,
		tagIds: string[],
	): Promise<void> => {
		if (tagIds.length === 0) {
			return;
		}

		await db
			.insert(articleTags)
			.values(tagIds.map((tagId) => ({ articleId, tagId })))
			.onConflictDoNothing();
	};

	const getAllTags = async (): Promise<TagWithCount[]> => {
		const result = await db
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
			.orderBy(desc(sql`count(${articleTags.articleId})`));

		return result;
	};

	const getArticlesByTags = async (
		tagSlugs: string[],
		limit = 25,
	): Promise<Article[]> => {
		if (tagSlugs.length === 0) {
			return [];
		}

		const matchingTagIds = await db
			.select({ id: tags.id })
			.from(tags)
			.where(inArray(tags.slug, tagSlugs));

		if (matchingTagIds.length === 0) {
			return [];
		}

		const tagIds = matchingTagIds.map((tag) => tag.id);

		const matchingArticleIds = await db
			.selectDistinct({ articleId: articleTags.articleId })
			.from(articleTags)
			.where(inArray(articleTags.tagId, tagIds));

		if (matchingArticleIds.length === 0) {
			return [];
		}

		const articleIds = matchingArticleIds.map((row) => row.articleId);

		const result = await db
			.select()
			.from(articles)
			.where(inArray(articles.id, articleIds))
			.orderBy(
				desc(sql`COALESCE(${articles.publishedAt}, ${articles.createdAt})`),
			)
			.limit(limit);

		return result;
	};

	return {
		normalizeSlug,
		findOrCreateTags,
		linkTagsToArticle,
		getAllTags,
		getArticlesByTags,
	};
};
