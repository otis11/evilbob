import { iconCpu, iconFromString } from "../../icons";
import { t } from "../../locale";
import type { BrowserName } from "../../platform";
import { formatBytes } from "../../util/format-bytes";
import { ResultGroup } from "../result-group";
import { Info } from "../result/info";
import type { Result } from "../result/result";

export class SystemMemory extends ResultGroup {
	public id(): string {
		return "system-memory";
	}
	permissions = ["system.memory"];
	public description(): string {
		return t("SystemMemory.description");
	}
	public name(): string {
		return t("SystemMemory");
	}
	supportedBrowsers: BrowserName[] = ["chromium", "chrome", "edg"];
	public prefix?: string | undefined = "mem";

	public async getResults(): Promise<Result[]> {
		const memory = await chrome.system.memory.getInfo();
		return [
			new Info({
				title: t("Memory"),
				description: `${formatBytes(memory.capacity - memory.availableCapacity)}/${formatBytes(memory.capacity)} GB`,
				prepend: iconFromString(iconCpu),
			}),
		];
	}
}
