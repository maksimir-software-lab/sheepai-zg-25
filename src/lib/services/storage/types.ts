import { z } from "zod";

export const storageBucketSchema = z.enum(["files", "images", "audio"]);

export const addResponseSchema = z.object({
	path: z.string(),
	publicUrl: z.string(),
});

export const getResponseSchema = z.object({
	publicUrl: z.string(),
});

export const updateResponseSchema = z.object({
	path: z.string(),
	publicUrl: z.string(),
});

export const deleteResponseSchema = z.object({
	isDeleted: z.boolean(),
});

export type StorageBucket = z.infer<typeof storageBucketSchema>;
export type AddResponse = z.infer<typeof addResponseSchema>;
export type GetResponse = z.infer<typeof getResponseSchema>;
export type UpdateResponse = z.infer<typeof updateResponseSchema>;
export type DeleteResponse = z.infer<typeof deleteResponseSchema>;
