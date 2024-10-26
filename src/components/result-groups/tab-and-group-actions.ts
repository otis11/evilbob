import type { BrowserName } from "../../platform";
import {
	focusLastActiveWindow,
	getLastActiveWindow,
	getLastActiveWindowTabs,
} from "../../util/last-active-window";
import { getSecondLevelDomain } from "../../util/url";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";

export class ResultGroupTabAndGroupActions extends ResultGroup {
	permissions = ["tabs", "tabGroups"];
	prefix = "tga";
	description =
		"Combined actions for tabs & groups, for instance group tabs by domain";
	public supportedBrowsers: BrowserName[] = ["chrome", "chromium", "edg"];

	public async getResults(): Promise<Result[]> {
		return [new ResultGroupTabsByDomain(), new ResultUngroupTabs()];
	}
}

class ResultGroupTabsByDomain extends Result {
	constructor() {
		super({
			title: "Group tabs by domain",
			description: "",
		});
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		const tabs = await getLastActiveWindowTabs();
		const lastActiveWindow = await getLastActiveWindow();

		const domainMap: Record<string, chrome.tabs.Tab[]> = {};

		for (const tab of tabs) {
			if (!tab.url) {
				continue;
			}

			const secondLevelDomain = getSecondLevelDomain(tab.url);
			if (domainMap[secondLevelDomain]) {
				domainMap[secondLevelDomain].push(tab);
			} else {
				domainMap[secondLevelDomain] = [tab];
			}
		}

		for (const key of Object.keys(domainMap)) {
			const groupId = await chrome.tabs.group({
				createProperties: { windowId: lastActiveWindow.id },
				tabIds: domainMap[key]
					.map((tab) => tab.id)
					.filter((id) => id !== undefined),
			});
			await chrome.tabGroups.update(groupId, {
				title: key,
			});
		}

		await focusLastActiveWindow();
	}
}

class ResultUngroupTabs extends Result {
	constructor() {
		super({
			title: "Ungroup Tabs",
			description: "",
		});
	}

	async execute(search: Search, results: Result[]): Promise<void> {
		const tabs = await getLastActiveWindowTabs();
		await chrome.tabs.ungroup(
			tabs.map((tab) => tab.id).filter((id) => id !== undefined),
		);
		await focusLastActiveWindow();
	}
}
