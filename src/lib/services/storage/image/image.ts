import { buildPublicUrl, supabase } from "../client";
import type {
	AddResponse,
	DeleteResponse,
	GetResponse,
	UpdateResponse,
} from "../types";

export const addImage = async (
	path: string,
	file: File | Blob,
): Promise<AddResponse> => {
	const { data, error } = await supabase.storage
		.from("images")
		.upload(path, file, { upsert: false });

	if (error) {
		throw new Error(`Failed to add image: ${error.message}`);
	}

	return {
		path: data.path,
		publicUrl: buildPublicUrl("images", data.path),
	};
};

export const getImage = (path: string): GetResponse => {
	return {
		publicUrl: buildPublicUrl("images", path),
	};
};

export const updateImage = async (
	path: string,
	file: File | Blob,
): Promise<UpdateResponse> => {
	const { data, error } = await supabase.storage
		.from("images")
		.upload(path, file, { upsert: true });

	if (error) {
		throw new Error(`Failed to update image: ${error.message}`);
	}

	return {
		path: data.path,
		publicUrl: buildPublicUrl("images", data.path),
	};
};

export const deleteImage = async (path: string): Promise<DeleteResponse> => {
	const { error } = await supabase.storage.from("images").remove([path]);

	if (error) {
		throw new Error(`Failed to delete image: ${error.message}`);
	}

	return { isDeleted: true };
};
