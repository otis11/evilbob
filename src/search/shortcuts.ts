import { iconConsole } from "../icons";
import { SearchResult } from "./search-result";
import { SearchResultGroup } from "./search-result-group";

export class SearchResultGroupShortcuts extends SearchResultGroup {
	constructor() {
		super({
			name: "shortcuts",
		});
	}

	public getResults(): Promise<SearchResult[]> {
		return new Promise((resolve) => {
			resolve([
				new SearchResultShortcut({
					title: "Open Bookmarks",
					description: "Open Bookmarks",
					shortcut: ["Ctrl", "Shift", "O"],
				}),
			]);
		});
	}
}

export type SearchResultShortcutConfig = {
	title: string;
	description: string;
	shortcut: string[];
};

export class SearchResultShortcut extends SearchResult {
	constructor(config: SearchResultShortcutConfig) {
		super({
			title: config.title,
			description: config.description,
			searchText: `${config.title} config.description`,
			icon: iconConsole,
			shortcut: config.shortcut,
		});
	}

	onSelect(): void {
		console.log("shortcut selected", this);
	}
}
