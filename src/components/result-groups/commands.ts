import { iconBob, iconConsoleLine, iconFromString } from "../../icons";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { Shortcut } from "../shortcut/shortcut";

export class ResultGroupCommands extends ResultGroup {
	prefix = "c";
	permissions = [];
	description = "Available commands from extensions.";

	public async getResults(): Promise<Result[]> {
		return (await chrome.commands.getAll()).map(
			(command) => new ResultCommand(command),
		);
	}
}

export class ResultCommand extends Result {
	constructor(private command: chrome.commands.Command) {
		super({
			title: command.name || "",
			description: command.description || "",
			prepend: iconFromString(iconConsoleLine),
			append: new Shortcut(
				(command.shortcut || "").split(""),
			).asHtmlElement(),
		});
	}

	public id(): string {
		return this.name() + this.command.name;
	}
	async execute(): Promise<void> {}
}
