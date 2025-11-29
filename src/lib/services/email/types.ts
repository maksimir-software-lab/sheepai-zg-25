import { z } from "zod";

const binaryAttachmentSchema = z.object({
	type: z.literal("binary"),
	content: z.string(),
	contentType: z.string(),
	fileName: z.string(),
});

const uploadedReferenceAttachmentSchema = z.object({
	type: z.literal("uploadedReference"),
	contentId: z.string(),
});

export const attachmentSchema = z.discriminatedUnion("type", [
	binaryAttachmentSchema,
	uploadedReferenceAttachmentSchema,
]);

export const emailRecipientSchema = z.object({
	email: z.string(),
	name: z.string().optional(),
});

export const emailAttachmentSchema = z.object({
	buffer: z.instanceof(Buffer),
	contentType: z.string(),
	fileName: z.string(),
});

export const sendEmailRequestSchema = z.object({
	sender: emailRecipientSchema,
	recipients: z.array(emailRecipientSchema),
	subject: z.string(),
	textContent: z.string().optional(),
	htmlContent: z.string().optional(),
	attachments: z.array(emailAttachmentSchema).optional(),
});

export const infobipDestinationSchema = z.object({
	to: z.array(
		z.object({
			destination: z.string(),
			name: z.string().optional(),
		}),
	),
});

export const infobipMessageSchema = z.object({
	sender: z.string(),
	senderName: z.string().optional(),
	destinations: z.array(infobipDestinationSchema),
	content: z.object({
		subject: z.string(),
		text: z.string().optional(),
		html: z.string().optional(),
		attachments: z.array(attachmentSchema).optional(),
	}),
});

export const infobipRequestBodySchema = z.object({
	messages: z.array(infobipMessageSchema),
});

export const infobipResponseSchema = z.object({
	messages: z.array(
		z.object({
			messageId: z.string(),
			to: z.string(),
			status: z.object({
				groupId: z.number(),
				groupName: z.string(),
				id: z.number(),
				name: z.string(),
				description: z.string(),
			}),
		}),
	),
});

export type Attachment = z.infer<typeof attachmentSchema>;
export type EmailRecipient = z.infer<typeof emailRecipientSchema>;
export type EmailAttachment = z.infer<typeof emailAttachmentSchema>;
export type SendEmailRequest = z.infer<typeof sendEmailRequestSchema>;
export type InfobipDestination = z.infer<typeof infobipDestinationSchema>;
export type InfobipMessage = z.infer<typeof infobipMessageSchema>;
export type InfobipRequestBody = z.infer<typeof infobipRequestBodySchema>;
export type InfobipResponse = z.infer<typeof infobipResponseSchema>;
