import type {
	Attachment,
	EmailAttachment,
	EmailRecipient,
	InfobipDestination,
	InfobipMessage,
	InfobipRequestBody,
	InfobipResponse,
	SendEmailRequest,
} from "./types";

const infobipApiKey = process.env.INFOBIP_API_KEY;
const infobipBaseUrl = process.env.INFOBIP_BASE_URL;

if (!infobipApiKey) {
	throw new Error("INFOBIP_API_KEY environment variable is not defined");
}

if (!infobipBaseUrl) {
	throw new Error("INFOBIP_BASE_URL environment variable is not defined");
}

const bufferToBase64 = (buffer: Buffer): string => {
	return buffer.toString("base64");
};

const mapAttachmentToInfobipFormat = (
	attachment: EmailAttachment,
): Attachment => ({
	type: "binary",
	content: bufferToBase64(attachment.buffer),
	contentType: attachment.contentType,
	fileName: attachment.fileName,
});

const mapRecipientToInfobipFormat = (
	recipient: EmailRecipient,
): { destination: string; name?: string } => ({
	destination: recipient.email,
	...(recipient.name && { name: recipient.name }),
});

const buildInfobipRequestBody = (
	request: SendEmailRequest,
): InfobipRequestBody => {
	const attachments = request.attachments?.map((attachment) =>
		mapAttachmentToInfobipFormat(attachment),
	);

	const destinations: InfobipDestination[] = [
		{
			to: request.recipients.map((recipient) =>
				mapRecipientToInfobipFormat(recipient),
			),
		},
	];

	const message: InfobipMessage = {
		sender: request.sender.email,
		...(request.sender.name && { senderName: request.sender.name }),
		destinations,
		content: {
			subject: request.subject,
			...(request.textContent && { text: request.textContent }),
			...(request.htmlContent && { html: request.htmlContent }),
			...(attachments && attachments.length > 0 && { attachments }),
		},
	};

	return { messages: [message] };
};

export const sendEmail = async (
	request: SendEmailRequest,
): Promise<InfobipResponse> => {
	const requestBody = buildInfobipRequestBody(request);

	const response = await fetch(`${infobipBaseUrl}/email/4/messages`, {
		method: "POST",
		headers: {
			Authorization: `App ${infobipApiKey}`,
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
