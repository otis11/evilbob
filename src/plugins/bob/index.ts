import { Result } from "../../components/result/result";
import { DEFAULT_CONFIG, setConfig } from "../../config";
import { iconBob, iconFromString } from "../../icons";
import { NewLocales } from "../../locales/new-locales";
import { DEFAULT_USAGE, setUsage } from "../../usage";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { Plugin } from "../Plugin";
import enUS from "./locales/en-US";

const { t } = NewLocales({
	"en-US": enUS,
});

export class BobPlugin extends Plugin {
	public id(): string {
		return "bob";
	}
	public prefix?: string | undefined = "bob";
	permissions = [];
	public description(): string {
		return t("Bob.description");
	}

	public name(): string {
		return "Bob";
	}

	public async getResults(): Promise<Result[]> {
		return [
			new BobOpenOptions(),
			new BobResetOptions(),
			new BobResetUsage(),
			new BobShowUsage(),
		];
	}
}

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
			url: "/src/views/usage/index.html",
		});
		focusLastActiveWindow();
	}
}
