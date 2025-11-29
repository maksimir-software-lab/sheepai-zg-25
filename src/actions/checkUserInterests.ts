"use server";

import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userInterests } from "@/db/schema";

export async function checkUserInterests() {
	const user = await currentUser();

	if (!user) {
		return false;
	}

	const interests = await db
		.select()
		.from(userInterests)
		.where(eq(userInterests.userId, user.id))
		.limit(1);

	return interests.length > 0;
}
