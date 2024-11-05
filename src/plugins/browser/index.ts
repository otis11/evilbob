import { defineBobPlugin } from "../../core/BobPlugin.ts";
import type { Result } from "../../core/components/result/result.ts";
import { NewUrlResult } from "../../core/components/result/simpe-result.ts";
import { ShortcutElement } from "../../core/components/shortcut.ts";
import { isChromium, isMac } from "../../core/platform.ts";

export default defineBobPlugin({
	name: () => "Browser Settings",
	prefix: "cfg",
	supportedBrowsers: ["chrome", "chromium", "edg"],
	async provideResults(): Promise<Result[]> {
		const results = [];
		if (isChromium) {
			results.push(
				NewUrlResult({
					url: "chrome://history",
					title: "Open History",
					append: isMac
						? ShortcutElement(["⌘", "Y"])
						: ShortcutElement(["Ctrl", "H"]),
				}),
				NewUrlResult({
					url: "chrome://extensions",
					title: "Open Extensions/Addons",
				}),
				NewUrlResult({
					url: "chrome://extensions/shortcuts",
					title: "Open Extension Shortcuts",
				}),
				NewUrlResult({
					url: "chrome://password-manager/passwords",
					title: "Open Passwords",
				}),
				NewUrlResult({
					url: "chrome://downloads",
					title: "Open Downloads",
					append: isMac
						? ShortcutElement(["⌘", "⌥", "L"])
						: ShortcutElement(["Ctrl", "J"]),
				}),
				NewUrlResult({
					url: "chrome://bookmarks",
					title: "Open Bookmarks",
					append: isMac
						? ShortcutElement(["⌘", "⌥", "B"])
						: ShortcutElement(["Ctrl", "Shift", "O"]),
				}),
				NewUrlResult({
					title: "Open Browser Settings",
					url: "chrome://settings",
				}),
			);
		}
		return results;
	},
});
