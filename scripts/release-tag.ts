import { resolve } from "node:path";
import { $ } from "bun";
import packageJson from "../package.json";
import chromeManifest from "../src/manifest-chrome.json";
import firefoxManifest from "../src/manifest-firefox.json";

// check for uncommitted changes
const status = await $`git status --porcelain`.quiet();
if (status.text()) {
	console.error("There are uncommitted changes!");
	process.exit(1);
}

// check for correct branch
const branch = await $`git rev-parse --abbrev-ref HEAD`.quiet();
if (branch.text().trim() !== "main") {
	console.error('Tags are only meant to be created on the "main" branch!');
	process.exit(1);
}

const versionTypes = ["major", "minor", "patch"];
const versionType = Bun.argv[2];

if (!versionTypes.includes(versionType)) {
	console.error("Invalid version given: ", versionType);
	console.log("Available: major, minor, patch");
	process.exit(1);
}

const newVersion = bumpVersion(packageJson.version, versionType);

function bumpVersion(currentVersion: string, type: string) {
	const versionParts = currentVersion
		.split(".")
		.map((v) => Number.parseInt(v));
	if (type === "major") {
		versionParts[0]++;
		versionParts[1] = 0;
		versionParts[2] = 0;
	}
	if (type === "minor") {
		versionParts[1]++;
		versionParts[2] = 0;
	}
	if (type === "patch") {
		versionParts[2]++;
	}
	return versionParts.join(".");
}

packageJson.version = newVersion;
firefoxManifest.version = newVersion;
chromeManifest.version = newVersion;
await Bun.write(
	resolve(__dirname, "../package.json"),
	JSON.stringify(packageJson, null, 4),
);
await Bun.write(
	resolve(__dirname, "../src/manifest-chrome.json"),
	JSON.stringify(chromeManifest, null, 4),
);
await Bun.write(
	resolve(__dirname, "../src/manifest-firefox.json"),
	JSON.stringify(firefoxManifest, null, 4),
);

await $`bun run lint`;

await $`git add .`;
await $`git commit -m v${newVersion}`;
await $`git tag v${newVersion}`;
await $`git push`;
await $`git push origin v${newVersion}`;

console.log(`\nDone. Version v${newVersion} pushed.`);
