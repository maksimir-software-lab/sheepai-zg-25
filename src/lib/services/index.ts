import { createOpenRouter as createOpenRouterAiSdk } from "@openrouter/ai-sdk-provider";
import { OpenRouter } from "@openrouter/sdk";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { db } from "@/db";
import { createArticleService } from "./article/service";
import { EMAIL_CONFIG } from "./email/config";
import { createEmailService } from "./email/service";
import { EMBEDDING_CONFIG } from "./embedding/config";
import { createEmbeddingService } from "./embedding/service";
import { ENGAGEMENT_CONFIG } from "./engagement/config";
import { createEngagementService } from "./engagement/service";
import { FEED_CONFIG } from "./feed/config";
import { createFeedService } from "./feed/service";
import { LLM_CONFIG } from "./llm/config";
import { createLlmService } from "./llm/service";
import { PODCAST_CONFIG } from "./podcast/config";
import { createPodcastService } from "./podcast/service";
import { POPULARITY_CONFIG } from "./popularity/config";
import { createPopularityService } from "./popularity/service";
import { RSS_CONFIG } from "./rss/config";
import { createRssService } from "./rss/service";
import { SIMILARITY_CONFIG } from "./similarity/config";
import { createSimilarityService } from "./similarity/service";
import { STORAGE_CONFIG } from "./storage/config";
import { createStorageService } from "./storage/service";
import { USER_INTEREST_CONFIG } from "./user-interest/config";
import { createUserInterestService } from "./user-interest/service";
import { USER_PROFILE_CONFIG } from "./user-profile/config";
import { createUserProfileService } from "./user-profile/service";

export type { ArticleDeps } from "./article/deps";
export { createArticleService } from "./article/service";
export type {
	ArticleData,
	ArticleForPodcast,
	IArticleService as ArticleProvider,
} from "./article/types";
export type { EmailConfig } from "./email/config";
export { EMAIL_CONFIG } from "./email/config";
export type { EmailDeps } from "./email/deps";
export type { IEmailService as EmailProvider } from "./email/service";
export { createEmailService } from "./email/service";
export type { EmbeddingConfig } from "./embedding/config";
export { EMBEDDING_CONFIG } from "./embedding/config";
export type { EmbeddingDeps } from "./embedding/deps";
export type { IEmbeddingService as EmbeddingProvider } from "./embedding/service";
export { createEmbeddingService } from "./embedding/service";
export type { EngagementConfig } from "./engagement/config";
export { ENGAGEMENT_CONFIG } from "./engagement/config";
export type { EngagementDeps } from "./engagement/deps";
export {
	createEngagementService,
	type IEngagementService as EngagementProvider,
} from "./engagement/service";
export type {
	ArticleEngagementStatus,
	EngagementEvent,
	EngagementEventType,
} from "./engagement/types";
export type { FeedConfig } from "./feed/config";
export { FEED_CONFIG } from "./feed/config";
export type { FeedDeps } from "./feed/deps";
export {
	createFeedService,
	type IFeedService as FeedProvider,
} from "./feed/service";
export type {
	Article,
	ArticleScores,
	FeedArticle,
	FeedOptions,
	ScoredArticle,
	SearchOptions,
} from "./feed/types";
export type { LlmConfig } from "./llm/config";
export { LLM_CONFIG } from "./llm/config";
export type { LlmDeps } from "./llm/deps";
export type { ILlmService as LlmProvider } from "./llm/service";
export { createLlmService } from "./llm/service";
export type {
	GenerateObjectParams,
	GenerateTextParams,
} from "./llm/types";
export type { PodcastConfig } from "./podcast/config";
export { PODCAST_CONFIG } from "./podcast/config";
export type { PodcastDeps } from "./podcast/deps";
export type { IPodcastService as PodcastProvider } from "./podcast/service";
export { createPodcastService } from "./podcast/service";
export type {
	AudioFormat,
	GeneratePodcastParams,
	GeneratePodcastResponse,
	OpenAIVoice,
	ScriptSegment,
	TtsModel,
	VoiceMapping,
} from "./podcast/types";
export type { PopularityConfig } from "./popularity/config";
export { POPULARITY_CONFIG } from "./popularity/config";
export type { PopularityDeps } from "./popularity/deps";
export {
	createPopularityService,
	type IPopularityService as PopularityProvider,
} from "./popularity/service";
export type {
	ArticlePopularityStats,
	PopularityOptions,
} from "./popularity/types";
export type { RssConfig } from "./rss/config";
export { RSS_CONFIG } from "./rss/config";
export type { RssDeps } from "./rss/deps";
export type { IRssService as RssProvider } from "./rss/service";
export { createRssService } from "./rss/service";
export type {
	RawFeedItem,
	ScrapedArticle,
} from "./rss/types";
export type { SimilarityConfig } from "./similarity/config";
export { SIMILARITY_CONFIG } from "./similarity/config";
export type { SimilarityDeps } from "./similarity/deps";
export { createSimilarityService } from "./similarity/service";
export type {
	ArticleSimilarityResult,
	InterestSimilarityResult,
	SimilarityOptions,
	SimilarityProvider,
	UserProfileSimilarityResult,
} from "./similarity/types";
export type { StorageConfig } from "./storage/config";
export { STORAGE_CONFIG } from "./storage/config";
export type { StorageDeps } from "./storage/deps";
export type { IStorageService as StorageProvider } from "./storage/service";
export { createStorageService } from "./storage/service";
export type { UserInterestConfig } from "./user-interest/config";
export { USER_INTEREST_CONFIG } from "./user-interest/config";
export type { UserInterestDeps } from "./user-interest/deps";
export {
	createUserInterestService,
	type IUserInterestService as UserInterestProvider,
} from "./user-interest/service";
export type { UserInterest } from "./user-interest/types";
export type { UserProfileConfig } from "./user-profile/config";
export { USER_PROFILE_CONFIG } from "./user-profile/config";
export type { UserProfileDeps } from "./user-profile/deps";
export type { IUserProfileService as UserProfileProvider } from "./user-profile/service";
export { createUserProfileService } from "./user-profile/service";
export type { UserProfile } from "./user-profile/types";

