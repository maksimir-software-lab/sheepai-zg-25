export const EMAIL_CONFIG = {
	apiPath: "/email/4/messages",
} as const;

export type EmailConfig = {
	apiKey: string;
	baseUrl: string;
	apiPath: string;
};
