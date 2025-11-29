import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/actions/getArticle";
import { Button } from "@/components/ui/button";
import { sanitizeArticleContent } from "@/lib/utils/sanitizeArticleContent";

interface Props {
	params: Promise<{
		id: string;
	}>;
}

export default async function Page({ params }: Props) {
	const { id } = await params;
	const result = await getArticle(id);

	if (!result.success || !result.article) {
		notFound();
	}

	const { article } = result;

	return (
		<div className="w-full max-w-4xl mx-auto">
			<Link href="/dashboard">
				<Button
					variant="ghost"
					className="mb-8 hover:scale-105 transition-transform duration-300"
				>
					<svg
						className="w-5 h-5 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-label="Back arrow"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2.5}
							d="M11 17l-5-5m0 0l5-5m-5 5h12"
						/>
					</svg>
					Back to Dashboard
				</Button>
			</Link>

			<article className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-10 shadow-2xl">
				<div className="space-y-6">
					<div className="space-y-4 pb-6 border-b border-border/50">
						<h1 className="text-4xl font-bold leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
							{article.title}
						</h1>

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
									new Date(article.publishedAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
							</time>

							{article.sourceUrl && (
								<a
									href={article.sourceUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-2 transition-colors duration-300"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-label="External link"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
										/>
									</svg>
									View Original Source
								</a>
							)}
						</div>

						<p className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-6">
							{article.summary}
						</p>
					</div>

					<div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-foreground/90 prose-p:leading-relaxed prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-img:rounded-lg prose-img:shadow-lg article-content">
						<div
							dangerouslySetInnerHTML={{
								__html: sanitizeArticleContent(article.content),
							}}
						/>
					</div>
				</div>
			</article>
		</div>
	);
}
