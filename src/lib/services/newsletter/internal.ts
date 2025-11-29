import { eq } from "drizzle-orm";
import { newsletterArticles } from "@/db/schema";
import type { NewsletterDeps } from "./deps";
import { detailedSummaryPrompt, overallTldrPrompt } from "./prompts";
import type { GenerateNewsletterResult, NewsletterArticle } from "./types";

export const getAlreadySentArticleIds = async (
	deps: NewsletterDeps,
	userId: string,
): Promise<Set<string>> => {
	const { db } = deps;

	const sentArticles = await db
		.select({ articleId: newsletterArticles.articleId })
		.from(newsletterArticles)
		.where(eq(newsletterArticles.userId, userId));

	return new Set(sentArticles.map((record) => record.articleId));
};

export const recordSentArticles = async (
	deps: NewsletterDeps,
	userId: string,
	articleIds: string[],
): Promise<void> => {
	const { db } = deps;

	if (articleIds.length === 0) {
		return;
	}

	const records = articleIds.map((articleId) => ({
		userId,
		articleId,
	}));

	await db.insert(newsletterArticles).values(records);
};

export const generateOverallTldr = async (
	deps: NewsletterDeps,
	articleSummaries: string[],
): Promise<string> => {
	const { llmService } = deps;

	const prompt = overallTldrPrompt.replace(
		"{{articleSummaries}}",
		articleSummaries
			.map((summary, index) => `${index + 1}. ${summary}`)
			.join("\n"),
	);

	return llmService.generateText({ prompt });
};

export const generateDetailedSummary = async (
	deps: NewsletterDeps,
	articlesList: NewsletterArticle[],
): Promise<string> => {
	const { llmService } = deps;

	const articleDetails = articlesList
		.map(
			(item, index) =>
				`${index + 1}. Title: ${item.article.title}\nSummary: ${item.article.summary}\nKey Facts: ${item.article.keyFacts.join("; ")}`,
		)
		.join("\n\n");

	const prompt = detailedSummaryPrompt.replace(
		"{{articleDetails}}",
		articleDetails,
	);

	return llmService.generateText({ prompt });
};

export const generatePodcast = async (
	deps: NewsletterDeps,
	articleIds: string[],
): Promise<string> => {
	const { podcastService } = deps;

	const result = await podcastService.generateFromArticles({
		articleIds,
		format: "news-broadcast",
	});

	return result.publicUrl;
};

export const buildNewsletterHtml = (
	result: GenerateNewsletterResult,
	userName?: string,
): string => {
	const greeting = userName ? `Hi ${userName},` : "Hi,";

	const articleListHtml = result.articles
		.map(
			(item) => `
				<tr>
					<td style="padding: 0 0 24px 0;">
						<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);">
							<tr>
								<td style="padding: 24px;">
									<h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #1a1a2e; line-height: 1.4;">${item.article.title}</h3>
									<p style="margin: 0 0 16px 0; font-size: 15px; color: #4a4a68; line-height: 1.6;">${item.tldr}</p>
									<a href="${item.article.sourceUrl}" style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">Read Full Article</a>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			`,
		)
		.join("");

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Your Personalized News Digest</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
	<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f8;">
		<tr>
			<td align="center" style="padding: 40px 20px;">
				<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
					<!-- Header -->
					<tr>
						<td style="padding: 0 0 32px 0;">
							<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0;">
								<tr>
									<td style="padding: 40px 32px; text-align: center;">
										<h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #ffffff;">Your News Digest</h1>
										<p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">Personalized just for you</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Greeting -->
					<tr>
						<td style="padding: 0 0 24px 0;">
							<p style="margin: 0; font-size: 16px; color: #1a1a2e;">${greeting}</p>
							<p style="margin: 8px 0 0 0; font-size: 15px; color: #4a4a68;">Here's what's happening in the topics you care about.</p>
						</td>
					</tr>

					<!-- Podcast Section -->
					<tr>
						<td style="padding: 0 0 24px 0;">
							<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 12px;">
								<tr>
									<td style="padding: 24px; text-align: center;">
										<p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: rgba(255, 255, 255, 0.9);">Listen On The Go</p>
										<h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #ffffff;">Audio News Broadcast</h2>
										<p style="margin: 0 0 16px 0; font-size: 14px; color: rgba(255, 255, 255, 0.9);">Too busy to read? Listen to your personalized news digest.</p>
										<a href="${result.podcastUrl}" style="display: inline-block; padding: 12px 28px; background: #ffffff; color: #11998e; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">Play Podcast</a>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- TL;DR Section -->
					<tr>
						<td style="padding: 0 0 24px 0;">
							<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 12px; border-left: 4px solid #667eea;">
								<tr>
									<td style="padding: 24px;">
										<p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #667eea;">Quick Summary</p>
										<h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1a1a2e;">TL;DR</h2>
										<p style="margin: 0; font-size: 15px; color: #4a4a68; line-height: 1.6;">${result.overallTldr}</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Detailed Summary Section -->
					<tr>
						<td style="padding: 0 0 32px 0;">
							<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 12px;">
								<tr>
									<td style="padding: 24px;">
										<p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #764ba2;">In Depth</p>
										<h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1a1a2e;">What's Happening</h2>
										<p style="margin: 0; font-size: 15px; color: #4a4a68; line-height: 1.7;">${result.detailedSummary}</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Articles Section Header -->
					<tr>
						<td style="padding: 0 0 20px 0;">
							<h2 style="margin: 0; font-size: 22px; font-weight: 600; color: #1a1a2e;">Top Stories For You</h2>
						</td>
					</tr>

					<!-- Articles List -->
					${articleListHtml}

					<!-- Footer -->
					<tr>
						<td style="padding: 32px 0 0 0;">
							<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e0e0e8;">
								<tr>
									<td style="padding: 24px 0; text-align: center;">
										<p style="margin: 0 0 8px 0; font-size: 13px; color: #8888a0;">This newsletter was personalized based on your interests.</p>
										<p style="margin: 0; font-size: 13px; color: #8888a0;">Powered by SheepAI</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
`;
};
