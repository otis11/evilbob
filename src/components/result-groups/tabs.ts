import {
	faviconFromUrl,
	iconFromString,
	iconFromUrl,
	iconIncognito,
	iconMusic,
	iconMusicOff,
	iconPin,
	iconTab,
} from "../../icons";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";
import type { Tag } from "../tags/tags";

export class ResultGroupTabs extends ResultGroup {
	permissions = ["tabs"];
	prefix = "t";
	description = "Search browser tabs.";

	public async getResults(): Promise<Result[]> {
		const tabs = await chrome.tabs.query({});
		return tabs.map((tab) => new ResultTab(tab));
	}
}

export class ResultTab extends Result {
	constructor(public tab: chrome.tabs.Tab) {
		const tags: Tag[] = [
			{ html: iconFromString(iconTab, "12px").outerHTML },
		];
		if (tab.incognito) {
			tags.push({
				html: iconFromString(iconIncognito, "12px").outerHTML,
			});
		}
		if (tab.audible) {
			tags.push({
				html: iconFromString(iconMusic, "12px").outerHTML,
			});
		}
		if (tab.pinned) {
			tags.push({
				html: iconFromString(iconPin, "12px").outerHTML,
			});
		}
		if (tab.mutedInfo?.muted) {
			tags.push({
				html: `${iconFromString(iconMusicOff, "12px").outerHTML} ${tab.mutedInfo.reason}`,
			});
		}
		if (tab.highlighted) {
			tags.push({
				text: "active",
				type: "success",
			});
		}
		const icon = tab.favIconUrl
			? iconFromUrl(tab.favIconUrl)
			: faviconFromUrl(tab.url || "");
		super({
			title: tab.title || "",
			prepend: icon,
			description: `${tab.url}`,
			tags,
		});
	}

	public id(): string {
		return this.name() + this.tab.url;
	}

	async execute(search: Search, results: Result[]): Promise<void> {
		await chrome.tabs.highlight({
			tabs: [this.tab.index],
			windowId: this.tab.windowId,
		});
		focusLastActiveWindow();
	}
}
