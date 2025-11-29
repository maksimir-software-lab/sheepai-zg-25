import { createClient } from "@supabase/supabase-js";
import type { StorageBucket } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
	throw new Error(
		"NEXT_PUBLIC_SUPABASE_URL environment variable is not defined",
	);
}

if (!supabaseAnonKey) {
	throw new Error(
		"NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not defined",
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const buildPublicUrl = (bucket: StorageBucket, path: string): string => {
	const { data } = supabase.storage.from(bucket).getPublicUrl(path);

	return data.publicUrl;
};
