export const EMBEDDING_CONFIG = {
	model: "google/gemini-embedding-001",
	dimensions: 2000,
} as const;

export type EmbeddingConfig = {
	model: string;
	dimensions: number;
};
