import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import type OpenAI from "openai";
import type {
	AudioFormat,
	OpenAIVoice,
	TtsModel,
} from "./types";

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

export const concatenateAudioBuffers = async (
	indexedBuffers: IndexedAudioBuffer[],
	format: AudioFormat,
): Promise<Buffer> => {
	const sortedBuffers = indexedBuffers.sort((a, b) => a.index - b.index);

	const ffmpeg = new FFmpeg();
	const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

	await ffmpeg.load({
		coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
		wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
	});

	const inputFiles: string[] = [];
	for (let i = 0; i < sortedBuffers.length; i++) {
		const filename = `input_${i}.${format}`;
		await ffmpeg.writeFile(filename, sortedBuffers[i].buffer);
		inputFiles.push(filename);
	}

	const concatList = inputFiles.map((file) => `file '${file}'`).join("\n");
	await ffmpeg.writeFile("concat.txt", concatList);

	const outputFile = `output.${format}`;
	const args = [
		"-f",
		"concat",
		"-safe",
		"0",
		"-i",
		"concat.txt",
		"-c",
		"copy",
		outputFile,
	];

	await ffmpeg.exec(args);

	const outputData = await ffmpeg.readFile(outputFile);
	const outputBuffer = Buffer.from(outputData);

	for (const file of [...inputFiles, "concat.txt", outputFile]) {
		try {
			await ffmpeg.deleteFile(file);
		} catch {
		}
	}

	return outputBuffer;
};

export const generateUniqueFilename = (format: AudioFormat): string => {
	const timestamp = Date.now();
	const random = crypto.randomUUID();
	return `podcast_${timestamp}_${random}.${format}`;
};

