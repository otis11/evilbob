import { SearchResultGroupBookmarks } from "./bookmarks";
import type { SearchResultGroup } from "./search-result-group";

const searchResultGroups = [new SearchResultGroupBookmarks()];

export async function getSearchGroupsWithPermission() {
	const groups: SearchResultGroup[] = [];
	for (const group of searchResultGroups) {
		if (await group.hasPermission()) {
			groups.push(group);
		}
	}
	return groups;
}

export function getSearchGroups() {
	return searchResultGroups;
}
