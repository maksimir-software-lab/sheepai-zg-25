"use client";

import { Check, Edit, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import {
	createTestItem,
	deleteTestItem,
	getTestItems,
	updateTestItem,
} from "@/actions/test-items";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TestItem = {
	id: number;
	name: string;
	count: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
};

type EditState = {
	id: number;
	name: string;
	count: number;
	isActive: boolean;
};

export const TestItemsCrud: React.FC = () => {
	const t = useTranslations("backend-validation");
	const [items, setItems] = useState<TestItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [newItemName, setNewItemName] = useState("");
	const [newItemCount, setNewItemCount] = useState("0");
	const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [editingRow, setEditingRow] = useState<EditState | null>(null);
	const [savingId, setSavingId] = useState<number | null>(null);

	const loadItems = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const items = await getTestItems();
			setItems(items as TestItem[]);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load items");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadItems();
	}, [loadItems]);

	const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newItemName.trim()) return;

		try {
			setError(null);
			await createTestItem({
				name: newItemName,
				count: parseInt(newItemCount, 10) || 0,
				isActive: true,
			});

			setNewItemName("");
			setNewItemCount("0");
			await loadItems();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create item");
		}
	};

	const handleStartEdit = (item: TestItem) => {
		setEditingRow({
			id: item.id,
			name: item.name,
			count: item.count,
			isActive: item.isActive,
		});
	};

	const handleCancelEdit = () => {
		setEditingRow(null);
	};

	const handleSaveRow = async () => {
		if (!editingRow) return;

		try {
			setError(null);
			setSavingId(editingRow.id);

			await updateTestItem(editingRow.id, {
				name: editingRow.name,
				count: editingRow.count,
				isActive: editingRow.isActive,
			});

			setEditingRow(null);
			await loadItems();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update item");
		} finally {
			setSavingId(null);
		}
	};

	const handleDeleteItem = async (id: number) => {
		try {
			setError(null);
			await deleteTestItem(id);
			setDeleteConfirmId(null);
			await loadItems();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete item");
		}
	};

	if (loading) {
		return <div className="p-8 text-center">{t("loading")}</div>;
	}

	return (
		<div className="space-y-6 p-6">
			{error && (
				<div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
					{error}
				</div>
			)}

			<form onSubmit={handleCreateItem} className="rounded-lg border p-6">
				<h2 className="mb-4 text-lg font-semibold">{t("createItem")}</h2>
				<div className="space-y-4">
					<div>
						<Label htmlFor="item-name">{t("name")}</Label>
						<Input
							id="item-name"
							placeholder={t("namePlaceholder")}
							value={newItemName}
							onChange={(e) => setNewItemName(e.target.value)}
							required
						/>
					</div>
					<div>
						<Label htmlFor="item-count">{t("count")}</Label>
						<Input
							id="item-count"
							type="number"
							placeholder="0"
							value={newItemCount}
							onChange={(e) => setNewItemCount(e.target.value)}
						/>
					</div>
					<Button type="submit" className="w-full">
						<Plus className="size-4" />
						{t("addButton")}
					</Button>
				</div>
			</form>

			<div className="overflow-hidden rounded-lg border bg-card shadow-sm">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-20 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
									{t("id")}
								</TableHead>
								<TableHead className="min-w-[12rem] font-semibold text-xs uppercase tracking-wide text-muted-foreground">
									{t("name")}
								</TableHead>
								<TableHead className="w-28 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
									{t("count")}
								</TableHead>
								<TableHead className="w-24 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
									{t("active")}
								</TableHead>
								<TableHead className="w-32 text-right font-semibold text-xs uppercase tracking-wide text-muted-foreground">
									{t("actions")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.length > 0 ? (
								items.map((item) => {
									const isEditing = editingRow?.id === item.id;
									const isSaving = savingId === item.id;

									return (
										<TableRow
											key={item.id}
											className={cn(
												isEditing &&
													"bg-accent/40 dark:bg-accent/10 ring-2 ring-accent/50 ring-inset",
												isSaving && "animate-pulse opacity-60",
											)}
										>
											<TableCell className="font-mono text-sm text-muted-foreground">
												<div className="py-1 min-h-[2rem] flex items-center">
													{item.id}
												</div>
											</TableCell>
											<TableCell>
												{isEditing ? (
													<Input
														value={editingRow.name}
														onChange={(e) =>
															setEditingRow({
																...editingRow,
																name: e.target.value,
															})
														}
														className="h-8 min-w-[8rem] focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
													/>
												) : (
													<div className="py-1 min-h-[2rem] flex items-center truncate max-w-xs">
														{item.name}
													</div>
												)}
											</TableCell>
											<TableCell>
												{isEditing ? (
													<Input
														type="number"
														value={editingRow.count}
														onChange={(e) =>
															setEditingRow({
																...editingRow,
																count: parseInt(e.target.value, 10) || 0,
															})
														}
														className="h-8 w-20 tabular-nums text-center focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
													/>
												) : (
													<div className="py-1 min-h-[2rem] flex items-center tabular-nums">
														{item.count}
													</div>
												)}
											</TableCell>
											<TableCell>
												{isEditing ? (
													<div className="flex items-center justify-start pl-1 py-1">
														<Checkbox
															checked={editingRow.isActive}
															onCheckedChange={(checked) =>
																setEditingRow({
																	...editingRow,
																	isActive: checked as boolean,
																})
															}
														/>
													</div>
												) : (
													<div className="flex items-center justify-start pl-1">
														<Checkbox checked={item.isActive} disabled />
													</div>
												)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-2">
													{isEditing ? (
														<>
															<Button
																variant="outline"
																size="icon-sm"
																onClick={handleSaveRow}
																disabled={isSaving}
																aria-label={t("save")}
																className="border-green-600/50 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700 dark:border-green-500/50 dark:text-green-400 dark:hover:bg-green-950/30 dark:hover:border-green-500 transition-all duration-200"
															>
																<Check className="size-4" />
															</Button>
															<Button
																variant="ghost"
																size="icon-sm"
																onClick={handleCancelEdit}
																disabled={isSaving}
																aria-label={t("cancelEdit")}
																className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 transition-all duration-200"
															>
																<X className="size-4" />
															</Button>
														</>
													) : (
														<>
															<Button
																variant="outline"
																size="icon-sm"
																onClick={() => handleStartEdit(item)}
																aria-label={t("edit")}
																className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary hover:text-primary dark:border-primary/50 dark:hover:bg-primary/20 transition-all duration-200"
															>
																<Edit className="size-4" />
															</Button>
															<Dialog
																open={deleteConfirmId === item.id}
																onOpenChange={(open) =>
																	setDeleteConfirmId(open ? item.id : null)
																}
															>
																<DialogTrigger asChild>
																	<Button
																		variant="destructive"
																		size="icon-sm"
																		onClick={() => setDeleteConfirmId(item.id)}
																		aria-label={t("delete")}
																		className="transition-all duration-200"
																	>
																		<Trash2 className="size-4" />
																	</Button>
																</DialogTrigger>
																<DialogContent>
																	<DialogHeader>
																		<DialogTitle>
																			{t("deleteConfirm")}
																		</DialogTitle>
																		<DialogDescription>
																			{t("deleteMessage", { name: item.name })}
																		</DialogDescription>
																	</DialogHeader>
																	<DialogFooter>
																		<Button
																			variant="outline"
																			onClick={() => setDeleteConfirmId(null)}
																		>
																			{t("cancel")}
																		</Button>
																		<Button
																			variant="destructive"
																			onClick={() => handleDeleteItem(item.id)}
																		>
																			{t("delete")}
																		</Button>
																	</DialogFooter>
																</DialogContent>
															</Dialog>
														</>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell
										colSpan={5}
										className="h-32 py-12 text-center text-muted-foreground text-sm font-medium"
									>
										{t("noItems")}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};
