import { resolve } from "node:path";
import { exit } from "node:process";
import packageJson from "../package.json";
import chromeManifest from "../public/chrome/manifest.json";
import firefoxManifest from "../public/firefox/manifest.json";

const versionTypes = ["major", "minor", "patch"] as const;
type VersionType = (typeof versionTypes)[number];
const versionType = Bun.argv[2] as VersionType;

if (!versionTypes.includes(versionType)) {
	console.log("Invalid versionType given: ", versionType);
	exit(0);
}

const newVersion = bumpVersion(packageJson.version, versionType);

function bumpVersion(currentVersion: string, type: VersionType) {
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
	resolve(__dirname, "../public/chrome/manifest.json"),
	JSON.stringify(chromeManifest, null, 4),
);
await Bun.write(
	resolve(__dirname, "../public/firefox/manifest.json"),
	JSON.stringify(firefoxManifest, null, 4),
);
