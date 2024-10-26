import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";

// separated from sessions because only chrome has .getDevices
export class ResultGroupSessionDevices extends ResultGroup {
	permissions = ["sessions"];
	description = "Search your session devices.";
	supportedBrowsers = ["chrome", "chromium", "edg"];
	public prefix?: string | undefined = "sd";

	public async getResults(): Promise<Result[]> {
		const devices = await chrome.sessions.getDevices();
		return devices.map((device) => new ResultGroupSessionDevice(device));
	}
}

export class ResultGroupSessionDevice extends Result {
	constructor(private device: chrome.sessions.Device) {
		super({
			title: device.deviceName,
			tags: [
				{ text: `${device.sessions.length} sessions`, type: "default" },
			],
			description: "",
		});
	}
	async execute(search: Search, results: Result[]): Promise<void> {
		console.log("session device selected");
	}
}
