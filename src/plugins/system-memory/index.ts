import { defineBobPlugin } from "../../core/BobPlugin";
import { Info } from "../../core/components/result/info";
import type { Result } from "../../core/components/result/result";
import { iconCpu, iconFromString } from "../../core/icons";
import { NewLocales } from "../../core/locales/new-locales";
import { formatBytes } from "../../core/util/format-bytes";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	permissions: ["system.memory"],
	description(): string {
		return t("SystemMemory.description");
	},
	name(): string {
		return t("SystemMemory");
	},
	supportedBrowsers: ["chromium", "chrome", "edg"],
	prefix: "mem",
	icon: iconCpu,

	async provideResults(): Promise<Result[]> {
		const memory = await chrome.system.memory.getInfo();
		return [
			new Info({
				title: t("Memory"),
				description: `${formatBytes(memory.capacity - memory.availableCapacity)}/${formatBytes(memory.capacity)} GB`,
				prepend: iconFromString(iconCpu),
			}),
		];
	},
});
