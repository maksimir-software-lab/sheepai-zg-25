type BinaryAttachment = {
	type: "binary";
	content: string;
	contentType: string;
	fileName: string;
};

type UploadedReferenceAttachment = {
	type: "uploadedReference";
	contentId: string;
};

export type Attachment = BinaryAttachment | UploadedReferenceAttachment;

export type EmailRecipient = {
	email: string;
	name?: string;
};

export type EmailAttachment = {
	buffer: Buffer;
	contentType: string;
	fileName: string;
};

export type SendEmailRequest = {
	sender: EmailRecipient;
	recipients: EmailRecipient[];
	subject: string;
	textContent?: string;
	htmlContent?: string;
	attachments?: EmailAttachment[];
};

export type InfobipDestination = {
	to: { destination: string; name?: string }[];
};

export type InfobipMessage = {
	sender: string;
	senderName?: string;
	destinations: InfobipDestination[];
	content: {
		subject: string;
		text?: string;
		html?: string;
		attachments?: Attachment[];
	};
};

export type InfobipRequestBody = {
	messages: InfobipMessage[];
};

export type InfobipResponse = {
	messages: {
		messageId: string;
		to: string;
		status: {
			groupId: number;
			groupName: string;
			id: number;
			name: string;
			description: string;
		};
	}[];
};
