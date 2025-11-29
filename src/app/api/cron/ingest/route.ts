import { NextResponse } from "next/server";
import { db } from "@/db";
import { ARTICLE_INGESTION_CONFIG } from "@/lib/pipelines/article-ingestion/config";
import { createArticleIngestionPipeline } from "@/lib/pipelines/article-ingestion/pipeline";
import { services } from "@/lib/services";
import { createArticleSummaryService } from "@/lib/services/article-summary/service";
import { RSS_CONFIG } from "@/lib/services/rss/config";
import { createRssService } from "@/lib/services/rss/service";
import { createTagService } from "@/lib/services/tag/service";

export const maxDuration = 300;

const isAuthorized = (request: Request): boolean => {
	const cronSecret = process.env.CRON_SECRET;

	if (!cronSecret) {
		return false;
	}

	const authHeader = request.headers.get("authorization");
	if (authHeader === `Bearer ${cronSecret}`) {
		return true;
	}

	const url = new URL(request.url);
	const tokenParam = url.searchParams.get("token");
	if (tokenParam === cronSecret) {
		return true;
	}

	return false;
};

export const GET = async (request: Request) => {
	if (!isAuthorized(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const rssService = createRssService({
		config: RSS_CONFIG,
	});

	const articleSummaryService = createArticleSummaryService({
		llmService: services.llm,
	});

	const tagService = createTagService({
		db,
	});

	const pipeline = createArticleIngestionPipeline({
		config: ARTICLE_INGESTION_CONFIG,
		db,
		rssService,
		articleSummaryService,
		embeddingService: services.embedding,
		tagService,
	});

	const result = await pipeline.ingestNewArticles();

	return NextResponse.json({
		success: true,
		totalFetched: result.totalFetched,
		newArticles: result.newArticles,
		skipped: result.skipped,
		failed: result.failed,
		errors: result.errors,
	});
};

