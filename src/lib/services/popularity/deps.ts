import type { db } from "@/db";
import type { PopularityConfig } from "./config";

export type PopularityDeps = {
	db: typeof db;
	config: PopularityConfig;
};
