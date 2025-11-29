import { useTranslations } from "next-intl";

const BackendValidationPage: React.FC = () => {
	const t = useTranslations("backend-validation");

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-3xl font-bold">{t("title")}</h1>
				<p className="text-muted-foreground">{t("description")}</p>
			</div>
		</div>
	);
};

export default BackendValidationPage;
