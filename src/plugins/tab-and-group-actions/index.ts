import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import type { Locale } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import {
	focusLastActiveWindow,
	getLastActiveWindow,
	getLastActiveWindowTabs,
} from "../../core/util/last-active-window";
import { getSecondLevelDomain } from "../../core/util/url";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});
export default defineBobPlugin({
	permissions: ["tabs", "tabGroups"],
	prefix: "tga",
	description() {
		return t("TabGroupActions.description");
	},
	name() {
		return t("TabGroupActions");
	},
	onLocalChange(locale: Locale) {
		setLocale(locale);
	},
	supportedBrowsers: ["chrome", "chromium", "edg"],

	async provideResults(): Promise<Result[]> {
		return [new GroupTabsByDomain(), new UngroupTabs()];
	},
});

class GroupTabsByDomain extends Result {
	title(): string {
		return t("GroupTabsByDomain");
	}
	public async run(): Promise<void> {
		const tabs = await getLastActiveWindowTabs();
		const lastActiveWindow = await getLastActiveWindow();

		const domainMap: Record<string, chrome.tabs.Tab[]> = {};

		for (const tab of tabs) {
			if (!tab.url) {
				continue;
			}

			const secondLevelDomain = getSecondLevelDomain(tab.url);
			if (domainMap[secondLevelDomain]) {
				domainMap[secondLevelDomain].push(tab);
			} else {
				domainMap[secondLevelDomain] = [tab];
			}
		}

		for (const key of Object.keys(domainMap)) {
			const groupId = await chrome.tabs.group({
				createProperties: { windowId: lastActiveWindow.id },
				tabIds: domainMap[key]
					.map((tab) => tab.id)
					.filter((id) => id !== undefined),
			});
			await chrome.tabGroups.update(groupId, {
				title: key,
			});
		}

		await focusLastActiveWindow();
	}
}

class UngroupTabs extends Result {
	title(): string {
		return t("Ungroup Tabs");
	}

	async run(): Promise<void> {
		const tabs = await getLastActiveWindowTabs();
		await chrome.tabs.ungroup(
			tabs.map((tab) => tab.id).filter((id) => id !== undefined),
		);
		await focusLastActiveWindow();
	}
}
