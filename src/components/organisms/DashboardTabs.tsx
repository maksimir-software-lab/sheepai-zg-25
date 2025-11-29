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
	forYouArticles: Article[];
	exploreArticles: Article[];
}

export const DashboardTabs: React.FC<Props> = ({
	forYouArticles,
	exploreArticles,
}) => {
	const [activeTab, setActiveTab] = useState<"forYou" | "explore">("forYou");
	const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
	const [dislikedArticles, setDislikedArticles] = useState<Set<string>>(
		new Set(),
	);

	const articles = activeTab === "forYou" ? forYouArticles : exploreArticles;

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

	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="mb-16">
				<div className="inline-flex p-1.5 bg-muted/50 backdrop-blur-sm rounded-2xl gap-2 border border-border/50">
					<button
						type="button"
						onClick={() => setActiveTab("forYou")}
						className={`cursor-pointer px-10 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${
							activeTab === "forYou"
								? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
								: "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:scale-102 hover:shadow-md"
						}`}
					>
						For You
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("explore")}
						className={`cursor-pointer px-10 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${
							activeTab === "explore"
								? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
								: "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:scale-102 hover:shadow-md"
						}`}
					>
						Explore
					</button>
				</div>
			</div>

			<div className="space-y-6">
				{articles.length === 0 ? (
					<div className="text-center py-24">
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
							className="group relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 overflow-hidden"
							style={{
								animationDelay: `${index * 60}ms`,
								animationFillMode: "backwards",
							}}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

							<div className="relative flex flex-col gap-5">
								<div className="space-y-4">
									<h2 className="text-3xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
										{article.title}
									</h2>
									<p className="text-base text-muted-foreground leading-relaxed">
										{article.summary}
									</p>
								</div>

								<div className="flex items-center justify-between pt-4 border-t border-border/50">
									<div className="flex items-center gap-4">
										<time className="text-sm font-semibold text-muted-foreground/80 flex items-center gap-2">
											<svg
												className="w-4 h-4"
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

										<div className="flex items-center gap-2">
											<button
												type="button"
												onClick={() => handleLike(article.id)}
												className={`p-2 cursor-pointer rounded-lg transition-all duration-300 hover:scale-110 ${
													likedArticles.has(article.id)
														? "bg-green-500/20 text-green-600 hover:bg-green-500/30"
														: "bg-muted/50 text-muted-foreground hover:bg-green-500/10 hover:text-green-600"
												}`}
												aria-label="Like article"
											>
												<svg
													className="w-5 h-5"
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
												className={`p-2 cursor-pointer rounded-lg transition-all duration-300 hover:scale-110 ${
													dislikedArticles.has(article.id)
														? "bg-red-500/20 text-red-600 hover:bg-red-500/30"
														: "bg-muted/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
												}`}
												aria-label="Dislike article"
											>
												<svg
													className="w-5 h-5"
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

									<Link href={`/article/${article.id}`}>
										<Button
											size="lg"
											className="group-hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
										>
											Read Full Article
											<svg
												className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300"
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
