import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconCpu } from "../icons";

export class SearchGroupBob extends SearchGroup {
	constructor() {
		super({
			name: "bob",
			permissions: [],
		});
	}

	public getResults(): Promise<SearchResult[]> {
		return new Promise((resolve) => {
			resolve([new SearchResultBobOpenSettings()]);
		});
	}
}

export class SearchResultBobOpenSettings extends SearchResult {
	constructor() {
		super({
			title: "Bob Settings",
			searchText: "bob settings",
			description: "Go to bob settings page",
		});
	}
	onSelect(): void {
		chrome.runtime.openOptionsPage();
	}
}
