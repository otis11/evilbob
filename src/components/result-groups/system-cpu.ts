import { iconCpu, iconFromString } from "../../icons";
import type { BrowserName } from "../../platform";
import { ResultGroup } from "../result-group";
import { Info } from "../result/info";
import type { Result } from "../result/result";

export class SystemCpu extends ResultGroup {
	permissions = ["system.cpu"];
	public prefix?: string | undefined = "cpu";
	public description(): string {
		return "Information about your system cpu.";
	}
	public name(): string {
		return "System Cpu";
	}
	supportedBrowsers: BrowserName[] = ["chromium", "chrome", "edg"];

	public getResults(): Promise<Result[]> {
		return new Promise((resolve) => {
			chrome.system.cpu.getInfo((cpu) => {
				resolve([
					new Info({
						title: "Cpu Modal Name",
						description: cpu.modelName,
						prepend: iconFromString(iconCpu),
					}),
					new Info({
						title: "Architecture",
						description: cpu.archName,
						prepend: iconFromString(iconCpu),
					}),
					new Info({
						title: "Number of Processors",
						description: cpu.numOfProcessors.toString(),
						prepend: iconFromString(iconCpu),
					}),
					new Info({
						title: "Cpu Features",
						description: cpu.features.join(", "),
						prepend: iconFromString(iconCpu),
					}),
				]);
			});
		});
	}
}
