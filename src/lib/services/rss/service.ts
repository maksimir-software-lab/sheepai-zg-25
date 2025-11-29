import type { RssDeps } from "./deps";
import type { IRssService, RawFeedItem } from "./types";

export const createRssService = (deps: RssDeps): IRssService => {
	const { config } = deps;

	const parseXml = (xmlText: string): RawFeedItem[] => {
		const items: RawFeedItem[] = [];

		const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g);
		if (!itemMatches) {
			return items;
		}

		for (const itemXml of itemMatches) {
			const title = extractTagContent(itemXml, "title");
			const description = extractTagContent(itemXml, "description");
			const link = extractTagContent(itemXml, "link");
			const pubDateStr = extractTagContent(itemXml, "pubDate");

			if (title && link) {
				items.push({
					title: decodeHtmlEntities(title),
					description: decodeHtmlEntities(description ?? ""),
					link,
					pubDate: pubDateStr ? new Date(pubDateStr) : null,
				});
			}
		}

		return items;
	};

	const extractTagContent = (xml: string, tagName: string): string | null => {
		const cdataMatch = xml.match(
			new RegExp(`<${tagName}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tagName}>`),
		);
		if (cdataMatch) {
			return cdataMatch[1];
		}

		const simpleMatch = xml.match(
			new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`),
		);
		return simpleMatch ? simpleMatch[1] : null;
	};

	const decodeHtmlEntities = (text: string): string => {
		return text
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&amp;/g, "&")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&apos;/g, "'")
			.replace(/<[^>]*>/g, "");
	};

	const fetchFeed = async (): Promise<RawFeedItem[]> => {
		const response = await fetch(config.feedUrl);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch RSS feed: ${response.status} ${response.statusText}`,
			);
		}

		const xmlText = await response.text();
		return parseXml(xmlText);
	};

	return {
		fetchFeed,
	};
};
