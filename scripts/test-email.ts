import { services } from "@/lib/services";

const testEmail = async () => {
	try {
		console.log("📧 Sending test email to nikita.leon.wagner@gmail.com...");

		const result = await services.email.send({
			sender: {
				email: "nikita.leon.wagner@selfserve.worlds-connected.co",
			},
			recipients: [
				{
					email: "nikita.leon.wagner@gmail.com",
					name: "Nikita Wagner",
				},
			],
			subject: "Test Email from SheepAI",
			textContent:
				"This is a test email sent from the SheepAI email service. If you receive this, the email service is working correctly!",
			htmlContent:
				"<p>This is a test email sent from the SheepAI email service.</p><p>If you receive this, the email service is working correctly!</p>",
		});

		console.log("✅ Email sent successfully!");
		console.log("Response:", JSON.stringify(result, null, 2));
	} catch (error) {
		console.error("❌ Failed to send email:", error);
		process.exit(1);
	}
};

testEmail();
