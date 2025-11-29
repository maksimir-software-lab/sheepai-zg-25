import { and, eq } from "drizzle-orm";
import { userInterests } from "@/db/schema";
import type { UserInterestDeps } from "./deps";
import type { UserInterest } from "./types";

export type IUserInterestService = {
	addInterest: (userId: string, interestText: string) => Promise<UserInterest>;
	removeInterest: (userId: string, interestId: string) => Promise<void>;
	getInterests: (userId: string) => Promise<UserInterest[]>;
};

export const createUserInterestService = (
	deps: UserInterestDeps,
): IUserInterestService => {
	const { db, embeddingService } = deps;

	const addInterest = async (
		userId: string,
		interestText: string,
	): Promise<UserInterest> => {
		if (!interestText.trim()) {
			throw new Error("Failed to add interest: Interest text cannot be empty");
		}

		try {
			const embedding = await embeddingService.generate(interestText);

			const [interest] = await db
				.insert(userInterests)
				.values({
					userId,
					embedding,
				})
				.returning();

			return interest;
		} catch (error) {
			throw new Error(
				`Failed to add interest: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	};

	const removeInterest = async (
		userId: string,
		interestId: string,
	): Promise<void> => {
		await db
			.delete(userInterests)
			.where(
				and(eq(userInterests.userId, userId), eq(userInterests.id, interestId)),
			);
	};

	const getInterests = async (userId: string): Promise<UserInterest[]> => {
		return db
			.select()
			.from(userInterests)
			.where(eq(userInterests.userId, userId));
	};

	return {
		addInterest,
		removeInterest,
		getInterests,
	};
};
