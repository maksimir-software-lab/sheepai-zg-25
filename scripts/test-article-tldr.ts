import "dotenv/config";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles, users } from "@/db/schema";
import { services } from "@/lib/services";

const getLatestArticle = async () => {
	const [latestArticle] = await db
		.select({ id: articles.id, title: articles.title })
		.from(articles)
		.orderBy(desc(articles.createdAt))
		.limit(1);

	return latestArticle;
};

const getFirstUser = async () => {
	const [firstUser] = await db
		.select({ id: users.id, email: users.email })
		.from(users)
		.limit(1);

	return firstUser;
};

const parseArgs = (): { userId?: string } => {
	const args = process.argv.slice(2);
	const userIdArg = args.find((arg) => arg.startsWith("--user-id="));

	return {
		userId: userIdArg?.split("=").at(1),
	};
};

const main = async () => {
	const { userId: userIdArg } = parseArgs();

	console.log("=".repeat(60));
	console.log("Article TLDR Generation Test");
	console.log("=".repeat(60));
	console.log();

	console.log("Fetching latest article from database...");
	const article = await getLatestArticle();

	if (!article) {
		console.error("No articles found in database. Run 'bun ingest' first.");
		process.exit(1);
	}

	console.log(`Article: ${article.title}`);
	console.log(`ID: ${article.id}`);
	console.log();

	const userId = userIdArg ?? (await getFirstUser())?.id;

	if (userId) {
		console.log(`Using user ID: ${userId}`);
	} else {
		console.log("No user found - generating generic TLDR (no personalization)");
	}
	console.log();

	console.log("Generating TLDR...");
	const startTime = Date.now();

	const result = await services.articleTldr.getOrCreateTldr({
		articleId: article.id,
		userId,
	});

	const durationInMs = Date.now() - startTime;

	console.log();
	console.log("=".repeat(60));
	console.log("Result");
	console.log("=".repeat(60));
	console.log();
	console.log(`Duration: ${durationInMs}ms`);
	console.log(`Newly Generated: ${result.isNewlyGenerated}`);
	console.log();
	console.log("TLDR Summary:");
	console.log(result.tldr.tldr.summary);
	console.log();

	if (result.tldr.tldr.relevance) {
		console.log("Relevance:");
		console.log(result.tldr.tldr.relevance);
	} else {
		console.log("Relevance: (none - no user interests found)");
	}

	console.log();
	console.log("Full Record:");
	console.log(JSON.stringify(result, null, 2));
};

main().catch((error) => {
	console.error("TLDR generation failed:", error);
	process.exit(1);
});
