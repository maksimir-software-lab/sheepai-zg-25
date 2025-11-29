export type IEmbeddingService = {
	generate: (text: string) => Promise<number[]>;
	generateBatch: (texts: string[]) => Promise<number[][]>;
};
