export type { PodcastConfig } from "./config";
export { PODCAST_CONFIG } from "./config";
export type { PodcastDeps } from "./deps";
export { createPodcastService } from "./service";
export type {
	AudioFormat,
	GeneratePodcastParams,
	GeneratePodcastResponse,
	IPodcastService,
	OpenAIVoice,
	ScriptSegment,
	TtsModel,
	VoiceMapping,
} from "./types";
export {
	audioFormatSchema,
	generatePodcastParamsSchema,
	generatePodcastResponseSchema,
	openAIVoiceSchema,
	scriptSegmentSchema,
	ttsModelSchema,
	voiceMappingSchema,
} from "./types";
