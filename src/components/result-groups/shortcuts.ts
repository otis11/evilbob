import { t } from "../../locale";
import { isFirefox, isMac } from "../../platform";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { ShortcutElement } from "../shortcut/shortcut";

export class Shortcuts extends ResultGroup {
	public id(): string {
		return "shortcuts";
	}
	public description(): string {
		return t("Shortcuts.description");
	}
	public name(): string {
		return t("Shortcuts");
	}
	public prefix?: string | undefined = "sc";

	public async getResults(): Promise<Result[]> {
		const shortcuts = [
			new Shortcut({
				title: t("Open History"),
				shortcut: isMac
					? new ShortcutElement(["⌘", "Y"])
					: new ShortcutElement(["Ctrl", "H"]),
			}),
			// windows
			new Shortcut({
				title: t("New Icognito Window"),
				shortcut: isMac
					? new ShortcutElement(["⌘", "Shift", "N"])
					: isFirefox
						? new ShortcutElement(["Ctrl", "Shift", "P"])
						: new ShortcutElement(["Ctrl", "Shift", "N"]),
			}),
			// // tabs
			new Shortcut({
				title: t("New Tab"),
				shortcut: isMac
					? new ShortcutElement(["⌘", "T"])
					: new ShortcutElement(["Ctrl", "T"]),
			}),
			new Shortcut({
				title: t("Close Tab"),
				shortcut: isMac
					? new ShortcutElement(["⌘", "W"])
					: new ShortcutElement(["Ctrl", "W"]),
			}),
			new Shortcut({
				title: t("Reopen Tabs"),
				shortcut: isMac
					? new ShortcutElement(["⌘", "Shift", "T"])
					: new ShortcutElement(["Ctrl", "Shift", "T"]),
			}),
			// bookmarks
			new Shortcut({
				title: t("Save Bookmark"),
				shortcut: isMac
					? new ShortcutElement(["⌘", "D"])
					: new ShortcutElement(["Ctrl", "D"]),
			}),
			new Shortcut({
				title: t("Open Bookmarks"),
				shortcut: isMac
					? new ShortcutElement(["⌘", "Option", "B"])
					: new ShortcutElement(["Ctrl", "Shift", "O"]),
			}),
			// search bar
			new Shortcut({
				title: t("Focus Search"),
				shortcut: isMac
					? new ShortcutElement(["Ctrl", "I"])
					: new ShortcutElement(["Ctrl", "L"]),
			}),
		];
		if (!isMac) {
			shortcuts.push(
				new Shortcut({
					title: t("Toggle Fullscreen"),
					shortcut: new ShortcutElement(["F11"]),
				}),
			);
		}
		return shortcuts;
	}
}

export type ResultShortcutConfig = {
	title: string;
	description?: string;
	shortcut: ShortcutElement;
};

export class Shortcut extends Result {
	title(): string {
		return this.config.title;
	}
	description(): string {
		return this.config.description || "";
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

	async execute(): Promise<void> {}
}
