export const ArticleDetailSkeleton: React.FC = () => {
	return (
		<div className="w-full max-w-4xl mx-auto">
			<div className="mb-8 h-10 w-40 bg-muted/50 rounded-lg animate-pulse" />

			<article className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-10 shadow-2xl">
				<div className="space-y-6">
					<div className="space-y-4 pb-6 border-b border-border/50">
						<div className="space-y-3">
							<div className="h-10 bg-muted/50 rounded-lg animate-pulse w-3/4" />
							<div className="h-10 bg-muted/50 rounded-lg animate-pulse w-full" />
						</div>

						<div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
							<div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
							<div className="h-5 w-40 bg-muted/50 rounded animate-pulse" />
						</div>

						<div className="space-y-2 border-l-4 border-primary/30 pl-6">
							<div className="h-6 bg-muted/50 rounded animate-pulse w-full" />
							<div className="h-6 bg-muted/50 rounded animate-pulse w-5/6" />
							<div className="h-6 bg-muted/50 rounded animate-pulse w-4/5" />
						</div>
					</div>

					<div className="space-y-4">
						<div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
						<div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
						<div className="h-4 bg-muted/50 rounded animate-pulse w-5/6" />
						<div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
						<div className="h-4 bg-muted/50 rounded animate-pulse w-4/5" />
						<div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
						<div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
					</div>

					<div className="pt-4 border-t border-border/50">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 bg-muted/50 rounded-lg animate-pulse" />
							<div className="h-10 w-10 bg-muted/50 rounded-lg animate-pulse" />
						</div>
					</div>
				</div>
			</article>
		</div>
	);
};
