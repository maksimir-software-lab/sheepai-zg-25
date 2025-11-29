import type { db } from "@/db";
import type { EngagementConfig } from "./config";

export type EngagementDeps = {
	config: EngagementConfig;
	db: typeof db;
};
