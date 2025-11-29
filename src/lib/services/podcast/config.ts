export const PODCAST_CONFIG = {
	defaultModel: "tts-1",
	defaultFormat: "wav",
	defaultSpeed: 1.0,
	maxTextLength: 4_096,
} as const;

export type PodcastConfig = {
	defaultModel: string;
	defaultFormat: string;
	defaultSpeed: number;
	maxTextLength: number;
};
