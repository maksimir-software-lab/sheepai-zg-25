import type { EmailDeps } from "./deps";
import { buildInfobipRequestBody } from "./internal";
import type { InfobipResponse, SendEmailRequest } from "./types";

export type IEmailService = {
	send: (request: SendEmailRequest) => Promise<InfobipResponse>;
};

export const createEmailService = (deps: EmailDeps): IEmailService => {
	const { config } = deps;

	const send = async (request: SendEmailRequest): Promise<InfobipResponse> => {
		const requestBody = buildInfobipRequestBody(request);

		const response = await fetch(`${config.baseUrl}${config.apiPath}`, {
			method: "POST",
			headers: {
				Authorization: `App ${config.apiKey}`,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Failed to send email: ${response.status} ${response.statusText} - ${errorText}`,
			);
		}

		const responseData = (await response.json()) as InfobipResponse;

		return responseData;
	};

	return {
		send,
	};
};
