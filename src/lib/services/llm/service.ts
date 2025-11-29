import { generateObject, generateText } from "ai";
import type { z } from "zod";
import type { LlmDeps } from "./deps";
import type {
	GenerateObjectParams,
	GenerateTextParams,
	ILlmService,
} from "./types";

export const createLlmService = (deps: LlmDeps): ILlmService => {
	const { openRouterAiSdk, config } = deps;

	const generateTextResponse = async (
		params: GenerateTextParams,
	): Promise<string> => {
		const response = await generateText({
			model: openRouterAiSdk(params.model ?? config.defaultModel),
			prompt: params.prompt,
			temperature: params.temperature ?? config.defaultTemperature,
			seed: params.seed,
		});

		return response.text;
	};

	const generateObjectResponse = async <TSchema extends z.ZodType>(
		params: GenerateObjectParams<TSchema>,
	): Promise<z.infer<TSchema>> => {
		const response = await generateObject({
			model: openRouterAiSdk(params.model ?? config.defaultModel),
			schema: params.schema,
			prompt: params.prompt,
			temperature: params.temperature ?? config.defaultTemperature,
			seed: params.seed,
		});

		return response.object;
	};

	return {
		generateText: generateTextResponse,
		generateObject: generateObjectResponse,
	};
};
