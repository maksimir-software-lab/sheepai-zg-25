"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { addUserInterest } from "@/actions/user-interests";
import nytimesLogo from "@/assets/img/nytimes.png";
import telegramLogo from "@/assets/img/telegram.png";
import thnLogo from "@/assets/img/thn.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Portal {
	id: string;
	logo: string | StaticImageData;
	isImage?: boolean;
	translationKey: string;
}

interface Category {
	id: string;
	translationKey: string;
}

const portals: Portal[] = [
	{
		id: "portal1",
		logo: thnLogo,
		isImage: true,
		translationKey: "theHackerNews",
	},
	{
		id: "portal2",
		logo: nytimesLogo,
		isImage: true,
		translationKey: "nyTimes",
	},
	{
		id: "portal3",
		logo: telegramLogo,
		isImage: true,
		translationKey: "telegram",
	},
];

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
	const [selectedPortals, setSelectedPortals] = useState<string[]>([]);
	const [occupation, setOccupation] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handlePortalToggle = (portalId: string) => {
		setSelectedPortals((prev) => {
			if (prev.includes(portalId)) {
				return prev.filter((id) => id !== portalId);
			}

			return [...prev, portalId];
		});
	};

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
		setOccupation("");
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

			if (occupation.trim()) {
				interestsToSave.push(
					t("interestTemplates.occupationInterest", { occupation }),
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

	const canProceedStep1 = selectedPortals.length > 0;
	const canProceedStep2 = true;
	const canProceedStep3 = selectedCategories.length > 0;

	return (
		<div className="w-full max-w-2xl mx-auto px-4 py-8">
			<div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-h-[400px] flex flex-col">
				<div className="mb-8">
					<div className="flex items-center justify-center gap-2">
						{[1, 2, 3].map((num) => (
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
								{num < 3 && (
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
									{t("step1.title")}
								</h2>
								<div className="space-y-4">
									{portals.map((portal) => {
										const portalName = t(`portals.${portal.translationKey}`);
										return (
											<button
												type="button"
												key={portal.id}
												className="flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 hover:border-gray-300 cursor-pointer w-full text-left"
												style={{
													borderColor: selectedPortals.includes(portal.id)
														? "#000"
														: "#e5e7eb",
												}}
												onClick={() => handlePortalToggle(portal.id)}
											>
												{portal.isImage ? (
													<div className="w-10 h-10 flex-shrink-0">
														<Image
															src={portal.logo as StaticImageData}
															alt={portalName}
															width={40}
															height={40}
															className="rounded-md w-full h-full"
															style={{ objectFit: "cover" }}
														/>
													</div>
												) : (
													<span className="text-3xl">
														{portal.logo as string}
													</span>
												)}
												<span className="text-lg font-medium flex-1">
													{portalName}
												</span>
											</button>
										);
									})}
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
									{t("step2.title")}
								</h2>
								<div className="space-y-4">
									<div>
										<Label htmlFor="occupation" className="text-lg mb-2 block">
											{t("step2.occupationLabel")}
										</Label>
										<Input
											id="occupation"
											type="text"
											value={occupation}
											onChange={(event) => setOccupation(event.target.value)}
											placeholder={t("step2.occupationPlaceholder")}
											className="text-lg p-6"
										/>
									</div>
								</div>
							</div>
						)}
					</div>

					<div
						className={`transition-all duration-500 ${
							step === 3
								? "opacity-100 translate-x-0"
								: "opacity-0 absolute pointer-events-none -translate-x-8"
						}`}
					>
						{step === 3 && (
							<div className="space-y-6">
								<h2 className="text-2xl font-semibold mb-4">
									{t("step3.title")}
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{categories.map((category) => {
										const categoryName = t(
											`categories.${category.translationKey}`,
										);
										return (
											<button
												type="button"
												key={category.id}
												className="flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 hover:border-gray-300 cursor-pointer text-left"
												style={{
													borderColor: selectedCategories.includes(category.id)
														? "#000"
														: "#e5e7eb",
												}}
												onClick={() => handleCategoryToggle(category.id)}
											>
												<span className="text-base font-medium">
													{categoryName}
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
						{step === 2 && (
							<Button
								variant="ghost"
								onClick={handleSkip}
								disabled={isSubmitting}
								className="px-6 py-6 text-base"
							>
								{t("buttons.skip")}
							</Button>
						)}

						{step < 3 ? (
							<Button
								onClick={handleNext}
								disabled={
									(step === 1 && !canProceedStep1) ||
									(step === 2 && !canProceedStep2) ||
									isSubmitting
								}
								className="px-6 py-6 text-base"
							>
								{t("buttons.next")}
							</Button>
						) : (
							<Button
								onClick={handleSubmit}
								disabled={!canProceedStep3 || isSubmitting}
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
