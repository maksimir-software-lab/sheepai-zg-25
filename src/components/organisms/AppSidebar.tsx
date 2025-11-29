"use client";

import { Database } from "lucide-react";
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
					<SidebarGroupLabel>Admin</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === "/backend-validation"}
									tooltip="Backend Validation"
								>
									<Link href="/debug">
										<Database />
										<span>Debug</span>
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
