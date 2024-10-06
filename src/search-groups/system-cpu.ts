import { iconCpu, iconFromString } from "../components/icon";
import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";

export class SearchGroupSystemCpu extends SearchGroup {
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
						append: iconFromString(iconCpu),
					}),
					new SearchResultSystemCpu({
						title: "Architecture",
						searchText: "cpu archName",
						description: cpu.archName,
						append: iconFromString(iconCpu),
					}),
					new SearchResultSystemCpu({
						title: "Number of Processors",
						searchText: "cpu numOfProcessors",
						description: cpu.numOfProcessors.toString(),
						append: iconFromString(iconCpu),
					}),
					new SearchResultSystemCpu({
						title: "Cpu Features",
						searchText: "cpu features",
						description: cpu.features.join(", "),
						append: iconFromString(iconCpu),
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
