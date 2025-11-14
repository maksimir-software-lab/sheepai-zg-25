"use server";

import { cookies } from "next/headers";

const LAST_USED_COOKIE_NAME = "lastUsedOAuthProvider";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

export async function setLastUsedOAuthProvider(provider: "google" | "github") {
	const cookieStore = await cookies();
	cookieStore.set(LAST_USED_COOKIE_NAME, provider, {
		maxAge: COOKIE_MAX_AGE,
		path: "/",
		sameSite: "lax",
	});
}

export async function getLastUsedOAuthProvider(): Promise<
	"google" | "github" | null
> {
	const cookieStore = await cookies();
	const cookie = cookieStore.get(LAST_USED_COOKIE_NAME);
	if (cookie?.value === "google" || cookie?.value === "github") {
		return cookie.value;
	}
	return null;
}
