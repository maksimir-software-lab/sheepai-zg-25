"use server";

import { currentUser } from "@clerk/nextjs/server";
import { services } from "@/lib/services";

export const getArticleTldr = async (articleId: string) => {
	try {
		const user = await currentUser();
		const userId = user?.id;

		const result = await services.articleTldr.getOrCreateTldr({
			articleId,
			userId,
		});

		return {
			success: true,
			tldr: result.tldr.tldr,
			isNewlyGenerated: result.isNewlyGenerated,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
