"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { Header } from "@/components/organisms/Header";
import { UserInit } from "@/components/organisms/UserInit";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const pathname = usePathname();
	const isLoginPage = pathname === "/login";
	const isOnboardingPage = pathname === "/onboarding";

	if (isLoginPage) {
		return <main>{children}</main>;
	}

	if (isOnboardingPage) {
		return (
			<div className="min-h-screen flex flex-col">
				<UserInit />
				<Header />
				<main className="flex-1">{children}</main>
			</div>
		);
	}

	return (
		<SidebarProvider>
			<UserInit />
			<AppSidebar />
			<SidebarInset>
				<Header />
				<main className="p-8">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
};
