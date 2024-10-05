import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { Shortcut } from "../components/shortcut";
import { iconConsole } from "../icons";

export class SearchGroupShortcuts extends SearchGroup {
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
					shortcut: new Shortcut(["Ctrl", "Shift", "O"]),
				}),
			]);
		});
	}
}

export type SearchResultShortcutConfig = {
	title: string;
	description: string;
	shortcut: Shortcut;
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
