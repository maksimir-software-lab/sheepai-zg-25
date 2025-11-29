import type { PodcastDeps } from "./deps";
import {
	concatenateAudioBuffers,
	generateSegmentAudio,
	generateUniqueFilename,
} from "./internal";
import {
	type AudioFormat,
	type GeneratePodcastParams,
	type GeneratePodcastResponse,
	generatePodcastParamsSchema,
	type IPodcastService,
	type TtsModel,
} from "./types";

export const createPodcastService = (deps: PodcastDeps): IPodcastService => {
	const { openai, storageService, config } = deps;

	const generate = async (
		params: GeneratePodcastParams,
	): Promise<GeneratePodcastResponse> => {
		const validatedParams = generatePodcastParamsSchema.parse(params);

		const model = validatedParams.model ?? config.defaultModel;
		const format: AudioFormat =
			validatedParams.outputFormat ?? (config.defaultFormat as AudioFormat);
		const speed = validatedParams.speed ?? config.defaultSpeed;

		const audioPromises = validatedParams.segments.map((segment, index) => {
			const voice = validatedParams.voiceMapping[segment.speaker];
			if (!voice) {
				throw new Error(
					`No voice mapping found for speaker: ${segment.speaker}`,
				);
			}

			return generateSegmentAudio(
				openai,
				segment.text,
				voice,
				model as TtsModel,
				format,
				speed,
				index,
			);
		});

		const indexedBuffers = await Promise.all(audioPromises);

		const concatenatedBuffer = await concatenateAudioBuffers(
			indexedBuffers,
			format,
		);

		const filename = generateUniqueFilename(format);

		const audioBlob = new Blob([new Uint8Array(concatenatedBuffer)], {
			type: `audio/${format}`,
		});

		const uploadResult = await storageService.audio.add(filename, audioBlob);

		return {
			publicUrl: uploadResult.publicUrl,
			path: uploadResult.path,
		};
	};

	return {
		generate,
	};
};
