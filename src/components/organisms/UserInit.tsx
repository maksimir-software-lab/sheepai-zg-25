"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { checkUserInterests } from "@/actions/checkUserInterests";
import { ensureUser } from "@/actions/ensureUser";

export const UserInit: React.FC = () => {
	const { isLoaded, isSignedIn } = useUser();
	const router = useRouter();
	const pathname = usePathname();
	const hasInitialized = useRef(false);

	useEffect(() => {
		const initUser = async () => {
			if (!isLoaded || !isSignedIn || hasInitialized.current) {
				return;
			}

			hasInitialized.current = true;

			await ensureUser();

			const hasInterests = await checkUserInterests();

			if (!hasInterests && pathname !== "/onboarding") {
				router.push("/onboarding");
				return;
			}

			if (hasInterests && pathname === "/") {
				router.push("/dashboard");
			}
		};

		initUser();
	}, [isLoaded, isSignedIn, router, pathname]);

	return null;
};
