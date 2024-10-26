import { getLastActiveTab } from "../../util/last-active-tab";
import { refocusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";

export class ResultGroupContentSettings extends ResultGroup {
	public prefix?: string | undefined = "cs";
	permissions = ["contentSettings"];
	description =
		"Settings that control whether websites can use features such as cookies, JavaScript, and plugins";
	supportedBrowsers = ["chrome", "chromium", "edg"];
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
			results.push(new ResultCSJavascript(javascript));
		}

		return results;
	}
}

class ResultCSJavascript extends Result {
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
		});
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
				() => refocusLastActiveWindow(),
			);
		}
	}
}
