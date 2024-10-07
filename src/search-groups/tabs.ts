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
			resolve([new SearchResultSortTabsByDomain()]);
		});
	}
}

export class SearchResultSortTabsByDomain extends SearchResult {
	constructor() {
		super({
			title: "Sort tabs alphabetically",
			searchText: "sort tabs alphabetically",
			description: "",
			prepend: iconFromString(iconSortAlphabetically),
		});
	}
	onSelect(): void {
		chrome.storage.sync.get(["lastFocusedWindowId"]).then((storage) => {
			chrome.tabs
				.query({ windowId: storage.lastFocusedWindowId })
				.then((tabs) => {
					const tabsSorted = tabs.sort((a, b) => {
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

					let tabSortedIds = "";
					let tabIds = "";
					for (const [index, _] of tabsSorted.entries()) {
						tabSortedIds += tabsSorted[index];
						tabIds += tabs[index];
					}

					if (tabIds === tabSortedIds) {
						// TODO replace with notifcation or sonner
						alert("already ordered");
						return;
					}

					for (const [index, tab] of tabsSorted.entries()) {
						if (tab.id) {
							chrome.tabs.move(tab.id, { index });
						}
					}
					window.close();
				});
		});
	}
}
