import { defineBobPlugin } from "../../core/BobPlugin";
import { Info } from "../../core/components/result/info";
import type { Result } from "../../core/components/result/result";
import { iconCpu, iconFromString } from "../../core/icons";
import { NewLocales } from "../../core/locales/new-locales";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	icon: iconCpu,
	permissions: ["system.cpu"],
	prefix: "cpu",
	description() {
		return t("SystemCpu.description");
	},
	name() {
		return t("SystemCpu");
	},
	supportedBrowsers: ["chromium", "chrome", "edg"],

	async provideResults(): Promise<Result[]> {
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
	},
});
