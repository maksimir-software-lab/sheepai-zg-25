"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Article {
	id: string;
	title: string;
	summary: string;
	sourceUrl: string;
	publishedAt: string | null;
}

interface Props {
	articles: Article[];
}

export const ArticlesList: React.FC<Props> = ({ articles }) => {
	const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
	const [dislikedArticles, setDislikedArticles] = useState<Set<string>>(
		new Set(),
	);
	const [expandedArticles, setExpandedArticles] = useState<Set<string>>(
		new Set(),
	);

	const handleLike = (articleId: string) => {
		setLikedArticles((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(articleId)) {
				newSet.delete(articleId);
			} else {
				newSet.add(articleId);
				setDislikedArticles((disliked) => {
					const newDisliked = new Set(disliked);
					newDisliked.delete(articleId);
					return newDisliked;
				});
			}
			return newSet;
		});
	};

	const handleDislike = (articleId: string) => {
		setDislikedArticles((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(articleId)) {
				newSet.delete(articleId);
			} else {
				newSet.add(articleId);
				setLikedArticles((liked) => {
					const newLiked = new Set(liked);
					newLiked.delete(articleId);
					return newLiked;
				});
			}
			return newSet;
		});
	};

	const toggleExpanded = (articleId: string) => {
		setExpandedArticles((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(articleId)) {
				newSet.delete(articleId);
			} else {
				newSet.add(articleId);
			}
			return newSet;
		});
	};

	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{articles.length === 0 ? (
					<div className="col-span-full text-center py-24">
						<div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center backdrop-blur-sm border border-border/50">
							<svg
								className="w-10 h-10 text-muted-foreground/60"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-label="No articles"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-bold text-foreground mb-2">
							No articles yet
						</h3>
						<p className="text-base text-muted-foreground">
							Check back later for new content
						</p>
					</div>
				) : (
					articles.map((article, index) => (
						<article
							key={article.id}
							className="group relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 md:p-5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 overflow-hidden flex flex-col"
							style={{
								animationDelay: `${index * 60}ms`,
								animationFillMode: "backwards",
							}}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

							<div className="relative flex flex-col gap-2 flex-1">
								<div className="space-y-2">
									<h2 className="text-lg md:text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
										{article.title}
									</h2>
									<div className="relative">
										<p
											className={`text-sm md:text-base text-muted-foreground leading-relaxed ${
												expandedArticles.has(article.id) ? "" : "line-clamp-3"
											}`}
										>
											{article.summary}
										</p>
										{!expandedArticles.has(article.id) && (
											<button
												type="button"
												onClick={() => toggleExpanded(article.id)}
												className="cursor-pointer mt-1 flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
											>
												Show more
												<svg
													className="w-4 h-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</button>
										)}
										{expandedArticles.has(article.id) && (
											<button
												type="button"
												onClick={() => toggleExpanded(article.id)}
												className="cursor-pointer mt-1 flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
											>
												Show less
												<svg
													className="w-4 h-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 15l7-7 7 7"
													/>
												</svg>
											</button>
										)}
									</div>
								</div>

								<div className="flex flex-col gap-3 pt-3 border-t border-border/50">
									<div className="flex items-center justify-between gap-3">
										<time className="text-xs md:text-sm font-semibold text-muted-foreground/80 flex items-center gap-1.5">
											<svg
												className="w-3.5 h-3.5 md:w-4 md:h-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												aria-label="Clock"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											{article.publishedAt &&
												new Date(article.publishedAt).toLocaleDateString(
													"en-US",
													{
														year: "numeric",
														month: "short",
														day: "numeric",
													},
												)}
										</time>

										<div className="flex items-center gap-1.5">
											<button
												type="button"
												onClick={() => handleLike(article.id)}
												className={`p-1.5 cursor-pointer rounded-lg transition-all duration-300 hover:scale-110 ${
													likedArticles.has(article.id)
														? "bg-green-500/20 text-green-600 hover:bg-green-500/30"
														: "bg-muted/50 text-muted-foreground hover:bg-green-500/10 hover:text-green-600"
												}`}
												aria-label="Like article"
											>
												<svg
													className="w-4 h-4 md:w-5 md:h-5"
													fill={
														likedArticles.has(article.id)
															? "currentColor"
															: "none"
													}
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden="true"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
													/>
												</svg>
											</button>

											<button
												type="button"
												onClick={() => handleDislike(article.id)}
												className={`p-1.5 cursor-pointer rounded-lg transition-all duration-300 hover:scale-110 ${
													dislikedArticles.has(article.id)
														? "bg-red-500/20 text-red-600 hover:bg-red-500/30"
														: "bg-muted/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
												}`}
												aria-label="Dislike article"
											>
												<svg
													className="w-4 h-4 md:w-5 md:h-5"
													fill={
														dislikedArticles.has(article.id)
															? "currentColor"
															: "none"
													}
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden="true"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
													/>
												</svg>
											</button>
										</div>
									</div>

									<Link href={`/article/${article.id}`} className="w-full">
										<Button
											size="default"
											className="w-full group-hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl text-sm"
										>
											Read Article
											<svg
												className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2.5}
													d="M13 7l5 5m0 0l-5 5m5-5H6"
												/>
											</svg>
										</Button>
									</Link>
								</div>
							</div>
						</article>
					))
				)}
			</div>
		</div>
	);
};
