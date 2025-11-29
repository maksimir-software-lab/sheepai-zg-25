import type { OpenRouterProvider } from "@openrouter/ai-sdk-provider";
import type { LlmConfig } from "./config";

export type LlmDeps = {
	config: LlmConfig;
	openRouterAiSdk: OpenRouterProvider;
};
