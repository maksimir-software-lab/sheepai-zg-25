import type { CreateEmbeddingsResponse } from "@openrouter/sdk/models/operations";

export const validateEmbeddingResponse = (
	response: CreateEmbeddingsResponse,
): number[][] => {
	if (typeof response === "string") {
		throw new Error("Invalid embedding response: received string");
	}

	return response.data.map((item) => {
		if (!Array.isArray(item.embedding)) {
			throw new Error("Invalid embedding response: embedding is not an array");
		}
		return item.embedding;
	});
};
