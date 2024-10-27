import { iconConsoleLine, iconFromString } from "../../icons";
import { t } from "../../locale";
import type { BrowserName } from "../../platform";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { ShortcutElement } from "../shortcut/shortcut";

export class Commands extends ResultGroup {
	prefix = "c";
	permissions = [];
	public id(): string {
		return "commands";
	}
	public description(): string {
		return t("Commands.description");
	}
	public name(): string {
		return t("Commands");
	}
	public supportedBrowsers: BrowserName[] = ["chrome", "chromium", "edg"];

	public async getResults(): Promise<Result[]> {
		return (await chrome.commands.getAll()).map(
			(command) => new ResultCommand(command),
		);
	}
}

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
		return new ShortcutElement(
			(this.command.shortcut || "").split(""),
		).asHtmlElement();
	}
	constructor(private command: chrome.commands.Command) {
		super();
	}

	public id(): string {
		return this.name() + this.command.name;
	}
	async execute(): Promise<void> {}
}
