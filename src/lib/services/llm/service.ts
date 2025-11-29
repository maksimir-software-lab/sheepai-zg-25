import { generateObject, generateText } from "ai";
import type { z } from "zod";
import type { LlmDeps } from "./deps";
import type { GenerateObjectParams, GenerateTextParams } from "./types";

export type ILlmService = {
	generateText: (params: GenerateTextParams) => Promise<string>;
	generateObject: <TSchema extends z.ZodType>(
		params: GenerateObjectParams<TSchema>,
	) => Promise<z.infer<TSchema>>;
};

export const createLlmService = (deps: LlmDeps): ILlmService => {
	const { openRouterAiSdk, config } = deps;

	const generateTextResponse = async (
		params: GenerateTextParams,
	): Promise<string> => {
		const response = await generateText({
			model: openRouterAiSdk(params.model ?? config.defaultModel),
			prompt: params.prompt,
			maxOutputTokens: 8192,
			temperature: params.temperature ?? config.defaultTemperature,
			seed: params.seed,
		});

		return response.text;
	};

	const generateObjectResponse = async <T extends z.ZodType>(
		params: GenerateObjectParams<T>,
	): Promise<z.infer<T>> => {
		const response = await generateObject({
			model: openRouterAiSdk(params.model ?? config.defaultModel),
			schema: params.schema,
			prompt: params.prompt,
			maxOutputTokens: 8192,
			temperature: params.temperature ?? config.defaultTemperature,
			seed: params.seed,
		});

		return response.object as z.infer<T>;
	};

	return {
		generateText: generateTextResponse,
		generateObject: generateObjectResponse,
	};
};
