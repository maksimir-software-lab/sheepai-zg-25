"use client";

import { useState } from "react";
import { saveArticles } from "@/actions/saveArticles";
import { scrapeRSS } from "@/actions/scrapeRSS";
import { Button } from "@/components/ui/button";

interface SavedArticle {
	id: string;
	title: string;
	sourceUrl: string;
	publishedAt: Date | null;
}

export const RSSScraperTest: React.FC = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [totalScraped, setTotalScraped] = useState(0);

	const handleScrapeAndSave = async () => {
		setIsProcessing(true);
		setError(null);
		setSavedArticles([]);
		setTotalScraped(0);

		try {
			const scrapeResult = await scrapeRSS(
				"https://feeds.feedburner.com/TheHackersNews",
			);

			if (!scrapeResult.success || !scrapeResult.data) {
				setError(scrapeResult.error ?? "Failed to scrape RSS feed");
				return;
			}

			setTotalScraped(scrapeResult.data.length);

			const saveResult = await saveArticles(scrapeResult.data);

			if (saveResult.success && saveResult.articles) {
				const articlesWithData = saveResult.articles.filter(
					(article): article is NonNullable<typeof article> => article !== null,
				);

				setSavedArticles(articlesWithData);
			} else {
				setError(saveResult.error ?? "Failed to save articles");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred",
			);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
			<div className="max-w-5xl mx-auto px-4 py-12">
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						RSS Article Scraper
					</h1>
					<p className="text-lg text-gray-600">
						Scrape and save articles from The Hacker News RSS feed
					</p>
				</div>

				<div className="flex justify-center mb-8">
					<Button
						onClick={handleScrapeAndSave}
						disabled={isProcessing}
						className="px-12 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
						size="lg"
					>
						{isProcessing ? (
							<>
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
								Processing...
							</>
						) : (
							"Scrape & Save Articles"
						)}
					</Button>
				</div>

				{error && (
					<div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6 shadow-md">
						<div className="flex items-start">
							<div className="shrink-0">
								<svg
									className="h-6 w-6 text-red-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Error Icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-lg font-semibold text-red-800">Error</h3>
								<p className="mt-1 text-red-700">{error}</p>
							</div>
						</div>
					</div>
				)}

				{totalScraped > 0 && (
					<div className="mb-8">
						<div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
							<div className="flex items-center justify-between mb-6">
								<div>
									<p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
										Total Scraped
									</p>
									<p className="text-4xl font-bold text-gray-900">
										{totalScraped}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
										Added to Database
									</p>
									<p className="text-4xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
										{savedArticles.length}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
										Already Exists
									</p>
									<p className="text-4xl font-bold text-gray-400">
										{totalScraped - savedArticles.length}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{savedArticles.length > 0 && (
					<div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
						<div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-6">
							<h2 className="text-2xl font-bold text-white">
								Newly Added Articles
							</h2>
							<p className="text-blue-100 mt-1">
								{savedArticles.length} article
								{savedArticles.length !== 1 ? "s" : ""} successfully saved
							</p>
						</div>

						<div className="divide-y divide-gray-200">
							{savedArticles.map((article, index) => (
								<div
									key={article.id}
									className="px-8 py-6 hover:bg-gray-50 transition-colors duration-150"
								>
									<div className="flex items-start gap-4">
										<div className="shrink-0">
											<div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
												{index + 1}
											</div>
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="text-lg font-semibold text-gray-900 mb-2">
												{article.title}
											</h3>
											<div className="flex items-center gap-4 text-sm text-gray-500">
												<a
													href={article.sourceUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
												>
													View Article →
												</a>
												{article.publishedAt && (
													<span>
														{new Date(article.publishedAt).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "long",
																day: "numeric",
															},
														)}
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{!isProcessing &&
					savedArticles.length === 0 &&
					totalScraped === 0 &&
					!error && (
						<div className="text-center py-16">
							<svg
								className="mx-auto h-24 w-24 text-gray-300 mb-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>RSS Icon</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
								/>
							</svg>
							<p className="text-xl text-gray-500">
								Click the button above to start scraping articles
							</p>
						</div>
					)}
			</div>
		</div>
	);
};
