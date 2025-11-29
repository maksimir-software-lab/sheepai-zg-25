import type { db } from "@/db";
import type { IArticleSummaryService } from "@/lib/services/article-summary/service";
import type { IEmbeddingService } from "@/lib/services/embedding/service";
import type { IRssService } from "@/lib/services/rss/service";
import type { ITagService } from "@/lib/services/tag/service";
import type { ArticleIngestionConfig } from "./config";

export type ArticleIngestionDeps = {
	config: ArticleIngestionConfig;
	db: typeof db;
	rssService: IRssService;
	articleSummaryService: IArticleSummaryService;
	embeddingService: IEmbeddingService;
	tagService: ITagService;
};
