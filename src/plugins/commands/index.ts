import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import { ShortcutElement } from "../../core/components/shortcut";
import { iconConsoleLine, iconFromString } from "../../core/icons";
import type { Locale } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	prefix: "c",
	description() {
		return t("Commands.description");
	},
	name() {
		return t("Commands");
	},
	onLocalChange(locale: Locale) {
		setLocale(locale);
	},
	supportedBrowsers: ["chrome", "chromium", "edg"],

	async provideResults(): Promise<Result[]> {
		return (await chrome.commands.getAll()).map(
			(command) => new ResultCommand(command),
		);
	},
});

export class ResultCommand extends Result {
	title(): string {
		return this.command.name || "";
	}

	description(): string {
		return this.command.description || "";
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconConsoleLine);
	}

	append(): HTMLElement | undefined {
		return ShortcutElement((this.command.shortcut || "").split(""));
	}
	constructor(private command: chrome.commands.Command) {
		super();
	}

	public id(): string {
		return this.className() + this.command.name;
	}
	async run(): Promise<void> {}
}
