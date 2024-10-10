import { type Search, SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconFromString, iconGoogle } from "../icons";

export class SearchGroupGoogle extends SearchGroup {
	constructor() {
		super({
			name: "google",
			permissions: [],
		});
	}

	public getResults(): Promise<SearchResult[]> {
		return new Promise((resolve) => {
			resolve([new SearchResultGoogle("intitle", 'intitle="Youtube"')]);
		});
	}

	public shouldRenderAlone(search: Search): boolean {
		return search.text.includes("!g");
	}

	isSearchHitForResult(search: Search, instance: SearchResult) {
		return true;
	}
}

export class SearchResultGoogle extends SearchResult {
	constructor(title: string, description: string) {
		super({
			title,
			searchText: `${title} ${description}`,
			description,
			prepend: iconFromString(iconGoogle),
		});
	}
	onSelect(search: Search): void {
		chrome.tabs.create({
			url: `https://google.com/search?q=${search.text.replaceAll("!g", "").trim().replaceAll(" ", "+")}`,
		});
		window.close();
	}
}
