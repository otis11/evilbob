import { isFirefox, isMac } from "../../platform";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { ShortcutElement } from "../shortcut/shortcut";

export class Shortcuts extends ResultGroup {
	public description(): string {
		return "Search for browser shortcuts.";
	}
	public name(): string {
		return "Shortcuts";
	}
	public prefix?: string | undefined = "sc";

	public async getResults(): Promise<Result[]> {
		const shortcuts = [
			new Shortcut({
				title: "Open History",
				description: "Open History",
				shortcut: isMac
					? new ShortcutElement(["⌘", "Y"])
					: new ShortcutElement(["Ctrl", "H"]),
			}),
			// windows
			new Shortcut({
				title: "New Icognito Window",
				description: "Open a new window in Incognito mode",
				shortcut: isMac
					? new ShortcutElement(["⌘", "Shift", "N"])
					: isFirefox
						? new ShortcutElement(["Ctrl", "Shift", "P"])
						: new ShortcutElement(["Ctrl", "Shift", "N"]),
			}),
			// // tabs
			new Shortcut({
				title: "New Tab",
				description: "Open a new tab",
				shortcut: isMac
					? new ShortcutElement(["⌘", "T"])
					: new ShortcutElement(["Ctrl", "T"]),
			}),
			new Shortcut({
				title: "Close Tab",
				description: "Close the current tab",
				shortcut: isMac
					? new ShortcutElement(["⌘", "W"])
					: new ShortcutElement(["Ctrl", "W"]),
			}),
			new Shortcut({
				title: "Reopen Tabs",
				description:
					"Reopen previously closed tabs in the order that they were closed",
				shortcut: isMac
					? new ShortcutElement(["⌘", "Shift", "T"])
					: new ShortcutElement(["Ctrl", "Shift", "T"]),
			}),
			// bookmarks
			new Shortcut({
				title: "Save Bookmark",
				description: "Save the current page as a bookmark",
				shortcut: isMac
					? new ShortcutElement(["⌘", "D"])
					: new ShortcutElement(["Ctrl", "D"]),
			}),
			new Shortcut({
				title: "Open Bookmarks",
				description: "Open Bookmarks",
				shortcut: isMac
					? new ShortcutElement(["⌘", "Option", "B"])
					: new ShortcutElement(["Ctrl", "Shift", "O"]),
			}),
			// search bar
			new Shortcut({
				title: "Focus Search",
				description: "Put a cursor in the search bar",
				shortcut: isMac
					? new ShortcutElement(["Ctrl", "I"])
					: new ShortcutElement(["Ctrl", "L"]),
			}),
		];
		if (!isMac) {
			shortcuts.push(
				new Shortcut({
					title: "Toggle Fullscreen",
					description: "Turn on/off full-screen mode",
					shortcut: new ShortcutElement(["F11"]),
				}),
			);
		}
		return shortcuts;
	}
}

export type ResultShortcutConfig = {
	title: string;
	description: string;
	shortcut: ShortcutElement;
};

export class Shortcut extends Result {
	title(): string {
		return this.config.title;
	}
	description(): string {
		return this.config.description;
	}
	append(): HTMLElement | undefined {
		return this.config.shortcut.asHtmlElement();
	}
	constructor(private config: ResultShortcutConfig) {
		super();
	}

	public id(): string {
		return this.name() + this.title();
	}

	async execute(): Promise<void> {
		console.log("shortcut selected", this);
	}
}
