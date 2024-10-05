import { Icon } from "../components/icon";
import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconCpu } from "../icons";

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
						prepend: Icon.fromString(iconCpu),
					}),
					new SearchResultSystemCpu({
						title: "Architecture",
						searchText: "cpu archName",
						description: cpu.archName,
						prepend: Icon.fromString(iconCpu),
					}),
					new SearchResultSystemCpu({
						title: "Number of Processors",
						searchText: "cpu numOfProcessors",
						description: cpu.numOfProcessors.toString(),
						prepend: Icon.fromString(iconCpu),
					}),
					new SearchResultSystemCpu({
						title: "Cpu Features",
						searchText: "cpu features",
						description: cpu.features.join(", "),
						prepend: Icon.fromString(iconCpu),
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
