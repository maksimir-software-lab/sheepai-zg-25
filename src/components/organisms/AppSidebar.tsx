"use client";

import { LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export const AppSidebar: React.FC = () => {
	const t = useTranslations();

	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="h-14 border-b border-border">
				<div className="flex items-center justify-start h-full px-4">
					<h1 className="text-xl font-semibold tracking-tight text-left">
						{t("title")}
					</h1>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{t("sidebar.groups.main")}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === "/dashboard"}
									tooltip={t("sidebar.nav.dashboard")}
								>
									<Link href="/dashboard">
										<LayoutDashboard />
										<span>{t("sidebar.nav.dashboard")}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === "/settings"}
									tooltip={t("sidebar.nav.settings")}
								>
									<Link href="/settings">
										<Settings />
										<span>{t("sidebar.nav.settings")}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
		</Sidebar>
	);
};
