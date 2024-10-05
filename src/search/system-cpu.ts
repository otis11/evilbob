import { iconCpu } from "../icons";
import { SearchResult } from "./search-result";
import { SearchResultGroup } from "./search-result-group";

export class SearchResultGroupSystemCpu extends SearchResultGroup {
	constructor() {
		super({
			name: "system.cpu",
			permissions: ["system.cpu"],
		});
	}

	public getResults(): Promise<SearchResult[]> {
		return new Promise((resolve) => {
			chrome.system.cpu.getInfo((cpu) => {
				resolve([
					new SearchResultSystemCpu({
						title: "Cpu Modal Name",
						searchText: "cpu modelName",
						description: cpu.modelName,
						icon: iconCpu,
					}),
					new SearchResultSystemCpu({
						title: "Architecture",
						searchText: "cpu archName",
						description: cpu.archName,
						icon: iconCpu,
					}),
					new SearchResultSystemCpu({
						title: "Number of Processors",
						searchText: "cpu numOfProcessors",
						description: cpu.numOfProcessors.toString(),
						icon: iconCpu,
					}),
					new SearchResultSystemCpu({
						title: "Cpu Features",
						searchText: "cpu features",
						description: cpu.features.join(", "),
						icon: iconCpu,
					}),
				]);
			});
		});
	}
}

export class SearchResultSystemCpu extends SearchResult {
	onSelect(): void {
		console.log("on select system cpu");
	}
}
