import dedent from "dedent";

export const genericTldrPrompt = dedent`
	You are a professional tech news analyst. Create a concise TLDR summary for the following article.

	Title: {{title}}

	Content:
	{{content}}

	Provide a 2-3 sentence TLDR that captures the essential information.
`;

export const personalizedTldrPrompt = dedent`
	You are a professional tech news analyst. Create a concise TLDR summary for the following article,
	and explain why it might be relevant to a reader with the specified interests.

	Title: {{title}}

	Content:
	{{content}}

	Reader's interests: {{userInterests}}

	Provide:
	1. A 2-3 sentence TLDR that captures the essential information
	2. A brief explanation of why this article is relevant to someone interested in the topics above seperated by a newline
`;
