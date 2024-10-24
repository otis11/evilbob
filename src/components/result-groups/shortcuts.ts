import { isFirefox, isMac } from "../../platform";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { Shortcut } from "../shortcut/shortcut";

export class ResultGroupShortcuts extends ResultGroup {
	description = "Search for browser shortcuts.";

	public async getResults(): Promise<Result[]> {
		const shortcuts = [
			new ResultShortcut({
				title: "Open History",
				description: "Open History",
				shortcut: isMac
					? new Shortcut(["⌘", "Y"])
					: new Shortcut(["Ctrl", "H"]),
			}),
			// windows
			new ResultShortcut({
				title: "New Icognito Window",
				description: "Open a new window in Incognito mode",
				shortcut: isMac
					? new Shortcut(["⌘", "Shift", "N"])
					: isFirefox
						? new Shortcut(["Ctrl", "Shift", "P"])
						: new Shortcut(["Ctrl", "Shift", "N"]),
			}),
			// // tabs
			// new ResultShortcut({
			// 	title: "New Tab",
			// 	description: "Open a new tab",
			// 	shortcut: isMac
			// 		? new Shortcut(["⌘", "T"])
			// 		: new Shortcut(["Ctrl", "T"]),
			// }),
			// new ResultShortcut({
			// 	title: "Close Tab",
			// 	description: "Close the current tab",
			// 	shortcut: isMac
			// 		? new Shortcut(["⌘", "W"])
			// 		: new Shortcut(["Ctrl", "W"]),
			// }),
			// new ResultShortcut({
			// 	title: "Reopen Tabs",
			// 	description:
			// 		"Reopen previously closed tabs in the order that they were closed",
			// 	shortcut: isMac
			// 		? new Shortcut(["⌘", "Shift", "T"])
			// 		: new Shortcut(["Ctrl", "Shift", "T"]),
			// }),
			// // bookmarks
			// new ResultShortcut({
			// 	title: "Save Bookmark",
			// 	description: "Save the current page as a bookmark",
			// 	shortcut: isMac
			// 		? new Shortcut(["⌘", "D"])
			// 		: new Shortcut(["Ctrl", "D"]),
			// }),
			// new ResultShortcut({
			// 	title: "Open Bookmarks",
			// 	description: "Open Bookmarks",
			// 	shortcut: isMac
			// 		? new Shortcut(["⌘", "Option", "B"])
			// 		: new Shortcut(["Ctrl", "Shift", "O"]),
			// }),
			// // search bar
			// new ResultShortcut({
			// 	title: "Focus Search",
			// 	description: "Put a cursor in the search bar",
			// 	shortcut: isMac
			// 		? new Shortcut(["Ctrl", "I"])
			// 		: new Shortcut(["Ctrl", "L"]),
			// }),
			// other
		];
		if (!isMac) {
			shortcuts.push(
				new ResultShortcut({
					title: "Toggle Fullscreen",
					description: "Turn on/off full-screen mode",
					shortcut: new Shortcut(["F11"]),
				}),
			);
		}
		return shortcuts;
	}
}

export type ResultShortcutConfig = {
	title: string;
	description: string;
	shortcut: Shortcut;
};

export class ResultShortcut extends Result {
	constructor(config: ResultShortcutConfig) {
		super({
			title: config.title,
			description: config.description,
			append: config.shortcut.asHtmlElement(),
		});
	}

	public id(): string {
		return this.name() + this.title;
	}

	async execute(): Promise<void> {
		console.log("shortcut selected", this);
	}
}
