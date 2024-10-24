import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { ResultInfo } from "../result/result-info";

// separated from sessions because only chrome has .getDevices
export class ResultGroupSessionDevices extends ResultGroup {
	permissions = ["sessions"];
	description = "Search your session devices.";
	supportedBrowsers = ["chrome", "chromium", "edg"];

	public async getResults(): Promise<Result[]> {
		const devices = await chrome.sessions.getDevices();
		return [new ResultSessionDevices(devices)];
	}
}

export class ResultSessionDevices extends Result {
	constructor(devices: chrome.sessions.Device[]) {
		super({
			title: "Session Devices",
			description: "",
			options: new ResultGroupSessionDevicesDeep(devices),
		});
	}

	async execute(): Promise<void> {
		this.emitShowOptionsEvent();
	}
}

export class ResultGroupSessionDevicesDeep extends ResultGroup {
	constructor(private devices: chrome.sessions.Device[]) {
		super();
	}

	public async getResults(): Promise<Result[]> {
		return this.devices.map((device) => {
			return new ResultInfo(device.deviceName, "", [
				{ text: `${device.sessions.length} sessions`, type: "default" },
			]);
		});
	}
}
