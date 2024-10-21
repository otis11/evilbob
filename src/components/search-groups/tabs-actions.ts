import {
	iconArrowVerticalSplit,
	iconFromString,
	iconMusic,
	iconMusicOff,
	iconPin,
	iconPinOff,
	iconSortAlphabetically,
	iconTabPlus,
	iconTabRemove,
	iconWindowRestore,
} from "../../icons";
import { getLastActiveTab } from "../../util/last-active-tab";
import {
	getLastActiveWindow,
	getLastActiveWindowTabs,
} from "../../util/last-active-window";
import type { Search } from "../search";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";
import { SearchResultTab } from "./tabs";

export class SearchGroupTabsActions extends SearchGroup {
	constructor() {
		super({
			name: "tabs-actions",
			permissions: ["tabs"],
			filter: "!ta",
			description:
				"Interact with browser tabs. Sort, merge, duplicate...",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		return [
			new SearchResultCloseOtherTabs(),
			new SearchResultSortTabsAlphabetically(),
			new SearchResultTabDuplicate(),
			new SearchResultTabMute(),
			new SearchResultTabUnmute(),
			new SearchResultTabPin(),
			new SearchResultTabUnpin(),
			new SearchResultMergeWindows(),
			new SearchResultCloseByRegex(),
			new SearchResultSplitIntoWindows(),
		];
	}
}

class SearchResultTabDuplicate extends SearchResult {
	constructor() {
		super({
			title: "Duplicate Tab",
			description: "",
			searchText: "duplicate tab",
			prepend: iconFromString(iconTabPlus),
		});
	}

	async onSelect(search: Search): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.duplicate(lastActive.id);
			window.close();
		}
	}
}

class SearchResultTabMute extends SearchResult {
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

class SearchResultTabUnmute extends SearchResult {
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

class SearchResultTabPin extends SearchResult {
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

class SearchResultTabUnpin extends SearchResult {
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
		const tabs = await getLastActiveWindowTabs();

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

export class SearchResultMergeWindows extends SearchResult {
	constructor() {
		super({
			title: "Merge windows",
			searchText: "merge windows",
			description: "",
			prepend: iconFromString(iconWindowRestore),
		});
	}
	async onSelect(): Promise<void> {
		const lastWindow = await getLastActiveWindow();
		const tabs = await chrome.tabs.query({});
		const tabsNotInLastWindow = tabs
			.filter((tab) => tab.windowId !== lastWindow.id)
			.map((w) => w.id || -1);
		await chrome.tabs.move(tabsNotInLastWindow, {
			windowId: lastWindow.id,
			index: 999,
		});
		window.close();
	}
}

export class SearchResultSplitIntoWindows extends SearchResult {
	constructor() {
		super({
			title: "Split tabs into windows",
			searchText: "split tabs into windows",
			description: "",
			prepend: iconFromString(iconArrowVerticalSplit),
		});
	}

	async onSelect(): Promise<void> {
		const tabs = await getLastActiveWindowTabs();
		const promises = [];
		for (const tab of tabs) {
			promises.push(chrome.windows.create({ tabId: tab.id }));
		}
		await Promise.all(promises);
		window.close();
	}
}

export class SearchResultCloseOtherTabs extends SearchResult {
	constructor() {
		super({
			title: "Close other tabs",
			searchText: "close other tabs",
			description: "",
			prepend: iconFromString(iconTabRemove),
		});
	}

	async onSelect(): Promise<void> {
		const tabs = await getLastActiveWindowTabs();
		const lastActiveTab = await getLastActiveTab();
		const promises = [];
		for (const tab of tabs) {
			if (tab.id && tab.id !== lastActiveTab?.id) {
				promises.push(chrome.tabs.remove(tab.id));
			}
		}
		await Promise.all(promises);
		window.close();
	}
}

export class SearchResultCloseByRegex extends SearchResult {
	constructor() {
		super({
			options: new SearchResultCloseByRegexGroup(),
			title: "Close tabs by regex",
			description:
				"Close the following tabs by regex. Select any tab to close them.",
			searchText: "close tabs by regex",
			prepend: iconFromString(iconTabRemove),
		});
	}

	onSelect(search: Search): void {
		this.emitShowOptionsEvent();
	}
}

class SearchResultCloseByRegexGroup extends SearchGroup {
	constructor() {
		super({
			name: "Close by regex group",
			description: "",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const tabs = await chrome.tabs.query({});
		return tabs.map((tab) => new SearchResultTabCloseByRegex(tab));
	}
}

class SearchResultTabCloseByRegex extends SearchResultTab {
	public isHit(search: Search): boolean {
		const regex = new RegExp(search.text);
		return regex.test(this.tab.url || "");
	}

	async onSelect(search: Search): Promise<void> {
		const tabs = await chrome.tabs.query({});
		const regex = new RegExp(search.text);
		for (const tab of tabs) {
			if (regex.test(tab.url || "") && tab.id) {
				await chrome.tabs.remove(tab.id);
			}
		}
		window.close();
	}
}
