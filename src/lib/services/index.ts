import { createOpenRouter as createOpenRouterAiSdk } from "@openrouter/ai-sdk-provider";
import { OpenRouter } from "@openrouter/sdk";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/db";
import { EMAIL_CONFIG } from "./email/config";
import { createEmailService } from "./email/service";
import { EMBEDDING_CONFIG } from "./embedding/config";
import { createEmbeddingService } from "./embedding/service";
import { LLM_CONFIG } from "./llm/config";
import { createLlmService } from "./llm/service";
import { SIMILARITY_CONFIG } from "./similarity/config";
import { createSimilarityService } from "./similarity/service";
import { STORAGE_CONFIG } from "./storage/config";
import { createStorageService } from "./storage/service";

export type { EmailConfig } from "./email/config";
export { EMAIL_CONFIG } from "./email/config";
export type { EmailDeps } from "./email/deps";
export { createEmailService } from "./email/service";
export type { IEmailService as EmailProvider } from "./email/types";
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
export type { StorageConfig } from "./storage/config";
export { STORAGE_CONFIG } from "./storage/config";
export type { StorageDeps } from "./storage/deps";
export { createStorageService } from "./storage/service";
export type { IStorageService as StorageProvider } from "./storage/types";

type CreateServicesParams = {
	openRouterApiKey: string;
	infobipApiKey: string;
	infobipBaseUrl: string;
	supabaseUrl: string;
	supabaseAnonKey: string;
};

export const createServices = (params: CreateServicesParams) => {
	const {
		openRouterApiKey,
		infobipApiKey,
		infobipBaseUrl,
		supabaseUrl,
		supabaseAnonKey,
	} = params;

	const openRouter = new OpenRouter({ apiKey: openRouterApiKey });
	const openRouterAiSdk = createOpenRouterAiSdk({ apiKey: openRouterApiKey });
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const emailService = createEmailService({
		config: {
			apiKey: infobipApiKey,
			baseUrl: infobipBaseUrl,
			apiPath: EMAIL_CONFIG.apiPath,
		},
	});

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

	const storageService = createStorageService({
		supabase,
		config: {
			supabaseUrl,
			supabaseAnonKey,
			buckets: STORAGE_CONFIG.buckets,
		},
	});

	return {
		email: emailService,
		embedding: embeddingService,
		llm: llmService,
		similarity: similarityService,
		storage: storageService,
	};
};

export type Services = ReturnType<typeof createServices>;

export const services: Services = createServices({
	openRouterApiKey: process.env.OPENROUTER_API_KEY ?? "",
	infobipApiKey: process.env.INFOBIP_API_KEY ?? "",
	infobipBaseUrl: process.env.INFOBIP_BASE_URL ?? "",
	supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
	supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
});
