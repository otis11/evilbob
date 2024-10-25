import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { RESULT_GROUPS } from "../src/components/result-groups";
import { Themes } from "../src/theme/themes";

generateResultGroupsMarkdown();
generateThemesMarkdown();

function generateResultGroupsMarkdown() {
	const filePath = path.resolve(__dirname, "../docs/result-groups.md");
	let markdown = "# Result Groups\n";
	markdown +=
		"Result Groups provide results and actions inside the command palette.";

	markdown += "\n\n";
	markdown +=
		"| Name | Description | Prefix | Permissions | Supported browsers |\n";
	markdown +=
		"| ---- | ----------- | ----- | ------------|------------------- |\n";

	for (const group of RESULT_GROUPS) {
		markdown += `| ${group.nameHumanReadable} | ${group.description} | ${group.prefix || ""} | ${group.permissions.join(", ")} | ${group.supportedBrowser.join(", ")} |\n`;
	}

	writeFileSync(filePath, markdown);
}

function generateThemesMarkdown() {
	const filePath = path.resolve(__dirname, "../docs/themes.md");
	let markdown = "# Themes";
	markdown += "\n\n";

	for (const theme of Themes) {
		markdown += `### ${theme}\n`;
		markdown += `![${theme}](../src/assets/themes/${theme}.png)\n`;
	}

	writeFileSync(filePath, markdown);
}
