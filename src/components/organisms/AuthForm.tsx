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
import { cn } from "@/lib/utils";

export function AuthForm({ className, ...props }: React.ComponentProps<"div">) {
	const t = useTranslations("auth");

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>{t("login.title")}</CardTitle>
					<CardDescription>{t("login.description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<OAuthButtons />
				</CardContent>
			</Card>
		</div>
	);
}
