import type OpenAI from "openai";
import { z } from "zod";
import {
	makeNewsBroadcastSystemPrompt,
	makeNewsBroadcastUserPrompt,
	makePodcastSystemPrompt,
	makePodcastUserPrompt,
	NEWS_BROADCAST_SPEAKERS,
	PODCAST_SPEAKERS,
} from "@/prompts/tasks";
import type { ArticleForPodcast } from "../article/types";
import type { ILlmService } from "../llm/service";
import type {
	AudioFormat,
	OpenAIVoice,
	PodcastFormat,
	ScriptSegment,
	TtsModel,
	VoiceMapping,
} from "./types";
import { scriptSegmentSchema } from "./types";

export type IndexedAudioBuffer = {
	index: number;
	buffer: Buffer;
};

export const generateSegmentAudio = async (
	openai: OpenAI,
	text: string,
	voice: OpenAIVoice,
	model: TtsModel,
	format: AudioFormat,
	speed: number,
	index: number,
): Promise<IndexedAudioBuffer> => {
	const response = await openai.audio.speech.create({
		model,
		voice,
		input: text,
		response_format: format,
		speed,
	});

	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	return {
		index,
		buffer,
	};
};

const WAV_HEADER_SIZE_IN_BYTES = 44;

const updateWavHeader = (header: Buffer, totalDataSize: number): Buffer => {
	const updatedHeader = Buffer.from(header);
	updatedHeader.writeUInt32LE(totalDataSize + 36, 4);
	updatedHeader.writeUInt32LE(totalDataSize, 40);

	return updatedHeader;
};

export const concatenateAudioBuffers = async (
	indexedBuffers: IndexedAudioBuffer[],
	_format: AudioFormat,
): Promise<Buffer> => {
	const sortedBuffers = indexedBuffers.sort(
		(bufferA, bufferB) => bufferA.index - bufferB.index,
	);

	const firstBuffer = sortedBuffers.at(0);

	if (!firstBuffer) {
		throw new Error("No audio buffers to concatenate");
	}

	const header = firstBuffer.buffer.subarray(0, WAV_HEADER_SIZE_IN_BYTES);

	const audioDataBuffers = sortedBuffers.map((indexedBuffer) =>
		indexedBuffer.buffer.subarray(WAV_HEADER_SIZE_IN_BYTES),
	);

	const totalDataSize = audioDataBuffers.reduce(
		(sum, audioBuffer) => sum + audioBuffer.length,
		0,
	);

	const updatedHeader = updateWavHeader(header, totalDataSize);

	return Buffer.concat([updatedHeader, ...audioDataBuffers]);
};

export const generateUniqueFilename = (format: AudioFormat): string => {
	const timestamp = Date.now();
	const random = crypto.randomUUID();

	return `podcast_${timestamp}_${random}.${format}`;
};

const scriptResponseSchema = z.object({
	segments: z.array(scriptSegmentSchema),
});

export const generateScriptFromArticles = async (
	llmService: ILlmService,
	articlesData: ArticleForPodcast[],
	format: PodcastFormat,
): Promise<ScriptSegment[]> => {
	const systemPrompt =
		format === "podcast"
			? makePodcastSystemPrompt()
			: makeNewsBroadcastSystemPrompt();

	const userPrompt =
		format === "podcast"
			? makePodcastUserPrompt({ articles: articlesData })
			: makeNewsBroadcastUserPrompt({ articles: articlesData });

	const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

	const response = await llmService.generateObject({
		prompt: fullPrompt,
		schema: scriptResponseSchema,
	});

	return response.segments;
};

export const getVoiceMappingForFormat = (
	format: PodcastFormat,
): VoiceMapping => {
	if (format === "podcast") {
		return {
			[PODCAST_SPEAKERS.hostA]: "nova",
			[PODCAST_SPEAKERS.hostB]: "onyx",
		};
	}

	return {
		[NEWS_BROADCAST_SPEAKERS.anchor]: "onyx",
	};
};
