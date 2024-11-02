import { defineBobPlugin } from "../../core/BobPlugin";
import { Info } from "../../core/components/result/info";
import type { Result } from "../../core/components/result/result";
import { iconFromString, iconNas } from "../../core/icons";
import { NewLocales } from "../../core/locales/new-locales";
import { formatBytes } from "../../core/util/format-bytes";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	permissions: ["system.storage"],
	description() {
		return t("SystemStorage.description");
	},
	name() {
		return t("SystemStorage");
	},
	supportedBrowsers: ["chromium", "chrome", "edg"],
	prefix: "sto",
	icon: iconNas,

	async provideResults(): Promise<Result[]> {
		const devices = await chrome.system.storage.getInfo();
		return devices.map(
			(device) =>
				new Info({
					title: device.name,
					description: `${formatBytes(device.capacity)} GB - ${device.type}`,
					prepend: iconFromString(iconNas),
				}),
		);
	},
});
