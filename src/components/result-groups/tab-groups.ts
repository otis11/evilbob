import type { BrowserName } from "../../platform";
import {
	getLastActiveWindow,
	refocusLastActiveWindow,
} from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";

export class ResultGroupTabGroups extends ResultGroup {
	prefix = "tg";
	public description = "List tab groups.";
	public permissions: string[] = ["tabGroups"];
	public supportedBrowser: BrowserName[] = ["chrome", "chromium", "edg"];

	public async getResults(): Promise<Result[]> {
		const groups = await chrome.tabGroups.query({});
		return groups.map((group) => new ResultTabGroup(group));
	}
}

class ResultTabGroup extends Result {
	constructor(private group: chrome.tabGroups.TabGroup) {
		const groupColorElement = document.createElement("div");
		groupColorElement.style.background = group.color;
		groupColorElement.style.height = "24px";
		groupColorElement.style.width = "24px";
		groupColorElement.style.borderRadius = "50%";

		super({
			title: group.title || "",
			description: "",
			prepend: groupColorElement,
		});
	}

	async execute(search: Search, results: Result[]): Promise<void> {
		const tabs = await chrome.tabs.query({ groupId: this.group.id });
		const lastActiveWindow = await getLastActiveWindow();
		if (tabs[0]?.id) {
			await chrome.tabs.highlight({
				tabs: [tabs[0].index],
				windowId: lastActiveWindow.id,
			});
		}
		refocusLastActiveWindow();
	}
}
