import type { Search } from "../components/search";
import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconCpu, iconFromString } from "../icons";
import { formatBytes } from "../util/format-bytes";

export class SearchGroupSystemMemory extends SearchGroup {
	constructor() {
		super({
			name: "system.memory",
			permissions: ["system.memory"],
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const memory = await chrome.system.memory.getInfo();
		return [
			new SearchResultSystemMemory({
				title: "Memory",
				searchText: "memory",
				description: `${formatBytes(memory.capacity - memory.availableCapacity)}/${formatBytes(memory.capacity)} GB`,
				append: iconFromString(iconCpu),
			}),
		];
	}
}

export class SearchResultSystemMemory extends SearchResult {
	onSelect(): void {
		console.log("on select system Memory");
	}
}
