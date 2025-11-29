import type { db } from "@/db";
import type { IEmbeddingService } from "@/lib/services/embedding/service";
import type { IPopularityService } from "@/lib/services/popularity/service";
import type { SimilarityProvider } from "@/lib/services/similarity/types";
import type { IUserProfileService } from "@/lib/services/user-profile/service";
import type { FeedConfig } from "./config";

export type FeedDeps = {
	config: FeedConfig;
	db: typeof db;
	similarityService: SimilarityProvider;
	embeddingService: IEmbeddingService;
	userProfileService: IUserProfileService;
	popularityService: IPopularityService;
};
