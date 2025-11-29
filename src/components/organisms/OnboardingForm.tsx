"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import nytimesLogo from "@/assets/img/nytimes.png";
import telegramLogo from "@/assets/img/telegram.png";
import thnLogo from "@/assets/img/thn.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Portal {
	id: string;
	name: string;
	logo: string | StaticImageData;
	isImage?: boolean;
}

interface Category {
	id: string;
	name: string;
}

const portals: Portal[] = [
	{ id: "portal1", name: "The Hacker News", logo: thnLogo, isImage: true },
	{ id: "portal2", name: "NY Times", logo: nytimesLogo, isImage: true },
	{ id: "portal3", name: "Telegram", logo: telegramLogo, isImage: true },
];

const categories: Category[] = [
	{ id: "tech", name: "Technology" },
	{ id: "business", name: "Business" },
	{ id: "science", name: "Science" },
	{ id: "health", name: "Health" },
	{ id: "sports", name: "Sports" },
	{ id: "entertainment", name: "Entertainment" },
	{ id: "politics", name: "Politics" },
	{ id: "environment", name: "Environment" },
	{ id: "education", name: "Education" },
	{ id: "finance", name: "Finance" },
];

export const OnboardingForm: React.FC = () => {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [selectedPortals, setSelectedPortals] = useState<string[]>([]);
	const [occupation, setOccupation] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
		router.push("/dashboard");
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
									Select your portals
								</h2>
								<div className="space-y-4">
									{portals.map((portal) => (
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
														alt={portal.name}
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
												{portal.name}
											</span>
										</button>
									))}
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
									Tell us about yourself
								</h2>
								<div className="space-y-4">
									<div>
										<Label htmlFor="occupation" className="text-lg mb-2 block">
											What do you do for work?
										</Label>
										<Input
											id="occupation"
											type="text"
											value={occupation}
											onChange={(e) => setOccupation(e.target.value)}
											placeholder="Enter your occupation"
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
									Choose your interests
								</h2>
								<div className="flex flex-wrap gap-3">
									{categories.map((category) => {
										const isSelected = selectedCategories.includes(category.id);
										return (
											<button
												type="button"
												key={category.id}
												className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
													isSelected
														? "bg-primary text-primary-foreground border-primary"
														: "bg-background text-foreground border-border hover:border-primary/50"
												}`}
												onClick={() => handleCategoryToggle(category.id)}
											>
												<span>{category.name}</span>
												{isSelected ? (
													<svg
														className="w-4 h-4"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth={2.5}
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M6 18L18 6M6 6l12 12"
														/>
													</svg>
												) : (
													<svg
														className="w-4 h-4"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth={2.5}
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M12 4v16m8-8H4"
														/>
													</svg>
												)}
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
						disabled={step === 1}
						className="px-6 py-6 text-base"
					>
						Back
					</Button>

					<div className="flex gap-3">
						{step === 2 && (
							<Button
								variant="ghost"
								onClick={handleSkip}
								className="px-6 py-6 text-base"
							>
								Skip
							</Button>
						)}

						{step < 3 ? (
							<Button
								onClick={handleNext}
								disabled={
									(step === 1 && !canProceedStep1) ||
									(step === 2 && !canProceedStep2)
								}
								className="px-6 py-6 text-base"
							>
								Next
							</Button>
						) : (
							<Button
								onClick={handleSubmit}
								disabled={!canProceedStep3}
								className="px-6 py-6 text-base"
							>
								Submit
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
