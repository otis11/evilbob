import { writeFileSync } from "node:fs";
import path from "node:path";
import { SEARCH_GROUPS } from "../src/components/search-groups/config";

const filePath = path.resolve(__dirname, "../docs/search-groups.md");
let markdown = "# Search Groups\n";
markdown +=
	"Search Groups provide results and actions inside the command palette.";

markdown += "\n\n";
markdown += "| Name | Description | Permissions | Supported browsers |\n";
markdown += "| ---- | ----------- | ------------|------------------ |\n";

for (const group of SEARCH_GROUPS) {
	markdown += `| ${group.name} | ${group.description} | ${group.permissions.join(", ")} | ${group.supportedBrowser.join(", ")} | \n`;
}

writeFileSync(filePath, markdown);
