import { type Search, SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconBob, iconFromString } from "../icons";

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

	public shouldRenderAlone(search: Search): boolean {
		return false;
	}
}

export class SearchResultBobOpenSettings extends SearchResult {
	constructor() {
		super({
			title: "Bob Options",
			searchText: "bob settings options change",
			description: "Change me here!",
			prepend: iconFromString(iconBob),
		});
	}
	onSelect(): void {
		chrome.runtime.openOptionsPage();
		window.close();
	}
}
