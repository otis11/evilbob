import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import { DEFAULT_CONFIG, setConfig } from "../../core/config";
import { iconBob, iconFromString } from "../../core/icons";
import type { Locale } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import { DEFAULT_USAGE, setUsage } from "../../core/usage";
import { focusLastActiveWindow } from "../../core/util/last-active-window";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	name() {
		return "Bob";
	},
	onLocalChange(locale: Locale) {
		setLocale(locale);
	},
	prefix: "bob",
	description() {
		return t("Bob.description");
	},
	async provideResults() {
		return [
			new BobOpenOptions(),
			new BobResetOptions(),
			new BobOpenPlugins(),
			new BobResetUsage(),
			new BobShowUsage(),
			new BobHelp(),
		];
	},
	icon: iconBob,
});

class BobOpenOptions extends Result {
	title(): string {
		return t("BobOpenOptions.title");
	}

	description(): string {
		return t("BobOpenOptions.description");
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconBob);
	}
	async run(): Promise<void> {
		await chrome.runtime.openOptionsPage();
		await focusLastActiveWindow();
	}
}

class BobResetOptions extends Result {
	title(): string {
		return t("BobResetOptions.title");
	}
	description(): string {
		return t("BobResetOptions.description");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconBob);
	}

	async run(): Promise<void> {
		await setConfig(DEFAULT_CONFIG);
		await focusLastActiveWindow();
	}
}

class BobResetUsage extends Result {
	title(): string {
		return t("BobResetUsage.title");
	}
	description(): string {
		return t("BobResetUsage.description");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconBob);
	}
	async run(): Promise<void> {
		await setUsage(DEFAULT_USAGE);
		await focusLastActiveWindow();
	}
}
class BobShowUsage extends Result {
	title(): string {
		return t("BobShowUsage.title");
	}
	description(): string {
		return t("BobShowUsage.description");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconBob);
	}

	async run(): Promise<void> {
		await chrome.tabs.create({
			url: "/src/core/views/usage/index.html",
		});
		await focusLastActiveWindow();
	}
}

class BobOpenPlugins extends Result {
	title(): string {
		return t("BobOpenPlugins.title");
	}
	description(): string {
		return t("BobOpenPlugins.description");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconBob);
	}

	async run(): Promise<void> {
		await chrome.tabs.create({ url: "/src/core/views/plugins/index.html" });
		await focusLastActiveWindow();
	}
}

class BobHelp extends Result {
	title(): string {
		return "Bob Help";
	}
	description(): string {
		return "Help & FAQ";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconBob);
	}
	async run(): Promise<void> {
		await chrome.tabs.create({
			url: "https://otis11.github.io/bob-command-palette/#faq",
		});
		await focusLastActiveWindow();
	}
}