type CreateServicesParams = {
	openRouterApiKey: string;
	infobipApiKey: string;
	infobipBaseUrl: string;
	supabaseUrl: string;
	supabaseAnonKey: string;
	openaiApiKey: string;
};

export const createServices = (params: CreateServicesParams) => {
	const {
		openRouterApiKey,
		infobipApiKey,
		infobipBaseUrl,
		supabaseUrl,
		supabaseAnonKey,
		openaiApiKey,
	} = params;

	const openRouter = new OpenRouter({ apiKey: openRouterApiKey });
	const openRouterAiSdk = createOpenRouterAiSdk({ apiKey: openRouterApiKey });
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const emailService = createEmailService({
		config: {
			apiKey: infobipApiKey,
			baseUrl: infobipBaseUrl,
			apiPath: EMAIL_CONFIG.apiPath,
		},
	});

	const embeddingService = createEmbeddingService({
		openRouter,
		config: EMBEDDING_CONFIG,
	});

	const llmService = createLlmService({
		openRouterAiSdk,
		config: LLM_CONFIG,
	});

	const rssService = createRssService({
		config: RSS_CONFIG,
	});

	const similarityService = createSimilarityService({
		db,
		config: SIMILARITY_CONFIG,
	});

	const userProfileService = createUserProfileService({
		db,
		config: USER_PROFILE_CONFIG,
	});

	const engagementService = createEngagementService({
		db,
		config: ENGAGEMENT_CONFIG,
		userProfileService,
	});

	const storageService = createStorageService({
		supabase,
		config: {
			supabaseUrl,
			supabaseAnonKey,
			buckets: STORAGE_CONFIG.buckets,
		},
	});

	const openai = new OpenAI({
		apiKey: openaiApiKey,
	});

	const articleService = createArticleService({
		db,
	});

	const podcastService = createPodcastService({
		openai,
		storageService,
		llmService,
		articleService,
		config: PODCAST_CONFIG,
	});

	const userInterestService = createUserInterestService({
		db,
		embeddingService,
		config: USER_INTEREST_CONFIG,
	});

	const popularityService = createPopularityService({
		db,
		config: POPULARITY_CONFIG,
	});

	const feedService = createFeedService({
		db,
		similarityService,
		embeddingService,
		userProfileService,
		popularityService,
		config: FEED_CONFIG,
	});

	return {
		email: emailService,
		embedding: embeddingService,
		engagement: engagementService,
		feed: feedService,
		llm: llmService,
		popularity: popularityService,
		rss: rssService,
		similarity: similarityService,
		storage: storageService,
		podcast: podcastService,
		article: articleService,
		userInterest: userInterestService,
		userProfile: userProfileService,
	};
};

export type Services = ReturnType<typeof createServices>;

export const services: Services = createServices({
	openRouterApiKey: process.env.OPENROUTER_API_KEY ?? "",
	infobipApiKey: process.env.INFOBIP_API_KEY ?? "",
	infobipBaseUrl: process.env.INFOBIP_BASE_URL ?? "",
	supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
	supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
	openaiApiKey: process.env.OPENAI_API_KEY ?? "",
});
