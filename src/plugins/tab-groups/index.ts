import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import { NewLocales } from "../../core/locales/new-locales";
import {
	focusLastActiveWindow,
	getLastActiveWindow,
} from "../../core/util/last-active-window";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});
export default defineBobPlugin({
	prefix: "tg",
	description() {
		return t("TabGroups.description");
	},
	name() {
		return t("TabGroups");
	},
	permissions: ["tabGroups"],
	supportedBrowsers: ["chrome", "chromium", "edg"],

	async provideResults(): Promise<Result[]> {
		const groups = await chrome.tabGroups.query({});
		return groups.map((group) => new TabGroup(group));
	},
});

class TabGroup extends Result {
	title(): string {
		return this.group.title || "";
	}

	prepend(): HTMLElement | undefined {
		const groupColorElement = document.createElement("div");
		groupColorElement.style.background = this.group.color;
		groupColorElement.style.height = "24px";
		groupColorElement.style.width = "24px";
		groupColorElement.style.borderRadius = "50%";
		return groupColorElement;
	}
	constructor(private group: chrome.tabGroups.TabGroup) {
		super();
	}

	async execute(): Promise<void> {
		const tabs = await chrome.tabs.query({ groupId: this.group.id });
		const lastActiveWindow = await getLastActiveWindow();
		if (tabs[0]?.id) {
			await chrome.tabs.highlight({
				tabs: [tabs[0].index],
				windowId: lastActiveWindow.id,
			});
		}
		focusLastActiveWindow();
	}
}
