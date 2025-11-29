import { SettingsTabs } from "@/components/organisms/SettingsTabs";

export default async function Page() {
	return (
		<div className="w-full max-w-6xl mx-auto px-4 py-8">
			<div className="space-y-8">
				<div className="space-y-2">
					<h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
					<p className="text-base md:text-lg text-muted-foreground">
						Manage your account settings and preferences
					</p>
				</div>

				<SettingsTabs />
			</div>
		</div>
	);
}
