import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type * as schema from "@/db/schema";
import type { ILlmService } from "../llm/types";

export type ArticleTldrDeps = {
	db: NeonHttpDatabase<typeof schema>;
	llmService: ILlmService;
};
