"use client";

import { useEffect, useState } from "react";
import { getArticleTldr } from "@/actions/getArticleTldr";

interface Props {
	articleId: string;
	fallbackSummary: string;
}

export const ArticleTldrWrapper: React.FC<Props> = ({
	articleId,
	fallbackSummary,
}) => {
	const [summary, setSummary] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTldr = async () => {
			setIsLoading(true);
			const result = await getArticleTldr(articleId);

			if (result.success && result.tldr) {
				setSummary(result.tldr.summary);
			} else {
				setSummary(fallbackSummary);
			}

			setIsLoading(false);
		};

		fetchTldr();
	}, [articleId, fallbackSummary]);

	if (isLoading) {
		return (
			<div className="space-y-2 border-l-4 border-primary/30 pl-6">
				<div className="h-6 bg-muted/50 rounded animate-pulse w-full" />
				<div className="h-6 bg-muted/50 rounded animate-pulse w-5/6" />
				<div className="h-6 bg-muted/50 rounded animate-pulse w-4/5" />
			</div>
		);
	}

	return (
		<p className="text-base lg:text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-6">
			{summary ?? fallbackSummary}
		</p>
	);
};
