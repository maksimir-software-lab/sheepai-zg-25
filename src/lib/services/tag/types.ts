import type { tags } from "@/db/schema";

export type Tag = typeof tags.$inferSelect;

export type ITagService = {
	normalizeSlug: (name: string) => string;
	findOrCreateTags: (tagNames: string[]) => Promise<Tag[]>;
	linkTagsToArticle: (articleId: string, tagIds: string[]) => Promise<void>;
};
