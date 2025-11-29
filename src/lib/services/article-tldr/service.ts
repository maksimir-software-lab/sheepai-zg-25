import { and, eq, isNull } from "drizzle-orm";
import { articles, articleTldrs, tags, userTagInterests } from "@/db/schema";
import type { ArticleTldrDeps } from "./deps";
import { genericTldrPrompt, personalizedTldrPrompt } from "./prompts";
import {
	type ArticleTldrRecord,
	articleTldrSchema,
	type GetOrCreateTldrParams,
	type GetOrCreateTldrResult,
	type IArticleTldrService,
	type TldrContent,
} from "./types";

const findExistingTldr = async (
	deps: ArticleTldrDeps,
	articleId: string,
	userId: string | undefined,
): Promise<ArticleTldrRecord | null> => {
	const { db } = deps;

	const condition = userId
		? and(
				eq(articleTldrs.articleId, articleId),
				eq(articleTldrs.userId, userId),
			)
		: and(eq(articleTldrs.articleId, articleId), isNull(articleTldrs.userId));

	const [existing] = await db
		.select()
		.from(articleTldrs)
		.where(condition)
		.limit(1);

	return existing ?? null;
};

const getArticle = async (deps: ArticleTldrDeps, articleId: string) => {
	const { db } = deps;

	const [article] = await db
		.select({ title: articles.title, content: articles.content })
		.from(articles)
		.where(eq(articles.id, articleId))
		.limit(1);

	if (!article) {
		throw new Error(`Article with ID ${articleId} not found`);
	}

	return article;
};

const getUserInterestTags = async (
	deps: ArticleTldrDeps,
	userId: string,
): Promise<string[]> => {
	const { db } = deps;

	const interests = await db
		.select({ tagName: tags.name })
		.from(userTagInterests)
		.innerJoin(tags, eq(userTagInterests.tagId, tags.id))
		.where(eq(userTagInterests.userId, userId));

	return interests.map((interest) => interest.tagName);
};

const generateGenericTldr = async (
	deps: ArticleTldrDeps,
	title: string,
	content: string,
): Promise<TldrContent> => {
	const { llmService } = deps;

	const prompt = genericTldrPrompt
		.replace("{{title}}", title)
		.replace("{{content}}", content);

	const result = await llmService.generateObject({
		prompt,
		schema: articleTldrSchema,
	});

	return { summary: result.summary, relevance: null };
};

const generatePersonalizedTldr = async (
	deps: ArticleTldrDeps,
	title: string,
	content: string,
	userInterests: string[],
): Promise<TldrContent> => {
	const { llmService } = deps;

	const prompt = personalizedTldrPrompt
		.replace("{{title}}", title)
		.replace("{{content}}", content)
		.replace("{{userInterests}}", userInterests.join(", "));

	const result = await llmService.generateObject({
		prompt,
		schema: articleTldrSchema,
	});

	return { summary: result.summary, relevance: result.relevance ?? null };
};

const saveTldr = async (
	deps: ArticleTldrDeps,
	articleId: string,
	userId: string | undefined,
	tldrContent: TldrContent,
): Promise<ArticleTldrRecord> => {
	const { db } = deps;

	const [record] = await db
		.insert(articleTldrs)
		.values({
			articleId,
			userId: userId ?? null,
			tldr: tldrContent,
		})
		.returning();

	return record;
};

export const createArticleTldrService = (
	deps: ArticleTldrDeps,
): IArticleTldrService => {
	const getOrCreateTldr = async (
		params: GetOrCreateTldrParams,
	): Promise<GetOrCreateTldrResult> => {
		const { articleId, userId } = params;

		const existingTldr = await findExistingTldr(deps, articleId, userId);

		if (existingTldr) {
			return { tldr: existingTldr, isNewlyGenerated: false };
		}

		const article = await getArticle(deps, articleId);

		const generated = userId
			? await (async () => {
					const userInterests = await getUserInterestTags(deps, userId);

					if (userInterests.length === 0) {
						return generateGenericTldr(deps, article.title, article.content);
					}

					return generatePersonalizedTldr(
						deps,
						article.title,
						article.content,
						userInterests,
					);
				})()
			: await generateGenericTldr(deps, article.title, article.content);

		const savedTldr = await saveTldr(deps, articleId, userId, generated);

		return { tldr: savedTldr, isNewlyGenerated: true };
	};

	return {
		getOrCreateTldr,
	};
};
