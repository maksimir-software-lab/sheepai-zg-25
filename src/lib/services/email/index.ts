export type { EmailConfig } from "./config";
export { EMAIL_CONFIG } from "./config";
export type { EmailDeps } from "./deps";
export type { IEmailService } from "./service";
export { createEmailService } from "./service";
export type {
	Attachment,
	EmailAttachment,
	EmailRecipient,
	InfobipDestination,
	InfobipMessage,
	InfobipRequestBody,
	InfobipResponse,
	SendEmailRequest,
} from "./types";
export {
	attachmentSchema,
	emailAttachmentSchema,
	emailRecipientSchema,
	infobipDestinationSchema,
	infobipMessageSchema,
	infobipRequestBodySchema,
	infobipResponseSchema,
	sendEmailRequestSchema,
} from "./types";
