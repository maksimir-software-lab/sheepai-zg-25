"use client";

import { useTranslations } from "next-intl";
import { OAuthButtons } from "@/components/molecules/OAuthButtons";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const AuthForm: React.FC = () => {
	const t = useTranslations("auth");

	return (
		<Card>
			<CardHeader className="mb-4">
				<CardTitle>{t("login.title")}</CardTitle>
				<CardDescription>{t("login.description")}</CardDescription>
			</CardHeader>
			<CardContent>
				<OAuthButtons />
			</CardContent>
		</Card>
	);
};
