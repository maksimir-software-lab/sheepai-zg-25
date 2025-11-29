import { Suspense } from "react";
import {
	DashboardTabs,
	DashboardTabsNavigation,
} from "@/components/organisms/DashboardTabs";

export default async function Page() {
	return (
		<div className="space-y-12">
			<Suspense fallback={null}>
				<DashboardTabsNavigation />
			</Suspense>
			<Suspense fallback={null}>
				<DashboardTabs />
			</Suspense>
		</div>
	);
}
