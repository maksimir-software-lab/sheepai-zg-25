"use client";

import { useClerk } from "@clerk/nextjs";
import { Compass, Home, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export const MobileNavigation: React.FC = () => {
	const t = useTranslations("navigation.mobile");
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const tabParam = searchParams.get("tab");
	const { signOut } = useClerk();

	const isExploreActive = pathname === "/dashboard" && tabParam === "explore";
	const isForYouActive =
		(pathname === "/dashboard" && tabParam !== "explore") ||
		pathname.startsWith("/article");
	const isSettingsActive = pathname === "/settings";

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
			<div className="flex items-center justify-around h-16 px-2">
				<Link
					href="/dashboard"
					className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors duration-200 ${
						isForYouActive
							? "text-primary"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					<Home className="w-6 h-6" />
					<span className="text-xs font-medium">{t("forYou")}</span>
					{isForYouActive && (
						<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
					)}
				</Link>

				<Link
					href="/dashboard?tab=explore"
					className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors duration-200 ${
						isExploreActive
							? "text-primary"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					<Compass className="w-6 h-6" />
					<span className="text-xs font-medium">{t("explore")}</span>
					{isExploreActive && (
						<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
					)}
				</Link>

				<Link
					href="/settings"
					className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors duration-200 ${
						isSettingsActive
							? "text-primary"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					<Settings className="w-6 h-6" />
					<span className="text-xs font-medium">{t("settings")}</span>
					{isSettingsActive && (
						<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
					)}
				</Link>

				<button
					type="button"
					onClick={() => signOut()}
					className="flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors duration-200 text-muted-foreground hover:text-foreground"
				>
					<LogOut className="w-6 h-6" />
					<span className="text-xs font-medium">{t("logout")}</span>
				</button>
			</div>
		</nav>
	);
};
