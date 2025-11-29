import { inArray } from "drizzle-orm";
import { articleTags, tags } from "@/db/schema";
import type { TagDeps } from "./deps";
import type { ITagService, Tag } from "./types";

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

	return {
		normalizeSlug,
		findOrCreateTags,
		linkTagsToArticle,
	};
};
