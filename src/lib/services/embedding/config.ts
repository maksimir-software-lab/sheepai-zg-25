export const EMBEDDING_CONFIG = {
	model: "google/gemini-embedding-001",
	dimensions: 3072,
} as const;

export type EmbeddingConfig = {
	model: string;
	dimensions: number;
};
