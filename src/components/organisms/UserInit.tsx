"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkUserInterests } from "@/actions/checkUserInterests";
import { ensureUser } from "@/actions/ensureUser";

export const UserInit: React.FC = () => {
	const { isLoaded, isSignedIn } = useUser();
	const _router = useRouter();
	const _pathname = usePathname();

	useEffect(() => {
		const initUser = async () => {
			if (!isLoaded || !isSignedIn) {
				return;
			}

			await ensureUser();

			const _hasInterests = await checkUserInterests();
			/* 
			if (!hasInterests && pathname !== "/onboarding") {
				router.push("/onboarding");
			}

			if (hasInterests && pathname === "/onboarding") {
				router.push("/dashboard");
			} */
		};

		initUser();
	}, [isLoaded, isSignedIn]);

	return null;
};
