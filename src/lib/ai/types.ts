import { z } from "zod";

export const generateTextRequestSchema = z.object({
	model: z.string(),
	prompt: z.string(),
	temperature: z.number().optional(),
	seed: z.number().optional(),
});

export type GenerateTextRequest = z.infer<typeof generateTextRequestSchema>;

export type GenerateTextResponse = Promise<string>;

export type GenerateObjectRequest<T extends z.ZodObject<z.ZodRawShape>> = {
	model: string;
	schema: T;
	prompt: string;
	temperature?: number;
	seed?: number;
};

export type GenerateObjectResponse<T extends z.ZodObject<z.ZodRawShape>> =
	Promise<z.infer<T>>;
