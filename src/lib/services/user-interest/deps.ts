import type { db } from "@/db";
import type { IEmbeddingService } from "../embedding/types";
import type { UserInterestConfig } from "./config";

export type UserInterestDeps = {
	config: UserInterestConfig;
	db: typeof db;
	embeddingService: IEmbeddingService;
};
