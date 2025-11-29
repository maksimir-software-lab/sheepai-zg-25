import type {
	Attachment,
	EmailAttachment,
	EmailRecipient,
	InfobipDestination,
	InfobipMessage,
	InfobipRequestBody,
	SendEmailRequest,
} from "./types";

export const bufferToBase64 = (buffer: Buffer): string => {
	return buffer.toString("base64");
};

export const mapAttachmentToInfobipFormat = (
	attachment: EmailAttachment,
): Attachment => ({
	type: "binary",
	content: bufferToBase64(attachment.buffer),
	contentType: attachment.contentType,
	fileName: attachment.fileName,
});

export const mapRecipientToInfobipFormat = (
	recipient: EmailRecipient,
): { destination: string; name?: string } => ({
	destination: recipient.email,
	...(recipient.name && { name: recipient.name }),
});

export const buildInfobipRequestBody = (
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
