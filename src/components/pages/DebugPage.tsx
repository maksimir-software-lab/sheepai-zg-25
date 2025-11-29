"use client";

import { RefreshCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
	type ArticleWithTags,
	clearAllData,
	getArticlesWithTags,
	getTagsWithCounts,
	type TagWithCount,
	triggerIngestion,
} from "@/actions/debug";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { IngestResult } from "@/lib/pipelines/article-ingestion/types";

export const DebugPage: React.FC = () => {
	const t = useTranslations("debug");
	const [_isPending, _startTransition] = useTransition();

	const [articles, setArticles] = useState<ArticleWithTags[]>([]);
	const [tags, setTags] = useState<TagWithCount[]>([]);
	const [ingestResult, setIngestResult] = useState<IngestResult | null>(null);
	const [showClearDialog, setShowClearDialog] = useState(false);
	const [loadingArticles, setLoadingArticles] = useState(false);
	const [loadingTags, setLoadingTags] = useState(false);
	const [ingesting, setIngesting] = useState(false);
	const [clearing, setClearing] = useState(false);

	const loadArticles = useCallback(async () => {
		try {
			setLoadingArticles(true);
			const data = await getArticlesWithTags();
			setArticles(data);
		} catch (error) {
			console.error("Failed to load articles:", error);
		} finally {
			setLoadingArticles(false);
		}
	}, []);

	const loadTags = useCallback(async () => {
		try {
			setLoadingTags(true);
			const data = await getTagsWithCounts();
			setTags(data);
		} catch (error) {
			console.error("Failed to load tags:", error);
		} finally {
			setLoadingTags(false);
		}
	}, []);

	useEffect(() => {
		loadArticles();
		loadTags();
	}, [loadArticles, loadTags]);

	const handleIngest = async () => {
		try {
			setIngesting(true);
			setIngestResult(null);
			const result = await triggerIngestion();
			setIngestResult(result);
			await loadArticles();
			await loadTags();
		} catch (error) {
			console.error("Failed to ingest articles:", error);
		} finally {
			setIngesting(false);
		}
	};

	const handleClear = async () => {
		try {
			setClearing(true);
			await clearAllData();
			setShowClearDialog(false);
			setArticles([]);
			setTags([]);
			setIngestResult(null);
		} catch (error) {
			console.error("Failed to clear data:", error);
		} finally {
			setClearing(false);
		}
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">{t("pageTitle")}</h1>
					<p className="text-muted-foreground">{t("description")}</p>
				</div>
				<Button
					variant="destructive"
					onClick={() => setShowClearDialog(true)}
					disabled={clearing}
				>
					<Trash2 className="mr-2 size-4" />
					{t("clear.button")}
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{t("ingest.button")}</CardTitle>
					<CardDescription>
						Trigger article ingestion from RSS feed
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button onClick={handleIngest} disabled={ingesting}>
						{ingesting ? (
							<>
								<RefreshCw className="mr-2 size-4 animate-spin" />
								{t("ingest.loading")}
							</>
						) : (
							t("ingest.button")
						)}
					</Button>

					{ingestResult && (
						<div className="rounded-lg border bg-muted/50 p-4">
							<h3 className="mb-2 font-semibold">
								{t("ingest.results.title")}
							</h3>
							<div className="space-y-1 text-sm">
								<div>
									{t("ingest.results.totalFetched")}:{" "}
									{ingestResult.totalFetched}
								</div>
								<div>
									{t("ingest.results.newArticles")}: {ingestResult.newArticles}
								</div>
								<div>
									{t("ingest.results.skipped")}: {ingestResult.skipped}
								</div>
								<div>
									{t("ingest.results.failed")}: {ingestResult.failed}
								</div>
								{ingestResult.errors.length > 0 && (
									<div className="mt-2">
										<div className="font-semibold">
											{t("ingest.results.errors")}:
										</div>
										<ul className="ml-4 list-disc">
											{ingestResult.errors.map((error) => (
												<li key={error} className="text-xs">
													{error}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{t("articles.title")}</CardTitle>
							<CardDescription>All ingested articles</CardDescription>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={loadArticles}
							disabled={loadingArticles}
						>
							<RefreshCw
								className={`mr-2 size-4 ${loadingArticles ? "animate-spin" : ""}`}
							/>
							{t("articles.refresh")}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{loadingArticles ? (
						<div className="py-8 text-center text-muted-foreground">
							{t("articles.loading")}
						</div>
					) : articles.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							{t("articles.noArticles")}
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-20">{t("articles.id")}</TableHead>
										<TableHead className="min-w-[200px]">
											{t("articles.title")}
										</TableHead>
										<TableHead className="min-w-[300px]">
											{t("articles.summary")}
										</TableHead>
										<TableHead>{t("articles.tags")}</TableHead>
										<TableHead className="min-w-[200px]">
											{t("articles.sourceUrl")}
										</TableHead>
										<TableHead>{t("articles.publishedAt")}</TableHead>
										<TableHead>{t("articles.createdAt")}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{articles.map((article) => (
										<TableRow key={article.id}>
											<TableCell className="font-mono text-sm">
												{article.id}
											</TableCell>
											<TableCell className="font-medium">
												{article.title}
											</TableCell>
											<TableCell className="max-w-[300px] truncate text-sm">
												{article.summary}
											</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													{article.tags.length > 0 ? (
														article.tags.map((tag) => (
															<span
																key={tag.id}
																className="rounded bg-muted px-2 py-0.5 text-xs"
															>
																{tag.name}
															</span>
														))
													) : (
														<span className="text-xs text-muted-foreground">
															—
														</span>
													)}
												</div>
											</TableCell>
											<TableCell className="max-w-[200px] truncate text-sm">
												<a
													href={article.sourceUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline"
												>
													{article.sourceUrl}
												</a>
											</TableCell>
											<TableCell className="text-sm">
												{article.publishedAt
													? new Date(article.publishedAt).toLocaleDateString()
													: "—"}
											</TableCell>
											<TableCell className="text-sm">
												{new Date(article.createdAt).toLocaleDateString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{t("tags.title")}</CardTitle>
							<CardDescription>All tags with article counts</CardDescription>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={loadTags}
							disabled={loadingTags}
						>
							<RefreshCw
								className={`mr-2 size-4 ${loadingTags ? "animate-spin" : ""}`}
							/>
							{t("tags.refresh")}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{loadingTags ? (
						<div className="py-8 text-center text-muted-foreground">
							{t("tags.loading")}
						</div>
					) : tags.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							{t("tags.noTags")}
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t("tags.name")}</TableHead>
										<TableHead>{t("tags.slug")}</TableHead>
										<TableHead className="text-right">
											{t("tags.articleCount")}
										</TableHead>
										<TableHead>{t("tags.createdAt")}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{tags.map((tag) => (
										<TableRow key={tag.id}>
											<TableCell className="font-medium">{tag.name}</TableCell>
											<TableCell className="font-mono text-sm text-muted-foreground">
												{tag.slug}
											</TableCell>
											<TableCell className="text-right">
												{tag.articleCount}
											</TableCell>
											<TableCell className="text-sm">
												{new Date(tag.createdAt).toLocaleDateString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("clear.confirmTitle")}</DialogTitle>
						<DialogDescription>{t("clear.confirmMessage")}</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowClearDialog(false)}
							disabled={clearing}
						>
							{t("clear.cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={handleClear}
							disabled={clearing}
						>
							{clearing ? (
								<>
									<RefreshCw className="mr-2 size-4 animate-spin" />
									{t("clear.loading")}
								</>
							) : (
								t("clear.confirm")
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
