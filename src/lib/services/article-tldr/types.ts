import { z } from "zod";

export const articleTldrSchema = z.object({
	summary: z.string().describe("A concise 2-3 sentence TLDR summary"),
	relevance: z
		.string()
		.nullable()
		.describe(
			"Why this is relevant to the user based on their interests. Null if no user interests were provided.",
		),
});

export type ArticleTldr = z.infer<typeof articleTldrSchema>;

export type TldrContent = {
	summary: string;
	relevance: string | null;
};

export type ArticleTldrRecord = {
	id: string;
	articleId: string;
	userId: string | null;
	tldr: TldrContent;
	createdAt: Date;
	updatedAt: Date;
};

export type GetOrCreateTldrParams = {
	articleId: string;
	userId?: string;
};

export type GetOrCreateTldrResult = {
	tldr: ArticleTldrRecord;
	isNewlyGenerated: boolean;
};

export type IArticleTldrService = {
	getOrCreateTldr: (
		params: GetOrCreateTldrParams,
	) => Promise<GetOrCreateTldrResult>;
};
