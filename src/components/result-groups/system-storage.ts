import { iconFromString, iconNas } from "../../icons";
import { formatBytes } from "../../util/format-bytes";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class ResultGroupSystemStorage extends ResultGroup {
	permissions = ["system.storage"];
	description = "Information about your system storage.";
	supportedBrowsers = ["chromium", "chrome", "edg"];

	public async getResults(): Promise<Result[]> {
		const devices = await chrome.system.storage.getInfo();
		return devices.map(
			(device) =>
				new ResultSystemStorage({
					title: device.name,
					description: `${formatBytes(device.capacity)} GB - ${device.type}`,
					prepend: iconFromString(iconNas),
				}),
		);
	}
}

export class ResultSystemStorage extends Result {
	async execute(): Promise<void> {
		console.log("on select system Memory");
	}
}
