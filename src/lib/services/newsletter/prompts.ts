export const overallTldrPrompt = `You are a news summarizer. Given the following article summaries from a personalized newsletter, create a concise TLDR (2-3 sentences) that captures the most important takeaways across all articles.

Articles:
{{articleSummaries}}

Respond with only the TLDR text, no additional formatting.`;

export const detailedSummaryPrompt = `You are a news analyst. Given the following articles from a personalized newsletter, create a detailed summary (3-5 paragraphs) that covers the most important developments and their significance.

Articles:
{{articleDetails}}

Respond with only the summary text, no additional formatting.`;
