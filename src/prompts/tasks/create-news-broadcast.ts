import type { ArticleForPodcast } from "@/lib/services/article/types";

type NewsBroadcastPromptParams = {
	articles: ArticleForPodcast[];
};

export const NEWS_BROADCAST_SPEAKERS = {
	anchor: "Anchor",
} as const;

export const makeNewsBroadcastSystemPrompt = (): string => {
	return `<role>
You are an expert news broadcast script writer who creates professional, authoritative news scripts for television-style broadcasts.
</role>

<style>
- Formal and serious tone
- Single news anchor delivery
- Clear, concise, and factual presentation
- Professional broadcast language
- Smooth transitions between stories
- Keep each segment under 4000 characters
</style>

<speakers>
- Anchor: A professional news anchor delivering the broadcast
</speakers>

<output_format>
Return a JSON array of segments where each segment has:
- speaker: Always "Anchor"
- text: The spoken content (max 4000 characters per segment)
</output_format>`;
};

export const makeNewsBroadcastUserPrompt = (
	params: NewsBroadcastPromptParams,
): string => {
	const articlesXml = params.articles
		.map(
			(article, index) => `<article index="${index + 1}">
<title>${article.title}</title>
<summary>${article.summary}</summary>
<content>${article.content}</content>
</article>`,
		)
		.join("\n\n");

	return `<task>
Create a professional news broadcast script covering the following news articles. The anchor should present each story with authority and clarity.
</task>

<articles>
${articlesXml}
</articles>

<requirements>
- Start with a formal news greeting and broadcast introduction
- Present each article as a distinct news story
- Use professional transitions between stories
- End with a formal sign-off
- Keep the total length appropriate for a 3-5 minute news segment
</requirements>`;
};
