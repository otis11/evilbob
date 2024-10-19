import { iconFromString, iconNas } from "../../icons";
import { formatBytes } from "../../util/format-bytes";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";

export class SearchGroupSystemStorage extends SearchGroup {
	constructor() {
		super({
			name: "system.storage",
			permissions: ["system.storage"],
			description: "Information about your system storage.",
			supportedBrowser: ["chromium", "chrome", "edg"],
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
					prepend: iconFromString(iconNas),
				}),
		);
	}
}

export class SearchResultSystemStorage extends SearchResult {
	onSelect(): void {
		console.log("on select system Memory");
	}
}
