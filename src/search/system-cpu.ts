import { iconCpu } from "../icons";
import { type SearchResult, SearchResultGroup } from "./search-result-group";

export class SearchResultGroupSystemCpu extends SearchResultGroup {
	constructor() {
		super({
			name: "system.cpu",
			permissions: ["system.cpu"],
			icon: iconCpu,
		});
	}

	public getResults(): Promise<SearchResult[]> {
		return new Promise((resolve) => {
			chrome.system.cpu.getInfo((cpu) => {
				resolve([
					{
						title: "Cpu Modal Name",
						searchText: "cpu modelName",
						description: cpu.modelName,
						id: "cpu.modelName",
						icon: iconCpu,
					},
					{
						title: "Architecture",
						searchText: "cpu archName",
						description: cpu.archName,
						id: "cpu.archName",
						icon: iconCpu,
					},
					{
						title: "Number of Processors",
						searchText: "cpu numOfProcessors",
						description: cpu.numOfProcessors.toString(),
						id: "cpu.numOfProcessors",
						icon: iconCpu,
					},
					{
						title: "Cpu Features",
						searchText: "cpu features",
						description: cpu.features.join(", "),
						id: "cpu.features",
						icon: iconCpu,
					},
				]);
			});
		});
	}
}
