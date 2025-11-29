import { users } from "@/db/schema";
import type { NewsletterDeps } from "./deps";
import {
	buildNewsletterHtml,
	generateDetailedSummary,
	generateOverallTldr,
	generatePodcast,
	getAlreadySentArticleIds,
	recordSentArticles,
} from "./internal";
import type {
	GenerateNewsletterParams,
	GenerateNewsletterResult,
	INewsletterService,
	NewsletterArticle,
	SendNewsletterParams,
	SendNewsletterResult,
} from "./types";

export const createNewsletterService = (
	deps: NewsletterDeps,
): INewsletterService => {
	const { db, feedService, emailService, config } = deps;

	const generateNewsletter = async (
		params: GenerateNewsletterParams,
	): Promise<GenerateNewsletterResult | null> => {
		const { userId } = params;

		const personalizedArticles = await feedService.getPersonalizedFeed(userId, {
			excludeEngaged: true,
		});

		const alreadySentIds = await getAlreadySentArticleIds(deps, userId);

		const unseenArticles = personalizedArticles.filter(
			(scored) => !alreadySentIds.has(scored.article.id),
		);

		const sortedByPublished = [...unseenArticles].sort((articleA, articleB) => {
			const dateA = articleA.article.publishedAt ?? articleA.article.createdAt;
			const dateB = articleB.article.publishedAt ?? articleB.article.createdAt;

			return dateB.getTime() - dateA.getTime();
		});

		const selectedArticles = sortedByPublished.slice(
			0,
			config.articlesPerNewsletterLimit,
		);

		if (selectedArticles.length === 0) {
			return null;
		}

		const newsletterArticlesList: NewsletterArticle[] = selectedArticles.map(
			(scored) => ({
				article: scored.article,
				tldr: scored.article.summary,
			}),
		);

		const articleIds = newsletterArticlesList.map((item) => item.article.id);

		const articleSummaries = newsletterArticlesList.map(
			(item) => item.article.summary,
		);

		const [overallTldr, detailedSummary, podcastUrl] = await Promise.all([
			generateOverallTldr(deps, articleSummaries),
			generateDetailedSummary(deps, newsletterArticlesList),
			generatePodcast(deps, articleIds),
		]);

		return {
			articles: newsletterArticlesList,
			overallTldr,
			detailedSummary,
			podcastUrl,
		};
	};

	const sendNewsletter = async (
		params: SendNewsletterParams,
	): Promise<SendNewsletterResult> => {
		const { userId, userEmail, userName } = params;

		const newsletter = await generateNewsletter({ userId });

		if (!newsletter) {
			return {
				success: true,
				articlesSent: 0,
			};
		}

		const htmlContent = buildNewsletterHtml(newsletter, userName);
		const recipient = {
			email: "nikita.leon.wagner@gmail.com",
			name: "Nikita Wagner",
		};
		const _realRecipient = { email: userEmail, name: userName };
		const response = await emailService.send({
			sender: {
				email: config.senderEmail,
				name: config.senderName,
			},
			recipients: [recipient],
			subject: "Your Personalized News Digest",
			htmlContent,
		});

		const articleIds = newsletter.articles.map((item) => item.article.id);
		await recordSentArticles(deps, userId, articleIds);

		const firstMessage = response.messages.at(0);

		return {
			success: true,
			articlesSent: newsletter.articles.length,
			messageId: firstMessage?.messageId,
		};
	};

	const sendNewsletterToAllUsers = async (): Promise<{
		sent: number;
		failed: number;
	}> => {
		const allUsers = await db.select().from(users);

		let sentCount = 0;
		let failedCount = 0;

		const sendPromises = allUsers.map(async (user) => {
			try {
				const result = await sendNewsletter({
					userId: user.id,
					userEmail: user.email,
				});

				if (result.success && result.articlesSent > 0) {
					sentCount += 1;
				}
			} catch {
				failedCount += 1;
			}
		});

		await Promise.all(sendPromises);

		return { sent: sentCount, failed: failedCount };
	};

	return {
		generateNewsletter,
		sendNewsletter,
		sendNewsletterToAllUsers,
	};
};
