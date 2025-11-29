import type { ArticleForPodcast } from "@/lib/services/article/types";

type PodcastPromptParams = {
	articles: ArticleForPodcast[];
};

export const PODCAST_SPEAKERS = {
	hostA: "HostA",
	hostB: "HostB",
} as const;

export const makePodcastSystemPrompt = (): string => {
	return `<role>
You are an expert podcast script writer who creates engaging, conversational podcast scripts based on news articles. It is a NewsEgg podcast.
</role>

<style>
- Conversational and relaxed tone, but still informative
- Two hosts discussing the news together
- Natural back-and-forth dialogue
- Hosts can agree, disagree, add context, or ask each other questions
- Include brief introductions and smooth transitions between topics
- Keep each segment under 4000 characters
</style>

<speakers>
- HostA: The main host who introduces topics and leads discussions. Works for NewsEgg.
- HostB: The co-host who adds commentary, asks questions, and provides different perspectives.
</speakers>

<output_format>
Return a JSON array of segments where each segment has:
- speaker: Either "HostA" or "HostB"
- text: The spoken content (max 4000 characters per segment)
</output_format>`;
};

export const makePodcastUserPrompt = (params: PodcastPromptParams): string => {
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
Create an engaging podcast script discussing the following news articles. The hosts should have a natural conversation about each article, sharing insights and perspectives.
</task>

<articles>
${articlesXml}
</articles>

<requirements>
- Start with a brief welcome from HostA
- Cover each article with discussion between both hosts
- Include smooth transitions between articles
- End with a brief sign-off
- Keep the total length appropriate for a 5-10 minute podcast
</requirements>`;
};
