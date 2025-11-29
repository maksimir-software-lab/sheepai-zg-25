import { z } from "zod";

export const articleSummarySchema = z.object({
	summary: z.string().describe("A concise 2-3 sentence TL;DR summary"),
	keyFacts: z.array(z.string()).describe("3-5 key facts as bullet points"),
	tags: z.array(z.string()).describe("Relevant tags for categorization"),
});

export type ArticleSummary = z.infer<typeof articleSummarySchema>;
