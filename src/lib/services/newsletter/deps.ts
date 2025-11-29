import type { db as Database } from "@/db";
import type { IEmailService } from "../email/service";
import type { IFeedService } from "../feed/service";
import type { ILlmService } from "../llm/service";
import type { IPodcastService } from "../podcast/service";
import type { NewsletterConfig } from "./config";

export type NewsletterDeps = {
	db: typeof Database;
	feedService: IFeedService;
	emailService: IEmailService;
	llmService: ILlmService;
	podcastService: IPodcastService;
	config: NewsletterConfig;
};
