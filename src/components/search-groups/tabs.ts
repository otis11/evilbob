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
import type { Search } from "../search";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";
import type { Tag } from "../tags/tags";

export class SearchGroupTabs extends SearchGroup {
	constructor() {
		super({
			name: "tabs",
			permissions: ["tabs"],
			filter: "!t",
			description: "Search browser tabs.",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const tabs = await chrome.tabs.query({});
		return tabs.map((tab) => new SearchResultTab(tab));
	}
}

export class SearchResultTab extends SearchResult {
	constructor(protected tab: chrome.tabs.Tab) {
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
			searchText: `${tab.title} ${tab.url}`,
			description: `${tab.url}`,
			tags,
		});
	}

	async onSelect(search: Search): Promise<void> {
		await chrome.tabs.highlight({
			tabs: [this.tab.index],
			windowId: this.tab.windowId,
		});
		window.close();
	}
}
