import { buildPublicUrl, supabase } from "../client";
import type {
	AddResponse,
	DeleteResponse,
	GetResponse,
	UpdateResponse,
} from "../types";

export const addFile = async (
	path: string,
	file: File | Blob,
): Promise<AddResponse> => {
	const { data, error } = await supabase.storage
		.from("files")
		.upload(path, file, { upsert: false });

	if (error) {
		throw new Error(`Failed to add file: ${error.message}`);
	}

	return {
		path: data.path,
		publicUrl: buildPublicUrl("files", data.path),
	};
};

export const getFile = (path: string): GetResponse => {
	return {
		publicUrl: buildPublicUrl("files", path),
	};
};

export const updateFile = async (
	path: string,
	file: File | Blob,
): Promise<UpdateResponse> => {
	const { data, error } = await supabase.storage
		.from("files")
		.upload(path, file, { upsert: true });

	if (error) {
		throw new Error(`Failed to update file: ${error.message}`);
	}

	return {
		path: data.path,
		publicUrl: buildPublicUrl("files", data.path),
	};
};

export const deleteFile = async (path: string): Promise<DeleteResponse> => {
	const { error } = await supabase.storage.from("files").remove([path]);

	if (error) {
		throw new Error(`Failed to delete file: ${error.message}`);
	}

	return { isDeleted: true };
};
