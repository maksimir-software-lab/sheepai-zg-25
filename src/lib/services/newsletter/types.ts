import { z } from "zod";
import type { Article } from "../feed/types";

export const newsletterSummarySchema = z.object({
	tldr: z.string(),
	detailedSummary: z.string(),
});

export type NewsletterSummary = z.infer<typeof newsletterSummarySchema>;

export type NewsletterArticle = {
	article: Article;
	tldr: string;
};

export type GenerateNewsletterParams = {
	userId: string;
};

export type GenerateNewsletterResult = {
	articles: NewsletterArticle[];
	overallTldr: string;
	detailedSummary: string;
	podcastUrl: string;
};

export type SendNewsletterParams = {
	userId: string;
	userEmail: string;
	userName?: string;
};

export type SendNewsletterResult = {
	success: boolean;
	articlesSent: number;
	messageId?: string;
};

export type INewsletterService = {
	generateNewsletter: (
		params: GenerateNewsletterParams,
	) => Promise<GenerateNewsletterResult | null>;
	sendNewsletter: (
		params: SendNewsletterParams,
	) => Promise<SendNewsletterResult>;
	sendNewsletterToAllUsers: () => Promise<{ sent: number; failed: number }>;
};
