import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import type { Tag } from "../../core/components/tags/tags";
import { iconDevices, iconFromString } from "../../core/icons";
import type { Locale } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	icon: iconDevices,
	permissions: ["sessions"],
	description(): string {
		return t("SessionDevices.description");
	},
	name(): string {
		return t("SessionDevices.name");
	},
	supportedBrowsers: ["chrome", "chromium", "edg"],
	prefix: "sd",
	onLocalChange(locale: Locale) {
		setLocale(locale);
	},

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
	prepend(): HTMLElement | undefined {
		return iconFromString(iconDevices);
	}
	constructor(private device: chrome.sessions.Device) {
		super();
	}
	async run(): Promise<void> {}
}
