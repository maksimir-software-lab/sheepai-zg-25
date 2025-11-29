import dedent from "dedent";

export const articleSummaryPrompt = dedent`
	You are a professional tech news analyst. Analyze the following article and provide a structured summary.

	Title: {{title}}

	Content:
	{{content}}

	Provide:
	1. A concise 2-3 sentence TL;DR summary
	2. 3-5 key facts as bullet points
	3. Relevant tags for categorization (e.g., security, malware, AI, cloud, research, vulnerability, data-breach, privacy, tools)
`;
