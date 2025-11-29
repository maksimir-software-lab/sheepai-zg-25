"use server";

import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function ensureUser() {
	const user = await currentUser();

	if (!user) {
		return null;
	}

	const existingUser = await db
		.select()
		.from(users)
		.where(eq(users.id, user.id))
		.limit(1);

	if (existingUser.length === 0) {
		const email = user.emailAddresses.at(0)?.emailAddress ?? "";

		await db.insert(users).values({
			id: user.id,
			email: email,
		});
	}

	return user.id;
}
