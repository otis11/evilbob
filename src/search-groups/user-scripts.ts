import type { Search } from "../components/search";
import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconFromString, iconScript } from "../icons";

export class SearchGroupUserScripts extends SearchGroup {
	constructor() {
		super({
			name: "user-scripts",
			permissions: ["tabs", "scripting"],
			hostPermissions: ["https://*/*"],
		});
	}

	public shouldRenderAlone(search: Search): boolean {
		return false;
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
		const storage = await chrome.storage.sync.get(["lastFocusedWindowId"]);
		const tabs = await chrome.tabs.query({
			windowId: storage.lastFocusedWindowId,
			active: true,
		});
		if (tabs.length === 0) {
			console.error(
				"user script not executed, no active tab found",
				this,
			);
			return;
		}

		const tabId = tabs[0].id;
		if (tabId) {
			chrome.scripting.executeScript({
				target: { tabId },
				files: [`user-scripts/${this.fileName}`],
			});
            window.close()
		}
	}
}
