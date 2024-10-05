import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { Shortcut } from "../components/shortcut";
import { iconConsole } from "../icons";
import { isFirefox, isMac } from "../platform";

export class SearchGroupShortcuts extends SearchGroup {
	constructor() {
		super({
			name: "shortcuts",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const shortcuts = [
			new SearchResultShortcut({
				title: "Open History",
				description: "Open History",
				shortcut: isMac
					? new Shortcut(["⌘", "Y"])
					: new Shortcut(["Ctrl", "H"]),
			}),
			// windows
			new SearchResultShortcut({
				title: "New Icognito Window",
				description: "Open a new window in Incognito mode",
				shortcut: isMac
					? new Shortcut(["⌘", "Shift", "N"])
					: isFirefox
						? new Shortcut(["Ctrl", "Shift", "P"])
						: new Shortcut(["Ctrl", "Shift", "N"]),
			}),
			// tabs
			new SearchResultShortcut({
				title: "New Tab",
				description: "Open a new tab",
				shortcut: isMac
					? new Shortcut(["⌘", "T"])
					: new Shortcut(["Ctrl", "T"]),
			}),
			new SearchResultShortcut({
				title: "Close Tab",
				description: "Close the current tab",
				shortcut: isMac
					? new Shortcut(["⌘", "W"])
					: new Shortcut(["Ctrl", "W"]),
			}),
			new SearchResultShortcut({
				title: "Reopen Tabs",
				description:
					"Reopen previously closed tabs in the order that they were closed",
				shortcut: isMac
					? new Shortcut(["⌘", "Shift", "T"])
					: new Shortcut(["Ctrl", "Shift", "T"]),
			}),
			// bookmarks
			new SearchResultShortcut({
				title: "Save Bookmark",
				description: "Save the current page as a bookmark",
				shortcut: isMac
					? new Shortcut(["⌘", "D"])
					: new Shortcut(["Ctrl", "D"]),
			}),
			new SearchResultShortcut({
				title: "Open Bookmarks",
				description: "Open Bookmarks",
				shortcut: isMac
					? new Shortcut(["⌘", "Option", "B"])
					: new Shortcut(["Ctrl", "Shift", "O"]),
			}),
			// search bar
			new SearchResultShortcut({
				title: "Focus Search",
				description: "Put a cursor in the search bar",
				shortcut: isMac
					? new Shortcut(["Ctrl", "I"])
					: new Shortcut(["Ctrl", "L"]),
			}),
			// other
		];
		if (!isMac) {
			shortcuts.push(
				new SearchResultShortcut({
					title: "Toggle Fullscreen",
					description: "Turn on/off full-screen mode",
					shortcut: new Shortcut(["F11"]),
				}),
			);
		}
		return shortcuts;
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
			searchText: `${config.title} ${config.description}`,
			icon: iconConsole,
			shortcut: config.shortcut,
		});
	}

	onSelect(): void {
		console.log("shortcut selected", this);
	}
}
