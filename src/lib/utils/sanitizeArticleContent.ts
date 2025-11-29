export const sanitizeArticleContent = (content: string): string => {
	let sanitized = content;

	sanitized = sanitized.replace(
		/<div\s+class=["']dog_two\s+clear["'][^>]*>[\s\S]*?<\/div>/gi,
		"<p></p>",
	);

	return sanitized;
};
