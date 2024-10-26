import { DEFAULT_CONFIG, setConfig } from "../../config";
import { iconBob, iconFromString } from "../../icons";
import { t } from "../../locale";
import { DEFAULT_USAGE, setUsage } from "../../usage";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class Bob extends ResultGroup {
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

export class BobOpenOptions extends Result {
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

export class BobResetOptions extends Result {
	title(): string {
		return "Bob Reset Options";
	}
	description(): string {
		return "Reset my options to default. Settings";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconBob);
	}

	async execute(): Promise<void> {
		setConfig(DEFAULT_CONFIG);
		focusLastActiveWindow();
	}
}

export class BobResetUsage extends Result {
	title(): string {
		return "Bob Reset Usage";
	}
	description(): string {
		return "Reset my usage to default";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconBob);
	}
	async execute(): Promise<void> {
		setUsage(DEFAULT_USAGE);
		focusLastActiveWindow();
	}
}

export class BobShowUsage extends Result {
	title(): string {
		return "Bob Show Usage";
	}
	description(): string {
		return "Show my bob usage.";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconBob);
	}

	async execute(): Promise<void> {
		chrome.tabs.create({
			url: "src/views/usage/index.html",
		});
		focusLastActiveWindow();
	}
}
