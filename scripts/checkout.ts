import { $ } from "bun";

const gitBranch = Bun.argv[2];
const neonBranch = Bun.argv[2];

if (!gitBranch) {
	console.error("❌ Error: Please provide a branch name.");
	console.error("Usage: bun run checkout <git-branch> [neon-branch]");
	process.exit(1);
}

try {
	console.log(`Checking out Git branch: ${gitBranch}`);
	await $`git checkout -b ${gitBranch}`;

	console.log(`Creating Neon branch: ${neonBranch}`);
	const branchOutput =
		await $`bun neonctl branches create --name ${neonBranch} --output json`.quiet();
	const branch = await branchOutput.json();
	const dbUrl = branch.connection_uris[0].connection_uri;

	const envFile = Bun.file(".env");
	let envContent = "";

	if (await envFile.exists()) {
		const text = await envFile.text();
		envContent = text.replace(/^DATABASE_URL=.*(\r\n|\n|\r)?/gm, "");
		envContent = envContent.trim();
	}

	const newContent = `${envContent}\nDATABASE_URL="${dbUrl}"\n`;
	await Bun.write(".env", newContent);

	console.log(`✅ .env updated with new database URL.`);
} catch (err) {
	console.error("❌ Failed:", err);
	process.exit(1);
}
