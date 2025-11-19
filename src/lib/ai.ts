import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

if (!process.env.OPENROUTER_API_KEY) {
	throw new Error("OPENROUTER_API_KEY environment variable is not defined");
}

const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
});

export const generateResponse = async (prompt: string): Promise<string> => {
	const response = await generateText({
		model: openrouter("openai/gpt-5.1-chat"),
		prompt,
	});

	return response.text;
};
