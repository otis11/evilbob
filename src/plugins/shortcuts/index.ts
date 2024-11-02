import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import { ShortcutElement } from "../../core/components/shortcut/shortcut";
import { iconFromString, iconKeyboardVariant } from "../../core/icons";
import { NewLocales } from "../../core/locales/new-locales";
import { isFirefox, isMac } from "../../core/platform";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	description() {
		return t("Shortcuts.description");
	},
	name() {
		return t("Shortcuts");
	},
	prefix: "sc",
	icon: iconKeyboardVariant,

	async provideResults(): Promise<Result[]> {
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
	},
});

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

	prepend(): HTMLElement | undefined {
		return iconFromString(iconKeyboardVariant);
	}

	async execute(): Promise<void> {}
}
