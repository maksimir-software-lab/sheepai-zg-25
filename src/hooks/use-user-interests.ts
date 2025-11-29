"use client";

import { useCallback, useEffect, useState } from "react";
import {
	addUserInterest,
	getUserInterests,
	removeUserInterest,
} from "@/actions/user-interests";
import type { UserInterest } from "@/lib/services";

export const useUserInterests = () => {
	const [interests, setInterests] = useState<UserInterest[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchInterests = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await getUserInterests();
			setInterests(result);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch interests",
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchInterests();
	}, [fetchInterests]);

	const addInterest = useCallback(async (interestText: string) => {
		const newInterest = await addUserInterest(interestText);
		setInterests((prev) => [...prev, newInterest]);
		return newInterest;
	}, []);

	const removeInterest = useCallback(async (interestId: string) => {
		await removeUserInterest(interestId);
		setInterests((prev) =>
			prev.filter((interest) => interest.id !== interestId),
		);
	}, []);

	return {
		interests,
		isLoading,
		error,
		addInterest,
		removeInterest,
		refetch: fetchInterests,
	};
};
