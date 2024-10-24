import { DEFAULT_CONFIG, updateConfig } from "../../config";
import { iconBob, iconFromString } from "../../icons";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class ResultGroupBob extends ResultGroup {
	permissions = [];
	description =
		"Internal Bob commands like open settings, reset settings ...";

	public async getResults(): Promise<Result[]> {
		return [new ResultBobOpenSettings(), new ResultBobResetSettings()];
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
		updateConfig(DEFAULT_CONFIG);
		window.close();
	}
}
