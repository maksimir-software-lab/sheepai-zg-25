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

export type ILlmService = {
	generateText: (params: GenerateTextParams) => Promise<string>;
	generateObject: <TSchema extends z.ZodType>(
		params: GenerateObjectParams<TSchema>,
	) => Promise<z.infer<TSchema>>;
};
