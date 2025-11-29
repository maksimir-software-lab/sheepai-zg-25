"use client";

import Link from "next/link";

interface Article {
	id: string;
	title: string;
	summary: string;
	sourceUrl: string;
	publishedAt: string | null;
}

interface Props {
	article: Article;
}

export const HackOfTheDay: React.FC<Props> = ({ article }) => {
	return (
		<div className="w-full max-w-6xl mx-auto">
			<Link href={`/article/${article.id}`}>
				<div className="group relative overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10 border border-primary/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-4 min-w-0 flex-1">
							<div className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 rounded-full border border-primary/40 shrink-0">
								<svg
									className="w-4 h-4 text-primary animate-pulse"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-label="Star"
								>
									<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
								</svg>
								<span className="text-xs font-bold text-primary uppercase tracking-wide">
									Hack of the Day
								</span>
							</div>
							<h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
								{article.title}
							</h2>
						</div>
						<svg
							className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0"
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
					</div>
				</div>
			</Link>
		</div>
	);
};
