import { iconCpu, iconFromString } from "../../icons";
import { formatBytes } from "../../util/format-bytes";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class ResultGroupSystemMemory extends ResultGroup {
	permissions = ["system.memory"];
	description = "Information about your system memory.";
	supportedBrowsers = ["chromium", "chrome", "edg"];
	public prefix?: string | undefined = "mem";

	public async getResults(): Promise<Result[]> {
		const memory = await chrome.system.memory.getInfo();
		return [
			new ResultSystemMemory({
				title: "Memory",
				description: `${formatBytes(memory.capacity - memory.availableCapacity)}/${formatBytes(memory.capacity)} GB`,
				prepend: iconFromString(iconCpu),
			}),
		];
	}
}

export class ResultSystemMemory extends Result {
	async execute(): Promise<void> {
		console.log("on select system Memory");
	}
}
