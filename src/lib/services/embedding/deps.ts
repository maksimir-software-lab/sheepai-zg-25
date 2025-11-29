import type { OpenRouter } from "@openrouter/sdk";
import type { EmbeddingConfig } from "./config";

export type EmbeddingDeps = {
	config: EmbeddingConfig;
	openRouter: OpenRouter;
};
