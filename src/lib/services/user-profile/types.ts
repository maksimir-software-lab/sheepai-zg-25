import type { userProfiles } from "@/db/schema";
import type { EngagementEventType } from "@/lib/services/engagement/types";

export type UserProfile = typeof userProfiles.$inferSelect;

export type IUserProfileService = {
	updateProfile: (userId: string) => Promise<UserProfile | null>;
	shouldUpdateProfile: (
		userId: string,
		eventType: EngagementEventType,
	) => Promise<boolean>;
	getProfile: (userId: string) => Promise<UserProfile | null>;
};
