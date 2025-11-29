import { getTranslations } from "next-intl/server";
import { InterestsManager } from "@/components/organisms/InterestsManager";

export default async function Page() {
	const t = await getTranslations("settings");

	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="space-y-8">
				<div className="space-y-2">
					<h1 className="text-4xl font-bold">{t("title")}</h1>
					<p className="text-lg text-muted-foreground">{t("description")}</p>
				</div>

				<InterestsManager />
			</div>
		</div>
	);
}
