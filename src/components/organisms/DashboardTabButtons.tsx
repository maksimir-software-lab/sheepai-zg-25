"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const DashboardTabButtons: React.FC = () => {
	const searchParams = useSearchParams();
	const activeTab =
		searchParams.get("tab") === "explore" ? "explore" : "forYou";

	return (
		<div className="hidden md:block w-full max-w-6xl mx-auto mb-8">
			<div className="inline-flex p-1.5 bg-muted/50 backdrop-blur-sm rounded-2xl gap-2 border border-border/50">
				<Link
					href="/dashboard"
					className={`cursor-pointer px-10 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${
						activeTab === "forYou"
							? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
							: "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:scale-102 hover:shadow-md"
					}`}
				>
					For You
				</Link>
				<Link
					href="/dashboard?tab=explore"
					className={`cursor-pointer px-10 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${
						activeTab === "explore"
							? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
							: "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:scale-102 hover:shadow-md"
					}`}
				>
					Explore
				</Link>
			</div>
		</div>
	);
};
