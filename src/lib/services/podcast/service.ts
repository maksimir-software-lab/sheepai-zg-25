import type { PodcastDeps } from "./deps";
import {
	concatenateAudioBuffers,
	generateScriptFromArticles,
	generateSegmentAudio,
	generateUniqueFilename,
	getVoiceMappingForFormat,
} from "./internal";
import {
	type AudioFormat,
	type GenerateFromArticlesParams,
	type GeneratePodcastParams,
	type GeneratePodcastResponse,
	generateFromArticlesParamsSchema,
	generatePodcastParamsSchema,
	type TtsModel,
} from "./types";

export type IPodcastService = {
	generate: (params: GeneratePodcastParams) => Promise<GeneratePodcastResponse>;
};

export const createPodcastService = (deps: PodcastDeps): IPodcastService => {
	const { openai, storageService, llmService, articleService, config } = deps;

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

	const generateFromArticles = async (
		params: GenerateFromArticlesParams,
	): Promise<GeneratePodcastResponse> => {
		const validatedParams = generateFromArticlesParamsSchema.parse(params);

		const articlesData = await articleService.getForPodcast(
			validatedParams.articleIds,
		);

		if (articlesData.length === 0) {
			throw new Error("No articles found for the provided IDs");
		}

		const segments = await generateScriptFromArticles(
			llmService,
			articlesData,
			validatedParams.format,
		);

		const voiceMapping = getVoiceMappingForFormat(validatedParams.format);

		return generate({
			segments,
			voiceMapping,
			outputFormat: validatedParams.outputFormat,
			speed: validatedParams.speed,
			model: validatedParams.model,
		});
	};

	return {
		generate,
		generateFromArticles,
	};
};
