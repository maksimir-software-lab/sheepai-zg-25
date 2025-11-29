"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserInterests } from "@/hooks/use-user-interests";

export const InterestsManager: React.FC = () => {
	const t = useTranslations("settings.interests");
	const { interests, isLoading, addInterest, removeInterest } =
		useUserInterests();
	const [newInterest, setNewInterest] = useState("");
	const [isAdding, setIsAdding] = useState(false);

	const handleAddInterest = async () => {
		if (!newInterest.trim()) {
			return;
		}

		setIsAdding(true);
		try {
			await addInterest(newInterest.trim());
			setNewInterest("");
		} catch (error) {
			console.error("Failed to add interest:", error);
		} finally {
			setIsAdding(false);
		}
	};

	const handleRemoveInterest = async (interestId: string) => {
		try {
			await removeInterest(interestId);
		} catch (error) {
			console.error("Failed to remove interest:", error);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && !isAdding) {
			handleAddInterest();
		}
	};

	if (isLoading) {
		return (
			<div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8">
				<div className="animate-pulse space-y-4">
					<div className="h-6 bg-muted rounded w-1/3" />
					<div className="h-4 bg-muted rounded w-2/3" />
					<div className="h-12 bg-muted rounded" />
					<div className="flex gap-2">
						<div className="h-8 bg-muted rounded-full w-24" />
						<div className="h-8 bg-muted rounded-full w-32" />
						<div className="h-8 bg-muted rounded-full w-28" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">{t("title")}</h2>
				<p className="text-muted-foreground">{t("description")}</p>
			</div>

			<div className="flex gap-3">
				<Input
					value={newInterest}
					onChange={(event) => setNewInterest(event.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={t("addPlaceholder")}
					disabled={isAdding}
					className="flex-1"
				/>
				<Button
					onClick={handleAddInterest}
					disabled={isAdding || !newInterest.trim()}
				>
					{isAdding ? "..." : t("addButton")}
				</Button>
			</div>

			{interests.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-muted-foreground">{t("noInterests")}</p>
				</div>
			) : (
				<div className="flex flex-wrap gap-2">
					{interests.map((interest) => (
						<div
							key={interest.id}
							className="group flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 hover:border-primary/40 transition-colors"
						>
							<span className="text-sm font-medium">{interest.text}</span>
							<button
								type="button"
								onClick={() => handleRemoveInterest(interest.id)}
								className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
								aria-label={t("remove")}
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
