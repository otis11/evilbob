import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import { DEFAULT_CONFIG, setConfig } from "../../core/config";
import { iconBob, iconFromString } from "../../core/icons";
import { NewLocales } from "../../core/locales/new-locales";
import { DEFAULT_USAGE, setUsage } from "../../core/usage";
import { focusLastActiveWindow } from "../../core/util/last-active-window";
import enUS from "./locales/en-US";

const { t } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	name() {
		return "Bob";
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
	async execute(): Promise<void> {
		chrome.runtime.openOptionsPage();
		focusLastActiveWindow();
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

	async execute(): Promise<void> {
		setConfig(DEFAULT_CONFIG);
		focusLastActiveWindow();
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
	async execute(): Promise<void> {
		setUsage(DEFAULT_USAGE);
		focusLastActiveWindow();
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

	async execute(): Promise<void> {
		chrome.tabs.create({
			url: "/src/core/views/usage/index.html",
		});
		focusLastActiveWindow();
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

	async execute(): Promise<void> {
		chrome.tabs.create({ url: "/src/core/views/plugins/index.html" });
		focusLastActiveWindow();
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
	async execute(state: BobWindowState): Promise<void> {
		chrome.tabs.create({
			url: "https://otis11.github.io/bob-command-palette/#faq",
		});
		focusLastActiveWindow();
	}
}
