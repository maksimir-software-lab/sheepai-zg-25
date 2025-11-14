"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { UserMenu } from "@/components/molecules/UserMenu";
import { Button } from "@/components/ui/button";

export const Header: React.FC = () => {
	const t = useTranslations("auth");
	const router = useRouter();

	const handleAuthClick = () => {
		router.push("/login");
	};

	return (
		<header className="w-full h-14 bg-transparent absolute top-0 left-0 right-0 z-10">
			<div className="flex items-center justify-between px-4 h-full">
				<div></div>
				<div className="flex items-center gap-2 sm:gap-4">
					<SignedOut>
						<Button
							type="button"
							variant="default"
							onClick={handleAuthClick}
							className="text-sm sm:text-base"
						>
							{t("header.login")}
						</Button>
					</SignedOut>
					<SignedIn>
						<UserMenu />
					</SignedIn>
				</div>
			</div>
		</header>
	);
};
