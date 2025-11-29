import type { db } from "@/db";
import type { IUserProfileService } from "@/lib/services/user-profile/service";
import type { EngagementConfig } from "./config";

export type EngagementDeps = {
	config: EngagementConfig;
	db: typeof db;
	userProfileService: IUserProfileService;
};
