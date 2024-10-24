import { DEFAULT_CONFIG, setConfig } from "../../config";
import { iconBob, iconFromString } from "../../icons";
import { DEFAULT_USAGE, setUsage } from "../../usage";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class ResultGroupBob extends ResultGroup {
	permissions = [];
	description =
		"Internal Bob commands like open settings, reset settings ...";

	public async getResults(): Promise<Result[]> {
		return [
			new ResultBobOpenSettings(),
			new ResultBobResetSettings(),
			new ResultBobResetUsage(),
			new ResultBobShowUsage(),
		];
	}
}

export class ResultBobOpenSettings extends Result {
	constructor() {
		super({
			title: "Bob Options",
			description: "Change me here!",
			prepend: iconFromString(iconBob),
		});
	}
	async execute(): Promise<void> {
		chrome.runtime.openOptionsPage();
		window.close();
	}
}

export class ResultBobResetSettings extends Result {
	constructor() {
		super({
			title: "Bob Reset Settings",
			description: "Reset my settings to default",
			prepend: iconFromString(iconBob),
		});
	}
	async execute(): Promise<void> {
		setConfig(DEFAULT_CONFIG);
		window.close();
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
		window.close();
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
			url: "views/usage/index.html",
		});
		window.close();
	}
}
