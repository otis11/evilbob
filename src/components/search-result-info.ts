import type { Search } from "./search";
import { SearchResult } from "./search-result";
import type { Tag } from "./tags";

export class SearchResultInfo extends SearchResult {
	constructor(title: string, description: string, tags?: Tag[]) {
		super({
			title,
			description,
			tags,
			searchText: `${title} ${description}`,
		});
	}

	onSelect(search: Search): void {}
}
