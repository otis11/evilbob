import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import type { Search } from "../../core/components/search";
import type { Tag } from "../../core/components/tags/tags";
import { NewLocales } from "../../core/locales/new-locales";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	permissions: ["sessions"],
	description(): string {
		return t("SessionDevices.description");
	},
	name(): string {
		return t("SessionDevices.name");
	},
	supportedBrowsers: ["chrome", "chromium", "edg"],
	prefix: "sd",

	async provideResults(): Promise<Result[]> {
		const devices = await chrome.sessions.getDevices();
		return devices.map((device) => new SessionDevice(device));
	},
});

export class SessionDevice extends Result {
	title(): string {
		return this.device.deviceName;
	}

	tags(): Tag[] {
		return [
			{
				text: t("SessionsCount", {
					count: this.device.sessions.length,
				}),
				type: "default",
			},
		];
	}
	constructor(private device: chrome.sessions.Device) {
		super();
	}
	async execute(search: Search, results: Result[]): Promise<void> {}
}
