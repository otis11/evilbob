import { iconCpu, iconFromString } from "../../icons";
import type { BrowserName } from "../../platform";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class ResultGroupSystemCpu extends ResultGroup {
	permissions = ["system.cpu"];
	public prefix?: string | undefined = "cpu";
	description = "Information about your system cpu.";
	supportedBrowsers: BrowserName[] = ["chromium", "chrome", "edg"];

	public getResults(): Promise<Result[]> {
		return new Promise((resolve) => {
			chrome.system.cpu.getInfo((cpu) => {
				resolve([
					new ResultSystemCpu({
						title: "Cpu Modal Name",
						description: cpu.modelName,
						prepend: iconFromString(iconCpu),
					}),
					new ResultSystemCpu({
						title: "Architecture",
						description: cpu.archName,
						prepend: iconFromString(iconCpu),
					}),
					new ResultSystemCpu({
						title: "Number of Processors",
						description: cpu.numOfProcessors.toString(),
						prepend: iconFromString(iconCpu),
					}),
					new ResultSystemCpu({
						title: "Cpu Features",
						description: cpu.features.join(", "),
						prepend: iconFromString(iconCpu),
					}),
				]);
			});
		});
	}
}

export class ResultSystemCpu extends Result {
	public id(): string {
		return this.name() + this.title;
	}

	async execute(): Promise<void> {
		console.log("on select system cpu");
	}
}
