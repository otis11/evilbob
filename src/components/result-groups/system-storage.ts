import { iconFromString, iconNas } from "../../icons";
import type { BrowserName } from "../../platform";
import { formatBytes } from "../../util/format-bytes";
import { ResultGroup } from "../result-group";
import { Info } from "../result/info";
import type { Result } from "../result/result";

export class SystemStorage extends ResultGroup {
	permissions = ["system.storage"];
	public description(): string {
		return "Information about your system storage.";
	}

	public name(): string {
		return "System Storage";
	}
	supportedBrowsers: BrowserName[] = ["chromium", "chrome", "edg"];
	public prefix?: string | undefined = "sto";

	public async getResults(): Promise<Result[]> {
		const devices = await chrome.system.storage.getInfo();
		return devices.map(
			(device) =>
				new Info({
					title: device.name,
					description: `${formatBytes(device.capacity)} GB - ${device.type}`,
					prepend: iconFromString(iconNas),
				}),
		);
	}
}
