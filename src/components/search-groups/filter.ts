import { iconFilter, iconFromString } from "../../icons";
import type { Search } from "../search";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";
import { SearchGroups } from "./search-groups";

export class SearchGroupFilter extends SearchGroup {
	constructor() {
		super({
			name: "filter",
			permissions: [],
			filter: "!",
			description: "Filter to render a specific group only.",
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

	public isHit(search: Search): boolean {
		if (search.isEmpty()) {
			return true;
		}
		const currentWord = search.currentWord();
		return currentWord === "!";
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
