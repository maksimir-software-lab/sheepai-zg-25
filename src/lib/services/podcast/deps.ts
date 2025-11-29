import type OpenAI from "openai";
import type { IStorageService } from "../storage/types";
import type { PodcastConfig } from "./config";

export type PodcastDeps = {
	openai: OpenAI;
	storageService: IStorageService;
	config: PodcastConfig;
};

