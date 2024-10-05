import { SearchResultGroupBookmarks } from "./bookmarks";
import type { SearchResultGroup } from "./search-result-group";
import { SearchResultGroupSystemCpu } from "./system-cpu";

const searchResultGroups = [
	new SearchResultGroupBookmarks(),
	new SearchResultGroupSystemCpu(),
];

export async function getOrderedSearchGroupsWithPermission() {
	const groups: SearchResultGroup[] = [];
	for (const group of searchResultGroups) {
		if (await group.hasPermission()) {
			groups.push(group);
		}
	}
	return await sortGroupsByOrder(groups);
}

export async function getAlphabeticallyOrderedSearchGroups() {
	return searchResultGroups.sort((a, b) => {
		if (a.name > b.name) {
			return 1;
		}
		if (a.name < b.name) {
			return -1;
		}
		return 0;
	});
}

async function sortGroupsByOrder(groups: SearchResultGroup[]) {
	const order = await getSearchGroupOrder();
	return groups.sort((a, b) => {
		if (order[a.name] > order[b.name]) {
			return 1;
		}
		if (order[a.name] < order[b.name]) {
			return -1;
		}
		return 0;
	});
}

export async function getSearchGroupOrder(): Promise<Record<string, number>> {
	return (
		(await chrome.storage.sync.get(["searchGroupOrder"]))
			.searchGroupOrder || {}
	);
}

export function setSearchGroupOrder(order: Record<string, number>) {
	chrome.storage.sync.set({ searchGroupOrder: order });
}
