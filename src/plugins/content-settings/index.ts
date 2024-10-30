import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import type { Tag } from "../../core/components/tags/tags";
import { coreI18n } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import { getLastActiveTab } from "../../core/util/last-active-tab";
import { focusLastActiveWindow } from "../../core/util/last-active-window";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	prefix: "cs",
	permissions: ["contentSettings"],
	description() {
		return t("ContentSettings.description");
	},

	name() {
		return t("ContentSettings");
	},
	supportedBrowsers: ["chrome", "chromium", "edg"],
	async provideResults(): Promise<Result[]> {
		const tab = await getLastActiveTab();
		const results: Result[] = [];
		if (tab?.url) {
			const url = tab.url;
			const javascript = (await new Promise((resolve) => {
				chrome.contentSettings.javascript.get(
					{ primaryUrl: url },
					resolve,
				);
			})) as chrome.contentSettings.JavascriptSetDetails;
			results.push(new CSJavascript(javascript));
		}

		return results;
	},
});
class CSJavascript extends Result {
	title(): string {
		return t("CSJavascript.title", {
			enableDisable:
				this.javascript.setting === "allow"
					? coreI18n.t("Disable")
					: coreI18n.t("Enable"),
		});
	}

	description(): string {
		return t("CSJavascript.description");
	}

	tags(): Tag[] {
		return [
			{
				text:
					this.javascript.setting === "allow"
						? coreI18n.t("Enabled")
						: coreI18n.t("Disabled"),
				type: this.javascript.setting === "allow" ? "success" : "error",
			},
		];
	}
	constructor(
		private javascript: chrome.contentSettings.JavascriptSetDetails,
	) {
		super();
	}

	async execute(): Promise<void> {
		const tab = await getLastActiveTab();
		if (tab?.url) {
			const url = new URL(tab.url);
			url.pathname = "/*";
			chrome.contentSettings.javascript.set(
				{
					primaryPattern: url.href,
					setting:
						this.javascript.setting === "allow" ? "block" : "allow",
				},
				() => focusLastActiveWindow(),
			);
		}
	}
}
