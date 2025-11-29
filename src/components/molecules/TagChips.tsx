"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAllTags } from "@/actions/feed";
import type { TagWithCount } from "@/lib/services";

interface Props {
	selectedTags: string[];
	onTagsChange: (tags: string[]) => void;
}

export const TagChips: React.FC<Props> = ({ selectedTags, onTagsChange }) => {
	const t = useTranslations("dashboard.tagSearch");
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [tags, setTags] = useState<TagWithCount[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const skeletonItems = useMemo(
		() => [
			{ id: "tag-skeleton-0" },
			{ id: "tag-skeleton-1" },
			{ id: "tag-skeleton-2" },
			{ id: "tag-skeleton-3" },
			{ id: "tag-skeleton-4" },
			{ id: "tag-skeleton-5" },
		],
		[],
	);

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const fetchedTags = await getAllTags();
				setTags(fetchedTags.filter((tag) => tag.articleCount > 0));
			} catch {
				setTags([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTags();
	}, []);

	const handleTagClick = useCallback(
		(slug: string) => {
			if (selectedTags.includes(slug)) {
				onTagsChange(selectedTags.filter((tag) => tag !== slug));
			} else {
				onTagsChange([...selectedTags, slug]);
			}
		},
		[selectedTags, onTagsChange],
	);

	const handleClearAll = useCallback(() => {
		onTagsChange([]);
	}, [onTagsChange]);

	if (isLoading) {
		return (
			<div className="flex gap-2 overflow-hidden">
				{skeletonItems.map((item) => (
					<div
						key={item.id}
						className="h-9 w-20 rounded-full bg-muted/50 animate-pulse shrink-0"
					/>
				))}
			</div>
		);
	}

	if (tags.length === 0) {
		return null;
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-muted-foreground">
					{t("filterByTags")}
				</span>
				{selectedTags.length > 0 && (
					<button
						type="button"
						onClick={handleClearAll}
						className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
					>
						{t("clearFilters")}
					</button>
				)}
			</div>
			<div
				ref={scrollContainerRef}
				className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
				style={{
					scrollbarWidth: "none",
					msOverflowStyle: "none",
				}}
			>
				{tags.map((tag) => {
					const isSelected = selectedTags.includes(tag.slug);
					return (
						<button
							key={tag.id}
							type="button"
							onClick={() => handleTagClick(tag.slug)}
							className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
								isSelected
									? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
									: "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
							}`}
						>
							{tag.name}
							<span
								className={`ml-1.5 text-xs ${isSelected ? "opacity-80" : "opacity-60"}`}
							>
								{tag.articleCount}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};
