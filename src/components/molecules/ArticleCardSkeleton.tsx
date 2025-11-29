import { Skeleton } from "@/components/ui/skeleton";

interface Props {
	animationDelay?: number;
}

export const ArticleCardSkeleton: React.FC<Props> = ({
	animationDelay = 0,
}) => {
	return (
		<article
			className="relative bg-linear-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-2xl md:rounded-3xl p-5 md:p-8 overflow-hidden"
			style={{
				animationDelay: `${animationDelay}ms`,
				animationFillMode: "backwards",
			}}
		>
			<div className="relative flex flex-col gap-3 md:gap-5">
				<div className="space-y-2 md:space-y-4">
					<Skeleton className="h-6 md:h-9 w-3/4" />
					<div className="space-y-2">
						<Skeleton className="h-4 md:h-5 w-full" />
						<Skeleton className="h-4 md:h-5 w-full" />
						<Skeleton className="h-4 md:h-5 w-5/6" />
					</div>
				</div>

				<div className="flex items-center justify-between pt-3 md:pt-4 border-t border-border/50">
					<div className="flex items-center gap-2 md:gap-4">
						<Skeleton className="h-4 md:h-5 w-24" />
						<div className="flex items-center gap-1.5 md:gap-2">
							<Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-lg" />
							<Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-lg" />
						</div>
					</div>
					<Skeleton className="h-9 w-32 md:h-11 md:w-40 rounded-md" />
				</div>
			</div>
		</article>
	);
};
