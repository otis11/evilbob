import { defineBobPlugin } from "../../core/BobPlugin.ts";
import type { Result } from "../../core/components/result/result.ts";
import { NewUrlResult } from "../../core/components/result/simpe-result.ts";
import { ShortcutElement } from "../../core/components/shortcut.ts";
import { isChromium, isMac } from "../../core/platform.ts";

export default defineBobPlugin({
	name: () => "browser",
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
			);
		}
		return results;
	},
});
