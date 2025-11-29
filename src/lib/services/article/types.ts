import { z } from "zod";

export const articleDataSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	summary: z.string(),
	content: z.string(),
	sourceUrl: z.string(),
	publishedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type ArticleData = z.infer<typeof articleDataSchema>;

export type ArticleForPodcast = {
	title: string;
	summary: string;
	content: string;
};

export type IArticleService = {
	getByIds: (ids: string[]) => Promise<ArticleData[]>;
	getForPodcast: (ids: string[]) => Promise<ArticleForPodcast[]>;
};
