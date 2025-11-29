"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { Header } from "@/components/organisms/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const pathname = usePathname();
	const isLoginPage = pathname === "/login";

	if (isLoginPage) {
		return <main>{children}</main>;
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<Header />
				<main className="p-8">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
};
