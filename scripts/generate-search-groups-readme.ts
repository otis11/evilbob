import { writeFileSync } from "node:fs";
import path from "node:path";
import { SEARCH_GROUPS } from "../src/components/search-groups/config";

const filePath = path.resolve(__dirname, "../docs/search-groups.md");
let markdown = "# Search Groups";

markdown += "\n\n";
markdown += "| Name | Description | Supported browsers |\n";
markdown += "| ---- | ----------- | ------------------ |\n";

for (const group of SEARCH_GROUPS) {
	markdown += `| ${group.name} | ${group.description} | ${group.supportedBrowser.join(", ")} | \n`;
}

writeFileSync(filePath, markdown);
