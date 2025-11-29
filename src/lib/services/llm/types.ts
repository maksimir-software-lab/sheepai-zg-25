import type { z } from "zod";

export type GenerateTextParams = {
	prompt: string;
	model?: string;
	temperature?: number;
	seed?: number;
};

export type GenerateObjectParams<TSchema extends z.ZodType> = {
	prompt: string;
	schema: TSchema;
	model?: string;
	temperature?: number;
	seed?: number;
};
