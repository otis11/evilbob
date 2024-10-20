import { getLastActiveTab } from "../../util/last-active-tab";
import type { Search } from "../search";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";

export class SearchGroupContentSettings extends SearchGroup {
	constructor() {
		super({
			name: "content-settings",
			permissions: ["contentSettings"],
			description:
				"Settings that control whether websites can use features such as cookies, JavaScript, and plugins",
			supportedBrowser: ["chrome", "chromium", "edg"],
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const tab = await getLastActiveTab();
		const results: SearchResult[] = [];
		if (tab?.url) {
			const url = tab.url;
			const javascript = (await new Promise((resolve) => {
				chrome.contentSettings.javascript.get(
					{ primaryUrl: url },
					resolve,
				);
			})) as chrome.contentSettings.JavascriptSetDetails;
			results.push(new SearchResultCSJavascript(javascript));
		}

		return results;
	}
}

class SearchResultCSJavascript extends SearchResult {
	constructor(
		private javascript: chrome.contentSettings.JavascriptSetDetails,
	) {
		super({
			tags: [
				{
					text: `${javascript.setting}ed`,
					type: javascript.setting === "allow" ? "success" : "error",
				},
			],
			title: `${
				javascript.setting === "allow" ? "Disable" : "Enable"
			} JavaScript`,
			description: "Enable/disable javascript for the current tab",
			searchText: "toggle enable disable javascript",
		});
	}

	async onSelect(search: Search): Promise<void> {
		const tab = await getLastActiveTab();
		if (tab?.url) {
			const url = new URL(tab.url);
			url.pathname = "/*";
			chrome.contentSettings.javascript.set(
				{
					primaryPattern: url.href,
					setting:
						this.javascript.setting === "allow" ? "block" : "allow",
				},
				() => [window.close()],
			);
		}
	}
}
