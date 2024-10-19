import { iconCpu, iconFromString } from "../../icons";
import { formatBytes } from "../../util/format-bytes";
import type { Search } from "../search";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";

export class SearchGroupSystemMemory extends SearchGroup {
	constructor() {
		super({
			name: "system.memory",
			permissions: ["system.memory"],
			description: "Information about your system memory.",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const memory = await chrome.system.memory.getInfo();
		return [
			new SearchResultSystemMemory({
				title: "Memory",
				searchText: "memory",
				description: `${formatBytes(memory.capacity - memory.availableCapacity)}/${formatBytes(memory.capacity)} GB`,
				prepend: iconFromString(iconCpu),
			}),
		];
	}
}

export class SearchResultSystemMemory extends SearchResult {
	onSelect(): void {
		console.log("on select system Memory");
	}
}
