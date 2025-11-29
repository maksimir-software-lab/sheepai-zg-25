import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type * as schema from "@/db/schema";

export type ArticleDeps = {
	db: NeonHttpDatabase<typeof schema>;
};
