import type OpenAI from "openai";
import type { IStorageService } from "../storage/service";
import type { PodcastConfig } from "./config";

export type PodcastDeps = {
	openai: OpenAI;
	storageService: IStorageService;
	config: PodcastConfig;
};
