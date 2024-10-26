import type { BrowserName } from "../../platform";
import {
	focusLastActiveWindow,
	getLastActiveWindow,
} from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";

export class TabGroups extends ResultGroup {
	prefix = "tg";
	public description(): string {
		return "List tab groups.";
	}
	public name(): string {
		return "Tab Groups";
	}
	public permissions: string[] = ["tabGroups"];
	public supportedBrowsers: BrowserName[] = ["chrome", "chromium", "edg"];

	public async getResults(): Promise<Result[]> {
		const groups = await chrome.tabGroups.query({});
		return groups.map((group) => new TabGroup(group));
	}
}

class TabGroup extends Result {
	title(): string {
		return this.group.title || "";
	}

	prepend(): HTMLElement | undefined {
		const groupColorElement = document.createElement("div");
		groupColorElement.style.background = this.group.color;
		groupColorElement.style.height = "24px";
		groupColorElement.style.width = "24px";
		groupColorElement.style.borderRadius = "50%";
		return groupColorElement;
	}
	constructor(private group: chrome.tabGroups.TabGroup) {
		super();
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
		focusLastActiveWindow();
	}
}
