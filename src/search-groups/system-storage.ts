import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconFromString, iconNas } from "../icons";
import { formatBytes } from "../util/format-bytes";

export class SearchGroupSystemStorage extends SearchGroup {
	constructor() {
		super({
			name: "system.storage",
			permissions: ["system.storage"],
			description: "Information about your system storage.",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const devices = await chrome.system.storage.getInfo();
		return devices.map(
			(device) =>
				new SearchResultSystemStorage({
					title: device.name,
					searchText: "storage capacity available",
					description: `${formatBytes(device.capacity)} GB - ${device.type}`,
					append: iconFromString(iconNas),
				}),
		);
	}
}

export class SearchResultSystemStorage extends SearchResult {
	onSelect(): void {
		console.log("on select system Memory");
	}
}
