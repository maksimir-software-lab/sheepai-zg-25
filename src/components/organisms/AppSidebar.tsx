import { useTranslations } from "next-intl";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar";

export const AppSidebar: React.FC = () => {
	const t = useTranslations();

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
				<SidebarGroup />
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
		</Sidebar>
	);
};
