export type NewsletterConfig = {
	articlesPerNewsletterLimit: number;
	senderEmail: string;
	senderName: string;
};

export const NEWSLETTER_CONFIG: NewsletterConfig = {
	articlesPerNewsletterLimit: 5,
	senderEmail: "nikita.leon.wagner@selfserve.worlds-connected.co",
	senderName: "AggNews Newsletter",
};
