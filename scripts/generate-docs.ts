import { writeFileSync } from "node:fs";
import path from "node:path";
import { PLUGIN_LIST } from "../src/core/plugin-list";

generateResultGroupsMarkdown();
// generateThemesMarkdown();

function generateResultGroupsMarkdown() {
	const filePath = path.resolve(__dirname, "../docs/plugins.md");
	let markdown = "# Plugins\n";
	markdown += "Plugins can provide results, a theme and more.";

	markdown += "\n\n";
	markdown +=
		"| Name | Description | Prefix | Permissions | Supported browsers |\n";
	markdown +=
		"| ---- | ----------- | ----- | ------------|------------------- |\n";

	for (const plugin of PLUGIN_LIST) {
		markdown += `| ${plugin.name} | ${plugin.description} | ${plugin.prefix || ""} | ${plugin.permissions?.join(", ")} | ${plugin.supportedBrowsers?.join(", ")} |\n`;
	}

	writeFileSync(filePath, markdown);
}

// function generateThemesMarkdown() {
// 	const filePath = path.resolve(__dirname, "../docs/themes.md");
// 	let markdown = "# Themes";
// 	markdown += "\n\n";

// 	for (const theme of Themes) {
// 		markdown += `### ${theme}\n`;
// 		markdown += `![${theme}](../src/assets/themes/${theme}.png)\n`;
// 	}

// 	writeFileSync(filePath, markdown);
// }
