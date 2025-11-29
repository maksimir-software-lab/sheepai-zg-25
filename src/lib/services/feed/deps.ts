import type { db } from "@/db";
import type { IEmbeddingService } from "@/lib/services/embedding/types";
import type { SimilarityProvider } from "@/lib/services/similarity/types";
import type { IUserProfileService } from "@/lib/services/user-profile/types";
import type { FeedConfig } from "./config";

export type FeedDeps = {
	config: FeedConfig;
	db: typeof db;
	similarityService: SimilarityProvider;
	embeddingService: IEmbeddingService;
	userProfileService: IUserProfileService;
};
