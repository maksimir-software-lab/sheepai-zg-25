"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { Header } from "@/components/organisms/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isLoginPage = pathname === "/login";

	if (isLoginPage) {
		return <main>{children}</main>;
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<Header />
			<main>{children}</main>
		</SidebarProvider>
	);
}
