import {
	faviconFromUrl,
	iconFromString,
	iconFromUrl,
	iconIncognito,
	iconMusic,
	iconMusicOff,
	iconPin,
	iconPinOff,
	iconSortAlphabetically,
	iconTab,
} from "../../icons";
import { getLastActiveTab } from "../../util/last-active-tab";
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
			description:
				"Search & interact with browser tabs. For example sort them.",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const tabs = await chrome.tabs.query({});
		return [
			new SearchResultSortTabsAlphabetically(),
			new SearchResultTabMute(),
			new SearchResultTabUnmute(),
			new SearchResultTabPin(),
			new SearchResultTabUnpin(),
			...tabs.map((tab) => new SearchResultTab(tab)),
		];
	}
}

export class SearchResultTabMute extends SearchResult {
	constructor() {
		super({
			title: "Mute Tab",
			description: "",
			searchText: "mute tab",
			prepend: iconFromString(iconMusicOff),
		});
	}

	async onSelect(search: Search): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { muted: true });
			window.close();
		}
	}
}

export class SearchResultTabUnmute extends SearchResult {
	constructor() {
		super({
			title: "Unmute Tab",
			description: "",
			searchText: "unmute tab",
			prepend: iconFromString(iconMusic),
		});
	}

	async onSelect(search: Search): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { muted: false });
			window.close();
		}
	}
}

export class SearchResultTabPin extends SearchResult {
	constructor() {
		super({
			title: "Pin Tab",
			description: "",
			searchText: "pin tab",
			prepend: iconFromString(iconPin),
		});
	}

	async onSelect(search: Search): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { pinned: true });
			window.close();
		}
	}
}

export class SearchResultTabUnpin extends SearchResult {
	constructor() {
		super({
			title: "Unpin Tab",
			description: "",
			searchText: "unpin tab",
			prepend: iconFromString(iconPinOff),
		});
	}

	async onSelect(search: Search): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { pinned: false });
			window.close();
		}
	}
}

export class SearchResultTab extends SearchResult {
	constructor(private tab: chrome.tabs.Tab) {
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

export class SearchResultSortTabsAlphabetically extends SearchResult {
	constructor() {
		super({
			title: "Sort tabs alphabetically",
			searchText: "sort tabs alphabetically",
			description: "",
			prepend: iconFromString(iconSortAlphabetically),
		});
	}
	async onSelect(): Promise<void> {
		const storage = await chrome.storage.sync.get(["lastFocusedWindowId"]);
		const tabs = await chrome.tabs.query({
			windowId: storage.lastFocusedWindowId,
		});

		const tabsSortedAlphabetically = tabs.sort((a, b) => {
			if (!a.url || !b.url) {
				// TODO use name instead of url?
				return 0;
			}
			if (a.url > b.url) {
				return 1;
			}
			if (a.url < b.url) {
				return -1;
			}
			return 0;
		});

		let isSortingNeeded = false;
		for (const [index, _] of tabsSortedAlphabetically.entries()) {
			// t1 t2 t3
			// t3 t2 t1
			// t1 t2 t3
			if (tabsSortedAlphabetically[index].index !== index) {
				isSortingNeeded = true;
				break;
			}
		}

		if (!isSortingNeeded) {
			// TODO replace with notifcation or sonner
			alert("already ordered");
			return;
		}

		for (const [index, tab] of tabsSortedAlphabetically.entries()) {
			if (tab.id) {
				chrome.tabs.move(tab.id, { index });
			}
		}
		window.close();
	}
}
