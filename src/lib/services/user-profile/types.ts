import type { userProfiles } from "@/db/schema";

export type UserProfile = typeof userProfiles.$inferSelect;
