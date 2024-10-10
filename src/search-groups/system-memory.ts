import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconCpu, iconFromString } from "../icons";

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
				searchText: "memory capacity available",
				description: `${formatMemory(memory.capacity - memory.availableCapacity)}/${formatMemory(memory.capacity)} GB`,
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

function formatMemory(bytes: number) {
	const kib = bytes / 1024;
	const mib = kib / 1024;
	const gib = mib / 1024;
	return `${gib.toFixed(1)}`.replace(".", ",");
}
