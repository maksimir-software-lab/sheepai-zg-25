import { createOpenRouter as createOpenRouterAiSdk } from "@openrouter/ai-sdk-provider";
import { OpenRouter } from "@openrouter/sdk";
import type { CreateEmbeddingsResponse } from "@openrouter/sdk/models/operations";
import { generateObject, generateText } from "ai";
import type { z } from "zod";
import type {
	GenerateObjectRequest,
	GenerateObjectResponse,
	GenerateTextRequest,
	GenerateTextResponse,
} from "./types";

const openrouterApiKey = process.env.OPENROUTER_API_KEY;

if (!openrouterApiKey) {
	throw new Error("OPENROUTER_API_KEY environment variable is not defined");
}

/*
 * The OpenRouter provider for the Vercel AI SDK does not support embedding models yet,
 * hence why we're using the OpenRouter SDK as well.
 */
const openrouter = new OpenRouter({
	apiKey: openrouterApiKey,
});

const openrouterAiSdk = createOpenRouterAiSdk({
	apiKey: openrouterApiKey,
});

export const generateTextResponse = async (
	request: GenerateTextRequest,
): GenerateTextResponse => {
	const response = await generateText({
		model: openrouterAiSdk(request.model),
		prompt: request.prompt,
		temperature: request.temperature,
		seed: request.seed,
	});

	return response.text;
};

export const generateObjectResponse = async <
	T extends z.ZodObject<z.ZodRawShape>,
>(
	request: GenerateObjectRequest<T>,
): GenerateObjectResponse<T> => {
	const response = await generateObject({
		model: openrouterAiSdk(request.model),
		schema: request.schema,
		prompt: request.prompt,
		temperature: request.temperature,
		seed: request.seed,
	});

	return response.object;
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
	const embeddingResponse = await openrouter.embeddings.generate({
		model: "google/gemini-embedding-001",
		input: text,
		encodingFormat: "float",
	});

	const embedding = validateEmbeddingResponse(embeddingResponse);

	return embedding;
};

const validateEmbeddingResponse = (
	embeddingResponse: CreateEmbeddingsResponse,
): number[] => {
	/*
	 * OpenRouter SDK has a strange type for CreateEmbeddingsResponse,
	 * which is why we need to handle these string cases.
	 */
	if (typeof embeddingResponse === "string") {
		throw new Error("Invalid embedding response");
	}

	const embedding = embeddingResponse.data[0].embedding;

	/*
	 * Same here, the embedding result is a union of string and number[],
	 */
	if (!Array.isArray(embedding)) {
		throw new Error("Invalid embedding response");
	}

	return embedding;
};
