export type { NewsletterConfig } from "./config";
export { NEWSLETTER_CONFIG } from "./config";
export type { NewsletterDeps } from "./deps";
export { createNewsletterService } from "./service";
export type {
	GenerateNewsletterParams,
	GenerateNewsletterResult,
	INewsletterService as NewsletterProvider,
	NewsletterArticle,
	NewsletterSummary,
	SendNewsletterParams,
	SendNewsletterResult,
} from "./types";
