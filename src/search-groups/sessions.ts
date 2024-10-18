import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { SearchResultInfo } from "../components/search-result-info";

export class SearchGroupSessions extends SearchGroup {
	constructor() {
		super({
			name: "sessions",
			permissions: ["sessions"],
			description: "Search & interact with your sessions.",
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
			options: new SearchGroupSessionDevices(devices),
		});
	}

	onSelect(): void {
		this.emitShowOptionsEvent();
	}
}

export class SearchGroupSessionDevices extends SearchGroup {
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
