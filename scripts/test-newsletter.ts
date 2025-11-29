import "dotenv/config";
import { services } from "@/lib/services";

const TEST_USER_ID = "user_35UhVbmzWDoqEEWFuiDNwfF8V4a";

const main = async () => {
	console.log("=".repeat(60));
	console.log("Newsletter Generation Test");
	console.log("=".repeat(60));
	console.log();
	console.log(`User ID: ${TEST_USER_ID}`);
	console.log();

	console.log("Generating newsletter...");
	console.log("  - Fetching personalized articles");
	console.log("  - Filtering already sent articles");
	console.log("  - Generating overall TLDR");
	console.log("  - Generating detailed summary");
	console.log("  - Creating podcast");
	console.log("  - Sending email");
	console.log();

	const startTime = Date.now();

	const result = await services.newsletter.sendNewsletter({
		userId: TEST_USER_ID,
		userEmail: "nikita.leon.wagner@gmail.com",
		userName: "Nikita Wagner",
	});

	const durationInSeconds = (Date.now() - startTime) / 1_000;

	console.log("=".repeat(60));
	console.log("Newsletter Sent!");
	console.log("=".repeat(60));
	console.log();
	console.log(`Duration: ${durationInSeconds.toFixed(2)}s`);
	console.log(`Success: ${result.success}`);
	console.log(`Articles sent: ${result.articlesSent}`);

	if (result.messageId) {
		console.log(`Message ID: ${result.messageId}`);
	}
};

main().catch((error) => {
	console.error("Newsletter generation failed:", error);
	process.exit(1);
});
