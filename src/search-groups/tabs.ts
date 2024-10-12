import type { Search } from "../components/search";
import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconFromString, iconSortAlphabetically } from "../icons";

export class SearchGroupTabs extends SearchGroup {
	constructor() {
		super({
			name: "tabs",
			permissions: ["tabs"],
		});
	}

	public getResults(): Promise<SearchResult[]> {
		return new Promise((resolve) => {
			resolve([new SearchResultSortTabsAlphabetically()]);
		});
	}

	public shouldRenderAlone(search: Search): boolean {
		return false;
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
