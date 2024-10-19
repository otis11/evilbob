import type { Search } from "../search";
import type { Tag } from "../tags/tags";
import { SearchResult } from "./search-result";

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
