export const LLM_CONFIG = {
	defaultModel: "openai/gpt-4.1",
	defaultTemperature: 0.2,
} as const;

export type LlmConfig = {
	defaultModel: string;
	defaultTemperature?: number;
};
