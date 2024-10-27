import { iconCpu, iconFromString } from "../../icons";
import { t } from "../../locale";
import type { BrowserName } from "../../platform";
import { ResultGroup } from "../result-group";
import { Info } from "../result/info";
import type { Result } from "../result/result";

export class SystemCpu extends ResultGroup {
	permissions = ["system.cpu"];
	public id(): string {
		return "system-cpu";
	}
	public prefix?: string | undefined = "cpu";
	public description(): string {
		return t("SystemCpu.description");
	}
	public name(): string {
		return t("SystemCpu");
	}
	supportedBrowsers: BrowserName[] = ["chromium", "chrome", "edg"];

	public getResults(): Promise<Result[]> {
		return new Promise((resolve) => {
			chrome.system.cpu.getInfo((cpu) => {
				resolve([
					new Info({
						title: t("CPU Modal Name"),
						description: cpu.modelName,
						prepend: iconFromString(iconCpu),
					}),
					new Info({
						title: t("Architecture"),
						description: cpu.archName,
						prepend: iconFromString(iconCpu),
					}),
					new Info({
						title: t("Number of Processors"),
						description: cpu.numOfProcessors.toString(),
						prepend: iconFromString(iconCpu),
					}),
					new Info({
						title: t("CPU Features"),
						description: cpu.features.join(", "),
						prepend: iconFromString(iconCpu),
					}),
				]);
			});
		});
	}
}
