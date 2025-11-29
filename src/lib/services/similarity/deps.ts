import type { db } from "@/db";
import type { SimilarityConfig } from "./config";

export type SimilarityDeps = {
	config: SimilarityConfig;
	db: typeof db;
};
