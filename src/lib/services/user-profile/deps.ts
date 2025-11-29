import type { db } from "@/db";
import type { UserProfileConfig } from "./config";

export type UserProfileDeps = {
	db: typeof db;
	config: UserProfileConfig;
};
