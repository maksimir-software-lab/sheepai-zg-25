"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { Header } from "@/components/organisms/Header";
import { MobileHeader } from "@/components/organisms/MobileHeader";
import { MobileNavigation } from "@/components/organisms/MobileNavigation";
import { UserInit } from "@/components/organisms/UserInit";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const pathname = usePathname();
	const isLoginPage = pathname === "/login";
	const isOnboardingPage = pathname === "/onboarding";
	const isDashboardPage = pathname === "/dashboard";
	const isArticlePage = pathname.startsWith("/article/");

	if (isLoginPage) {
		return <main>{children}</main>;
	}

	if (isOnboardingPage) {
		return (
			<>
				<UserInit />
				<main>{children}</main>
			</>
		);
	}

	if (isDashboardPage || isArticlePage) {
		return (
			<SidebarProvider defaultOpen={false}>
				<UserInit />
				<AppSidebar />
				<SidebarInset>
					<Header />
					<MobileHeader />
					<main className="p-8 pb-20 md:pb-8">{children}</main>
					<Suspense fallback={null}>
						<MobileNavigation />
					</Suspense>
				</SidebarInset>
			</SidebarProvider>
		);
	}

	return (
		<SidebarProvider>
			<UserInit />
			<AppSidebar />
			<SidebarInset>
				<Header />
				<MobileHeader />
				<main className="p-8 pb-20 md:pb-8">{children}</main>
				<Suspense fallback={null}>
					<MobileNavigation />
				</Suspense>
			</SidebarInset>
		</SidebarProvider>
	);
};
