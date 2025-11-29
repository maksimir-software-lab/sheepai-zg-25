import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isAuthDisabled = process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";

const isPublicRoute = createRouteMatcher([
	"/login(.*)",
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/sso-callback(.*)",
]);

const noopMiddleware = (_request: NextRequest) => {
	return NextResponse.next();
};

export default isAuthDisabled
	? noopMiddleware
	: clerkMiddleware((auth, request) => {
			if (!isPublicRoute(request)) {
				auth.protect();
			}
		});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
