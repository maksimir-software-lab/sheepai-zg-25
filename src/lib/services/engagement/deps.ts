import type { db } from "@/db";
import type { IUserProfileService } from "@/lib/services/user-profile/types";
import type { EngagementConfig } from "./config";

export type EngagementDeps = {
	config: EngagementConfig;
	db: typeof db;
	userProfileService: IUserProfileService;
};
