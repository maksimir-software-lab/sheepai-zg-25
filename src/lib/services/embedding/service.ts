import type { EmbeddingDeps } from "./deps";
import { validateEmbeddingResponse } from "./internal";
import type { IEmbeddingService } from "./types";

export const createEmbeddingService = (
	deps: EmbeddingDeps,
): IEmbeddingService => {
	const { openRouter, config: embeddingConfig } = deps;

	const generate = async (text: string): Promise<number[]> => {
		const response = await openRouter.embeddings.generate({
			model: embeddingConfig.model,
			input: text,
			encodingFormat: "float",
		});

		const embeddings = validateEmbeddingResponse(response);
		return embeddings[0] ?? [];
	};

	const generateBatch = async (texts: string[]): Promise<number[][]> => {
		const response = await openRouter.embeddings.generate({
			model: embeddingConfig.model,
			input: texts,
			encodingFormat: "float",
		});

		return validateEmbeddingResponse(response);
	};

	return {
		generate,
		generateBatch,
	};
};
