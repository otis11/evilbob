import { iconFromString, iconScript } from "../../icons";
import { getLastActiveTab } from "../../util/last-active-tab";
import type { Search } from "../search";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";

export class SearchGroupUserScripts extends SearchGroup {
	constructor() {
		super({
			name: "user-scripts",
			permissions: ["tabs", "scripting"],
			hostPermissions: ["https://*/*"],
			description: "Execute custom scripts.",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		return [
			new SearchResultUserScript({
				title: "List Media",
				description: "",
				fileName: "list-media.js",
			}),
		];
	}
}

type SearchResultUserScriptConfig = {
	title: string;
	description: string;
	fileName: string;
};

export class SearchResultUserScript extends SearchResult {
	public fileName: string;

	constructor(config: SearchResultUserScriptConfig) {
		super({
			title: config.title,
			searchText: "list media",
			description: config.description,
			prepend: iconFromString(iconScript),
		});

		this.fileName = config.fileName;
	}

	async onSelect(): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			chrome.scripting.executeScript({
				target: { tabId: lastActive?.id },
				files: [`user-scripts/${this.fileName}`],
			});
			window.close();
		}
	}
}
