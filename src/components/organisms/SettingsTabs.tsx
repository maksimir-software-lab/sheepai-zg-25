"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Category {
	id: string;
	name: string;
}

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

const initialSources = ["The Hacker News"];

export const SettingsTabs: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"tags" | "sources">("sources");
	const [selectedTags, setSelectedTags] = useState<string[]>([
		"tech",
		"business",
		"science",
	]);
	const [sources, setSources] = useState<string[]>(initialSources);
	const [isAddingSource, setIsAddingSource] = useState(false);
	const [newSource, setNewSource] = useState("");

	const handleTagToggle = (tagId: string) => {
		setSelectedTags((prev) => {
			if (prev.includes(tagId)) {
				return prev.filter((id) => id !== tagId);
			}

			return [...prev, tagId];
		});
	};

	const handleAddSource = () => {
		setIsAddingSource(true);
	};

	const handleSaveSource = () => {
		if (newSource.trim()) {
			setSources((prev) => [...prev, newSource.trim()]);
			setNewSource("");
			setIsAddingSource(false);
		}
	};

	const handleCancelAddSource = () => {
		setNewSource("");
		setIsAddingSource(false);
	};

	return (
		<div className="w-full space-y-6">
			<div className="w-full border-b border-border">
				<div className="flex gap-8">
					<button
						type="button"
						onClick={() => setActiveTab("sources")}
						className={`pb-4 px-2 text-base font-semibold transition-all duration-200 border-b-2 ${
							activeTab === "sources"
								? "border-foreground text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground"
						}`}
					>
						Sources
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("tags")}
						className={`pb-4 px-2 text-base font-semibold transition-all duration-200 border-b-2 ${
							activeTab === "tags"
								? "border-foreground text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground"
						}`}
					>
						Tags
					</button>
				</div>
			</div>

			<div className="py-4">
				{activeTab === "tags" && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Select your tags</h2>
						<div className="flex flex-wrap gap-3">
							{categories.map((category) => {
								const isSelected = selectedTags.includes(category.id);
								return (
									<button
										type="button"
										key={category.id}
										className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
											isSelected
												? "bg-primary text-primary-foreground border-primary"
												: "bg-background text-foreground border-border hover:border-primary/50"
										}`}
										onClick={() => handleTagToggle(category.id)}
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

				{activeTab === "sources" && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Your sources</h2>
						<div className="space-y-3">
							{sources.map((source) => (
								<div
									key={source}
									className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50"
								>
									<span className="text-base font-medium">{source}</span>
								</div>
							))}

							{isAddingSource ? (
								<div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
									<Input
										type="text"
										value={newSource}
										onChange={(e) => setNewSource(e.target.value)}
										placeholder="Enter source name"
										className="flex-1"
										autoFocus
									/>
									<div className="flex gap-2">
										<Button
											onClick={handleSaveSource}
											size="default"
											className="flex-1 sm:flex-none"
										>
											Save
										</Button>
										<Button
											onClick={handleCancelAddSource}
											variant="outline"
											size="default"
											className="flex-1 sm:flex-none"
										>
											Cancel
										</Button>
									</div>
								</div>
							) : (
								<Button
									onClick={handleAddSource}
									variant="outline"
									className="w-full sm:w-auto"
								>
									<svg
										className="w-4 h-4 mr-2"
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
									Add new source
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
