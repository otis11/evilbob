import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";
import { SearchResultInfo } from "../search-result/search-result-info";

// separated from sessions because only chrome has .getDevices
export class SearchGroupSessionDevices extends SearchGroup {
	constructor() {
		super({
			name: "sessions.devices",
			permissions: ["sessions"],
			description: "Search your session devices.",
			supportedBrowser: ["chrome", "chromium", "edg"],
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const devices = await chrome.sessions.getDevices();
		return [new SearchResultSessionDevices(devices)];
	}
}

export class SearchResultSessionDevices extends SearchResult {
	constructor(devices: chrome.sessions.Device[]) {
		super({
			title: "Session Devices",
			description: "",
			searchText: "session devices",
			options: new SearchGroupSessionDevicesDeep(devices),
		});
	}

	onSelect(): void {
		this.emitShowOptionsEvent();
	}
}

export class SearchGroupSessionDevicesDeep extends SearchGroup {
	constructor(private devices: chrome.sessions.Device[]) {
		super({
			name: "session-devices",
			description: "Session devices",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		return this.devices.map((device) => {
			return new SearchResultInfo(device.deviceName, "", [
				{ text: `${device.sessions.length} sessions`, type: "default" },
			]);
		});
	}
}
