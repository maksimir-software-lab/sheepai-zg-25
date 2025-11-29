import type { db } from "@/db";
import type { IEmbeddingService } from "../embedding/types";
import type { SimilarityProvider } from "../similarity/types";
import type { FeedConfig } from "./config";

export type FeedDeps = {
	config: FeedConfig;
	db: typeof db;
	similarityService: SimilarityProvider;
	embeddingService: IEmbeddingService;
};
