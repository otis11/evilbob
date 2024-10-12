import { SearchGroups } from ".";
import type { Search } from "../components/search";
import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconFilter, iconFromString } from "../icons";

export class SearchGroupFilter extends SearchGroup {
	constructor() {
		super({
			name: "filter",
			permissions: [],
			filter: "!",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const groups = new SearchGroups();
		await groups.filterEnabled();
		const results = [];
		for (const group of groups.list) {
			if (group.filter) {
				results.push(
					new SearchResultFilter(
						group.filter,
						`Filter for ${group.name}`,
					),
				);
			}
		}
		return results;
	}

	public shouldRenderAlone(search: Search): boolean {
		const currentWord = search.currentWord();
		console.log(currentWord);
		return currentWord === this.filter;
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
			let addition = this.title;
			if (search.currentWord() === "!") {
				addition = addition.slice(1);
			}
			search.inputElement.value += addition;
			search.inputElement.scrollIntoView();
			search.inputElement.focus();
		}
	}
}
