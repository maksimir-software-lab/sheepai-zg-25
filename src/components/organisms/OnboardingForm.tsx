"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { addUserInterest } from "@/actions/user-interests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
	id: string;
	translationKey: string;
}

const categories: Category[] = [
	{ id: "tech", translationKey: "technology" },
	{ id: "business", translationKey: "business" },
	{ id: "science", translationKey: "science" },
	{ id: "health", translationKey: "health" },
	{ id: "sports", translationKey: "sports" },
	{ id: "entertainment", translationKey: "entertainment" },
	{ id: "politics", translationKey: "politics" },
	{ id: "environment", translationKey: "environment" },
	{ id: "education", translationKey: "education" },
	{ id: "finance", translationKey: "finance" },
];

export const OnboardingForm: React.FC = () => {
	const t = useTranslations("onboarding");
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [aboutYou, setAboutYou] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleCategoryToggle = (categoryId: string) => {
		setSelectedCategories((prev) => {
			if (prev.includes(categoryId)) {
				return prev.filter((id) => id !== categoryId);
			}

			return [...prev, categoryId];
		});
	};

	const handleNext = () => {
		setStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setStep((prev) => prev - 1);
	};

	const handleSkip = () => {
		setAboutYou("");
		handleNext();
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);

		try {
			const interestsToSave: string[] = [];

			for (const categoryId of selectedCategories) {
				const category = categories.find((cat) => cat.id === categoryId);
				if (category) {
					const categoryName = t(`categories.${category.translationKey}`);
					interestsToSave.push(
						t("interestTemplates.categoryInterest", { category: categoryName }),
					);
				}
			}

			if (aboutYou.trim()) {
				interestsToSave.push(
					t("interestTemplates.aboutYouInterest", { aboutYou }),
				);
			}

			await Promise.all(
				interestsToSave.map((interest) => addUserInterest(interest)),
			);

			router.push("/dashboard");
		} catch (error) {
			console.error("Failed to save interests:", error);
			router.push("/dashboard");
		} finally {
			setIsSubmitting(false);
		}
	};

	const canProceedStep1 = true;
	const canProceedStep2 = selectedCategories.length > 0;

	return (
		<div className="w-full max-w-2xl mx-auto px-4 py-8">
			<div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-h-[400px] flex flex-col">
				<div className="mb-8">
					<div className="flex items-center justify-center gap-2">
						{[1, 2].map((num) => (
							<div key={num} className="flex items-center">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
										step === num
											? "bg-black text-white scale-110"
											: step > num
												? "bg-green-500 text-white"
												: "bg-gray-200 text-gray-600"
									}`}
								>
									{step > num ? "✓" : num}
								</div>
								{num < 2 && (
									<div
										className={`w-12 h-1 mx-1 transition-all duration-300 ${
											step > num ? "bg-green-500" : "bg-gray-200"
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>

				<div className="flex-1">
					<div
						className={`transition-all duration-500 ${
							step === 1
								? "opacity-100 translate-x-0"
								: "opacity-0 absolute pointer-events-none -translate-x-8"
						}`}
					>
						{step === 1 && (
							<div className="space-y-6">
								<h2 className="text-2xl font-semibold mb-4">
									{t("step2.title")}
								</h2>
								<div className="space-y-4">
									<div>
										<Label htmlFor="aboutYou" className="text-lg mb-2 block">
											{t("step2.aboutYouLabel")}
										</Label>
										<Input
											id="aboutYou"
											type="text"
											value={aboutYou}
											onChange={(event) => setAboutYou(event.target.value)}
											placeholder={t("step2.aboutYouPlaceholder")}
											className="text-lg p-6"
										/>
									</div>
								</div>
							</div>
						)}
					</div>

					<div
						className={`transition-all duration-500 ${
							step === 2
								? "opacity-100 translate-x-0"
								: "opacity-0 absolute pointer-events-none -translate-x-8"
						}`}
					>
						{step === 2 && (
							<div className="space-y-6">
								<h2 className="text-2xl font-semibold mb-4">
									{t("step3.title")}
								</h2>
								<div className="flex flex-wrap gap-2">
									{categories.map((category) => {
										const categoryName = t(
											`categories.${category.translationKey}`,
										);
										const isSelected = selectedCategories.includes(category.id);
										return (
											<button
												type="button"
												key={category.id}
												className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
													isSelected
														? "bg-primary text-primary-foreground border-primary"
														: "bg-background text-foreground border-border hover:border-primary/50"
												}`}
												onClick={() => handleCategoryToggle(category.id)}
											>
												<span>{categoryName}</span>
												<span className="text-base">
													{isSelected ? "×" : "+"}
												</span>
											</button>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="mt-8 flex items-center justify-between gap-4">
					<Button
						variant="outline"
						onClick={handleBack}
						disabled={step === 1 || isSubmitting}
						className="px-6 py-6 text-base"
					>
						{t("buttons.back")}
					</Button>

					<div className="flex gap-3">
						{step === 1 && (
							<Button
								variant="ghost"
								onClick={handleSkip}
								disabled={isSubmitting}
								className="px-6 py-6 text-base"
							>
								{t("buttons.skip")}
							</Button>
						)}

						{step < 2 ? (
							<Button
								onClick={handleNext}
								disabled={!canProceedStep1 || isSubmitting}
								className="px-6 py-6 text-base"
							>
								{t("buttons.next")}
							</Button>
						) : (
							<Button
								onClick={handleSubmit}
								disabled={!canProceedStep2 || isSubmitting}
								className="px-6 py-6 text-base"
							>
								{isSubmitting ? t("buttons.saving") : t("buttons.submit")}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
