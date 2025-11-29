"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { clearAllUserInterests } from "@/actions/user-interests";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export const RetriggerOnboarding: React.FC = () => {
	const t = useTranslations("settings.retriggerOnboarding");
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [isClearing, setIsClearing] = useState(false);

	const handleRetrigger = async () => {
		setIsClearing(true);
		try {
			await clearAllUserInterests();
			setIsOpen(false);
			router.push("/onboarding");
		} catch (error) {
			console.error("Failed to clear interests:", error);
			setIsClearing(false);
		}
	};

	return (
		<div className="bg-linear-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">{t("title")}</h2>
				<p className="text-muted-foreground">{t("description")}</p>
			</div>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button variant="outline">{t("button")}</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("confirmTitle")}</DialogTitle>
						<DialogDescription>{t("confirmMessage")}</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsOpen(false)}
							disabled={isClearing}
						>
							{t("cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={handleRetrigger}
							disabled={isClearing}
						>
							{isClearing ? t("clearing") : t("confirm")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
