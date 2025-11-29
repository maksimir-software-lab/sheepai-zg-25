"use client";

import { Database, LayoutDashboard, Rss, Server } from "lucide-react";
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
		<Sidebar>
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
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>{t("sidebar.groups.admin")}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === "/debug"}
									tooltip={t("sidebar.nav.debug")}
								>
									<Link href="/debug">
										<Database />
										<span>{t("sidebar.nav.debug")}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === "/scraper-test"}
									tooltip={t("sidebar.nav.scraperTest")}
								>
									<Link href="/scraper-test">
										<Rss />
										<span>{t("sidebar.nav.scraperTest")}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === "/backend-validation"}
									tooltip={t("sidebar.nav.backendValidation")}
								>
									<Link href="/backend-validation">
										<Server />
										<span>{t("sidebar.nav.backendValidation")}</span>
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
