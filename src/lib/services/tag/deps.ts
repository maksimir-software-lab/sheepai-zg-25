import type { db } from "@/db";

export type TagDeps = {
	db: typeof db;
};
