import type { ArticleSummaryDeps } from "./deps";
import { articleSummaryPrompt } from "./prompts";
import { type ArticleSummary, articleSummarySchema } from "./types";

export type IArticleSummaryService = {
	generateSummary: (title: string, content: string) => Promise<ArticleSummary>;
};

export const createArticleSummaryService = (
	deps: ArticleSummaryDeps,
): IArticleSummaryService => {
	const { llmService } = deps;

	const buildPrompt = (title: string, content: string): string => {
		return articleSummaryPrompt
			.replace("{{title}}", title)
			.replace("{{content}}", content);
	};

	const generateSummary = async (
		title: string,
		content: string,
	): Promise<ArticleSummary> => {
		const prompt = buildPrompt(title, content);

		const result = await llmService.generateObject({
			prompt,
			schema: articleSummarySchema,
		});

		return result;
	};

	return {
		generateSummary,
	};
};
