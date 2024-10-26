import type { BrowserName } from "../../platform";
import { getLastActiveTab } from "../../util/last-active-tab";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";
import type { Tag } from "../tags/tags";

export class ContentSettings extends ResultGroup {
	public prefix?: string | undefined = "cs";
	permissions = ["contentSettings"];
	public description(): string {
		return "Settings that control whether websites can use features such as cookies, JavaScript, and plugins";
	}

	public name(): string {
		return "Content Settings";
	}
	supportedBrowsers: BrowserName[] = ["chrome", "chromium", "edg"];
	public async getResults(): Promise<Result[]> {
		const tab = await getLastActiveTab();
		const results: Result[] = [];
		if (tab?.url) {
			const url = tab.url;
			const javascript = (await new Promise((resolve) => {
				chrome.contentSettings.javascript.get(
					{ primaryUrl: url },
					resolve,
				);
			})) as chrome.contentSettings.JavascriptSetDetails;
			results.push(new CSJavascript(javascript));
		}

		return results;
	}
}

class CSJavascript extends Result {
	title(): string {
		return `${
			this.javascript.setting === "allow" ? "Disable" : "Enable"
		} JavaScript`;
	}

	description(): string {
		return "Enable/disable javascript for the current tab";
	}

	tags(): Tag[] {
		return [
			{
				text: `${this.javascript.setting}ed`,
				type: this.javascript.setting === "allow" ? "success" : "error",
			},
		];
	}
	constructor(
		private javascript: chrome.contentSettings.JavascriptSetDetails,
	) {
		super();
	}

	async execute(search: Search): Promise<void> {
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
				() => focusLastActiveWindow(),
			);
		}
	}
}
