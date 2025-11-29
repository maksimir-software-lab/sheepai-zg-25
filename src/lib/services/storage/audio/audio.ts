import { buildPublicUrl, supabase } from "../client";
import type {
	AddResponse,
	DeleteResponse,
	GetResponse,
	UpdateResponse,
} from "../types";

export const addAudio = async (
	path: string,
	file: File | Blob,
): Promise<AddResponse> => {
	const { data, error } = await supabase.storage
		.from("audio")
		.upload(path, file, { upsert: false });

	if (error) {
		throw new Error(`Failed to add audio: ${error.message}`);
	}

	return {
		path: data.path,
		publicUrl: buildPublicUrl("audio", data.path),
	};
};

export const getAudio = (path: string): GetResponse => {
	return {
		publicUrl: buildPublicUrl("audio", path),
	};
};

export const updateAudio = async (
	path: string,
	file: File | Blob,
): Promise<UpdateResponse> => {
	const { data, error } = await supabase.storage
		.from("audio")
		.upload(path, file, { upsert: true });

	if (error) {
		throw new Error(`Failed to update audio: ${error.message}`);
	}

	return {
		path: data.path,
		publicUrl: buildPublicUrl("audio", data.path),
	};
};

export const deleteAudio = async (path: string): Promise<DeleteResponse> => {
	const { error } = await supabase.storage.from("audio").remove([path]);

	if (error) {
		throw new Error(`Failed to delete audio: ${error.message}`);
	}

	return { isDeleted: true };
};
