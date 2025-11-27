import type { z } from "zod";

export type GenerateTextRequest = {
	model: string;
	prompt: string;
	temperature?: number;
	seed?: number;
};

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
