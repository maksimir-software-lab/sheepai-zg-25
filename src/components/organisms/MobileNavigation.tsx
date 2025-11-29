"use client";

import { Compass, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export const MobileNavigation: React.FC = () => {
	const t = useTranslations("navigation.mobile");
	const pathname = usePathname();

	const isForYouActive =
		pathname === "/dashboard" || pathname.startsWith("/article");
	const isExploreActive = pathname === "/explore";
	const isSettingsActive = pathname === "/settings";

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
			<div className="flex items-center justify-around h-16 px-4">
				<Link
					href="/dashboard"
					className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
						isForYouActive
							? "text-primary"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					<Home className={`w-6 h-6 ${isForYouActive ? "fill-current" : ""}`} />
					<span className="text-xs font-medium">{t("forYou")}</span>
				</Link>

				<Link
					href="/dashboard?tab=explore"
					className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
						isExploreActive
							? "text-primary"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					<Compass
						className={`w-6 h-6 ${isExploreActive ? "fill-current" : ""}`}
					/>
					<span className="text-xs font-medium">{t("explore")}</span>
				</Link>

				<Link
					href="/settings"
					className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
						isSettingsActive
							? "text-primary"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					<Settings
						className={`w-6 h-6 ${isSettingsActive ? "fill-current" : ""}`}
					/>
					<span className="text-xs font-medium">{t("settings")}</span>
				</Link>
			</div>
		</nav>
	);
};
