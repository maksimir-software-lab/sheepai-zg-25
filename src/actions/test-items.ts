"use server";

import { eq } from "drizzle-orm";
import { db, testItems } from "@/db";

export const getTestItems = async () => {
	return db.select().from(testItems).orderBy(testItems.createdAt);
};

export const createTestItem = async (data: {
	name: string;
	count?: number;
	isActive?: boolean;
}) => {
	const [newItem] = await db
		.insert(testItems)
		.values({
			name: data.name,
			count: data.count ?? 0,
			isActive: data.isActive ?? true,
		})
		.returning();
	return newItem;
};

export const updateTestItem = async (
	id: number,
	data: {
		name?: string;
		count?: number;
		isActive?: boolean;
	},
) => {
	const [updatedItem] = await db
		.update(testItems)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(eq(testItems.id, id))
		.returning();
	return updatedItem;
};

export const deleteTestItem = async (id: number) => {
	const [deletedItem] = await db
		.delete(testItems)
		.where(eq(testItems.id, id))
		.returning();
	return deletedItem;
};
