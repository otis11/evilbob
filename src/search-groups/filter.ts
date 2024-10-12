import type { Search } from "../components/search";
import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconFilter, iconFromString } from "../icons";

export class SearchGroupFilter extends SearchGroup {
	constructor() {
		super({
			name: "filter",
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
        const currentWord = search.currentWord()
		return currentWord === "!";
	}

    public isSearchHitForResult(search: Search, instance: SearchResult): boolean {
        if(search.isEmpty()) {
            return true
        }
        const currentWord = search.currentWord()
		return currentWord === "!";
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
	onSelect(search: Search): void {
		if (search.inputElement) {
            let addition = this.title
            if(search.currentWord() === '!') {
                addition = addition.slice(1)
            }
			search.inputElement.value += addition;
			search.inputElement.scrollIntoView();
			search.inputElement.focus();
		}
	}
}
