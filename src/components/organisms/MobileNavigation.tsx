"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { Compass, Home, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export const MobileNavigation: React.FC = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab");
	const { signOut } = useClerk();
	const { isSignedIn } = useAuth();

	const isForYouActive =
		(pathname === "/dashboard" && tab !== "explore") ||
		pathname.startsWith("/article");
	const isExploreActive = pathname === "/dashboard" && tab === "explore";
	const isSettingsActive = pathname === "/settings";

	const handleSignOut = () => {
		signOut({ redirectUrl: "/" });
	};

	if (!isSignedIn) {
		return null;
	}

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
			<div className="flex items-center justify-around h-16 px-4">
				<Link
					href="/dashboard"
					className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 relative"
				>
					<Home
						className={`w-6 h-6 transition-colors duration-200 ${
							isForYouActive ? "text-primary" : "text-muted-foreground"
						}`}
					/>
					<span
						className={`text-xs font-medium transition-colors duration-200 ${
							isForYouActive ? "text-primary" : "text-muted-foreground"
						}`}
					>
						For You
					</span>
					{isForYouActive && (
						<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
					)}
				</Link>

				<Link
					href="/dashboard?tab=explore"
					className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 relative"
				>
					<Compass
						className={`w-6 h-6 transition-colors duration-200 ${
							isExploreActive ? "text-primary" : "text-muted-foreground"
						}`}
					/>
					<span
						className={`text-xs font-medium transition-colors duration-200 ${
							isExploreActive ? "text-primary" : "text-muted-foreground"
						}`}
					>
						Explore
					</span>
					{isExploreActive && (
						<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
					)}
				</Link>

				<Link
					href="/settings"
					className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 relative"
				>
					<Settings
						className={`w-6 h-6 transition-colors duration-200 ${
							isSettingsActive ? "text-primary" : "text-muted-foreground"
						}`}
					/>
					<span
						className={`text-xs font-medium transition-colors duration-200 ${
							isSettingsActive ? "text-primary" : "text-muted-foreground"
						}`}
					>
						Settings
					</span>
					{isSettingsActive && (
						<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
					)}
				</Link>

				<button
					type="button"
					onClick={handleSignOut}
					className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 relative"
				>
					<LogOut className="w-6 h-6 text-muted-foreground transition-colors duration-200 hover:text-destructive" />
					<span className="text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-destructive">
						Logout
					</span>
				</button>
			</div>
		</nav>
	);
};
