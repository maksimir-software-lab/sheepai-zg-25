import type OpenAI from "openai";
import type { IArticleService } from "../article/types";
import type { ILlmService } from "../llm/service";
import type { IStorageService } from "../storage/service";
import type { PodcastConfig } from "./config";

export type PodcastDeps = {
	openai: OpenAI;
	storageService: IStorageService;
	llmService: ILlmService;
	articleService: IArticleService;
	config: PodcastConfig;
};
