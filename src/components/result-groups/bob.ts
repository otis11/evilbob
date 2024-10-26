import { DEFAULT_CONFIG, setConfig } from "../../config";
import { iconBob, iconFromString } from "../../icons";
import { DEFAULT_USAGE, setUsage } from "../../usage";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class ResultGroupBob extends ResultGroup {
	public prefix?: string | undefined = "bob";
	permissions = [];
	description =
		"Internal Bob commands like open settings, reset settings ...";

	public async getResults(): Promise<Result[]> {
		return [
			new ResultBobOpenOptions(),
			new ResultBobResetOptions(),
			new ResultBobResetUsage(),
			new ResultBobShowUsage(),
		];
	}
}

export class ResultBobOpenOptions extends Result {
	constructor() {
		super({
			title: "Bob Options",
			description: "Change me here! Settings",
			prepend: iconFromString(iconBob),
		});
	}
	async execute(): Promise<void> {
		chrome.runtime.openOptionsPage();
		focusLastActiveWindow();
	}
}

export class ResultBobResetOptions extends Result {
	constructor() {
		super({
			title: "Bob Reset Options",
			description: "Reset my options to default. Settings",
			prepend: iconFromString(iconBob),
		});
	}
	async execute(): Promise<void> {
		setConfig(DEFAULT_CONFIG);
		focusLastActiveWindow();
	}
}

export class ResultBobResetUsage extends Result {
	constructor() {
		super({
			title: "Bob Reset Usage",
			description: "Reset my usage to default",
			prepend: iconFromString(iconBob),
		});
	}
	async execute(): Promise<void> {
		setUsage(DEFAULT_USAGE);
		focusLastActiveWindow();
	}
}

export class ResultBobShowUsage extends Result {
	constructor() {
		super({
			title: "Bob Show Usage",
			description: "Show my bob usage.",
			prepend: iconFromString(iconBob),
		});
	}
	async execute(): Promise<void> {
		chrome.tabs.create({
			url: "src/views/usage/index.html",
		});
		focusLastActiveWindow();
	}
}
