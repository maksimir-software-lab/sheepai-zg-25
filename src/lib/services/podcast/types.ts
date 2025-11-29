import { z } from "zod";

export const openAIVoiceSchema = z.enum([
	"alloy",
	"ash",
	"ballad",
	"coral",
	"echo",
	"fable",
	"onyx",
	"nova",
	"sage",
	"shimmer",
	"verse",
]);

export const ttsModelSchema = z.enum(["tts-1", "tts-1-hd", "gpt-4o-mini-tts"]);

export const audioFormatSchema = z.enum([
	"mp3",
	"opus",
	"aac",
	"flac",
	"wav",
	"pcm",
]);

export const scriptSegmentSchema = z.object({
	speaker: z.string(),
	text: z.string().max(4096),
});

export const voiceMappingSchema = z.record(z.string(), openAIVoiceSchema);

export const generatePodcastParamsSchema = z.object({
	segments: z.array(scriptSegmentSchema).min(1),
	voiceMapping: voiceMappingSchema,
	outputFormat: audioFormatSchema.optional(),
	speed: z.number().min(0.25).max(4.0).optional(),
	model: ttsModelSchema.optional(),
});

export const generatePodcastResponseSchema = z.object({
	publicUrl: z.string(),
	path: z.string(),
});

export type OpenAIVoice = z.infer<typeof openAIVoiceSchema>;
export type TtsModel = z.infer<typeof ttsModelSchema>;
export type AudioFormat = z.infer<typeof audioFormatSchema>;
export type ScriptSegment = z.infer<typeof scriptSegmentSchema>;
export type VoiceMapping = z.infer<typeof voiceMappingSchema>;
export type GeneratePodcastParams = z.infer<typeof generatePodcastParamsSchema>;
export type GeneratePodcastResponse = z.infer<
	typeof generatePodcastResponseSchema
>;
