import { iconBob, iconConsoleLine, iconFromString } from "../../icons";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";
import { Shortcut } from "../shortcut/shortcut";

export class SearchGroupCommands extends SearchGroup {
	constructor() {
		super({
			filter: "!c",
			name: "commands",
			permissions: [],
			description: "Available commands from extensions.",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		return (await chrome.commands.getAll()).map(
			(command) => new SearchResultCommand(command),
		);
	}
}

export class SearchResultCommand extends SearchResult {
	constructor(private command: chrome.commands.Command) {
		console.log(command.shortcut);
		super({
			title: command.name || "",
			searchText: `${command.name} ${command.description}`,
			description: command.description || "",
			prepend: iconFromString(iconConsoleLine),
			append: new Shortcut(
				(command.shortcut || "").split(""),
			).asHtmlElement(),
		});
	}
	async onSelect(): Promise<void> {}
}
