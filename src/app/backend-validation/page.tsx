import { useTranslations } from "next-intl";
import { TestItemsCrud } from "@/components/organisms/TestItemsCrud";

const BackendValidationPage: React.FC = () => {
	const t = useTranslations("backend-validation");

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-3xl font-bold">{t("title")}</h1>
				<p className="text-muted-foreground">{t("description")}</p>
			</div>
			<TestItemsCrud />
		</div>
	);
};

export default BackendValidationPage;
