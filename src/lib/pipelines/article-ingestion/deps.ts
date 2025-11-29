import type { db } from "@/db";
import type { IArticleSummaryService } from "@/lib/services/article-summary/types";
import type { IEmbeddingService } from "@/lib/services/embedding/types";
import type { IRssService } from "@/lib/services/rss/types";
import type { ITagService } from "@/lib/services/tag/types";
import type { ArticleIngestionConfig } from "./config";

export type ArticleIngestionDeps = {
	config: ArticleIngestionConfig;
	db: typeof db;
	rssService: IRssService;
	articleSummaryService: IArticleSummaryService;
	embeddingService: IEmbeddingService;
	tagService: ITagService;
};
