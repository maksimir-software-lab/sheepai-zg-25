import { createOpenRouter as createOpenRouterAiSdk } from "@openrouter/ai-sdk-provider";
import { OpenRouter } from "@openrouter/sdk";
import { db } from "@/db";
import { EMBEDDING_CONFIG } from "./embedding/config";
import { createEmbeddingService } from "./embedding/service";
import { LLM_CONFIG } from "./llm/config";
import { createLlmService } from "./llm/service";
import { SIMILARITY_CONFIG } from "./similarity/config";
import { createSimilarityService } from "./similarity/service";

export type { EmbeddingConfig } from "./embedding/config";
export { EMBEDDING_CONFIG } from "./embedding/config";
export type { EmbeddingDeps } from "./embedding/deps";
export { createEmbeddingService } from "./embedding/service";
export type { IEmbeddingService as EmbeddingProvider } from "./embedding/types";
export type { LlmConfig } from "./llm/config";
export { LLM_CONFIG } from "./llm/config";
export type { LlmDeps } from "./llm/deps";
export { createLlmService } from "./llm/service";
export type {
	GenerateObjectParams,
	GenerateTextParams,
	ILlmService as LlmProvider,
} from "./llm/types";
export type { SimilarityConfig } from "./similarity/config";
export { SIMILARITY_CONFIG } from "./similarity/config";
export type { SimilarityDeps } from "./similarity/deps";
export { createSimilarityService } from "./similarity/service";
export type {
	ArticleSimilarityResult,
	InterestSimilarityResult,
	SimilarityOptions,
	SimilarityProvider,
	UserProfileSimilarityResult,
} from "./similarity/types";

export const createServices = (openRouterApiKey: string) => {
	const openRouter = new OpenRouter({ apiKey: openRouterApiKey });
	const openRouterAiSdk = createOpenRouterAiSdk({ apiKey: openRouterApiKey });

	const embeddingService = createEmbeddingService({
		openRouter,
		config: EMBEDDING_CONFIG,
	});

	const llmService = createLlmService({
		openRouterAiSdk,
		config: LLM_CONFIG,
	});

	const similarityService = createSimilarityService({
		db,
		config: SIMILARITY_CONFIG,
	});

	return {
		embedding: embeddingService,
		llm: llmService,
		similarity: similarityService,
	};
};

export type Services = ReturnType<typeof createServices>;

export const services: Services = createServices(
	process.env.OPENROUTER_API_KEY ?? "",
);
