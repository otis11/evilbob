import { type Search, SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconFilter, iconFromString } from "../icons";

export class SearchGroupFilter extends SearchGroup {
	constructor() {
		super({
			name: "bang",
			permissions: [],
		});
	}

	public getResults(): Promise<SearchResult[]> {
		return new Promise((resolve) => {
			resolve([
				new SearchResultFilter("!g", "Search Google"),
				new SearchResultFilter("!h", "Search History"),
				new SearchResultFilter("!b", "Search Bookmarks"),
			]);
		});
	}

	public shouldRenderAlone(search: Search): boolean {
		if (!search.selectionStart) {
			return false;
		}
		const lastTypeChar = search.text[search.selectionStart - 1];
		if (lastTypeChar === "!") {
			return true;
		}
		return false;
	}
}

export class SearchResultFilter extends SearchResult {
	constructor(title: string, description: string) {
		super({
			title,
			searchText: `${title} ${description}`,
			description,
			prepend: iconFromString(iconFilter),
		});
	}
	onSelect(): void {}
}
