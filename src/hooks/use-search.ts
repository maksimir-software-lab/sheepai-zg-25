"use client";

import { useCallback, useState } from "react";
import { searchArticles } from "@/actions/feed";
import type { FeedArticle, SearchOptions } from "@/lib/services";

export const useSearch = (options?: SearchOptions) => {
	const [results, setResults] = useState<FeedArticle[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const search = useCallback(
		async (query: string) => {
			if (!query.trim()) {
				setResults([]);
				return;
			}

			setIsSearching(true);
			setError(null);

			try {
				const result = await searchArticles(query, options);
				setResults(result);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Search failed");
			} finally {
				setIsSearching(false);
			}
		},
		[options],
	);

	const clearResults = useCallback(() => {
		setResults([]);
		setError(null);
	}, []);

	return {
		results,
		isSearching,
		error,
		search,
		clearResults,
	};
};
