import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { browserName, browserVersion, isFirefox } from "../platform";

export class SearchGroupPlatform extends SearchGroup {
	constructor() {
		super({
			name: "platform",
			permissions: [],
		});
	}

	public getResults(): Promise<SearchResult[]> {
		return new Promise((resolve) => {
			const aboutLink = isFirefox ? "about:support" : "chrome://version";
			resolve([
				new SearchResultPlatform({
					title: "Browser Version",
					searchText: "browser version",
					description: `${browserName} ${browserVersion} ${aboutLink}`,
				}),
			]);
		});
	}
}

export class SearchResultPlatform extends SearchResult {
	onSelect(): void {
		console.log("on select SearchResultPlatform");
	}
}
