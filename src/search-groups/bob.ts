import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconOpenInNew } from "../icons";

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
			title: "Bob Options",
			searchText: "bob settings options",
			description: "Go to bob options page",
			icon: iconOpenInNew,
		});
	}
	onSelect(): void {
		chrome.runtime.openOptionsPage();
		window.close();
	}
}
