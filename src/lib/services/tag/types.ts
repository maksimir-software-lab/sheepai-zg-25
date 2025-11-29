import type { tags } from "@/db/schema";

export type Tag = typeof tags.$inferSelect;

export type TagWithCount = Tag & {
	articleCount: number;
};
