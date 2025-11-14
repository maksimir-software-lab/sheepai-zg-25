import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar";

export const AppSidebar: React.FC = () => {
	return (
		<Sidebar>
			<SidebarHeader></SidebarHeader>
			<SidebarContent>
				<SidebarGroup />
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
		</Sidebar>
	);
};
