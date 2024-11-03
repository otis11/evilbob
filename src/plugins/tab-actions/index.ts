import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import {
	iconArrowVerticalSplit,
	iconFromString,
	iconGestureTapButton,
	iconMusic,
	iconMusicOff,
	iconPin,
	iconPinOff,
	iconSortAlphabetically,
	iconTabPlus,
	iconTabRemove,
	iconWindowRestore,
} from "../../core/icons";
import type { Locale } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import { getLastActiveTab } from "../../core/util/last-active-tab";
import {
	focusLastActiveWindow,
	getLastActiveWindow,
	getLastActiveWindowTabs,
} from "../../core/util/last-active-window";
import { Tab } from "../tabs";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});
export default defineBobPlugin({
	permissions: ["tabs"],
	prefix: "a",
	icon: iconGestureTapButton,
	name() {
		return t("TabActions");
	},
	description() {
		return t("TabActions.description");
	},

	onLocalChange(locale: Locale) {
		setLocale(locale);
	},

	async provideResults(): Promise<Result[]> {
		const tabs = await chrome.tabs.query({});
		return [
			new CloseOtherTabs(),
			new SortTabsByUrl(),
			new TabDuplicate(),
			new TabMute(),
			new TabUnmute(),
			new TabPin(),
			new TabUnpin(),
			new MergeWindows(),
			new CloseBySearch(tabs),
			new SplitIntoWindows(),
		];
	},
});

class TabDuplicate extends Result {
	title(): string {
		return t("Duplicate Tab");
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconTabPlus);
	}

	async execute(): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.duplicate(lastActive.id);
			await focusLastActiveWindow();
		}
	}
}

class TabMute extends Result {
	title(): string {
		return t("Mute Tab");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconMusicOff);
	}

	async execute(): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { muted: true });
			await focusLastActiveWindow();
		}
	}
}

class TabUnmute extends Result {
	title(): string {
		return t("Unmute Tab");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconMusic);
	}

	async execute(): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { muted: false });
			await focusLastActiveWindow();
		}
	}
}

class TabPin extends Result {
	title(): string {
		return t("Pin Tab");
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconPin);
	}

	async execute(): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { pinned: true });
			await focusLastActiveWindow();
		}
	}
}

class TabUnpin extends Result {
	title(): string {
		return t("Unpin Tab");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconPinOff);
	}

	async execute(): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { pinned: false });
			await focusLastActiveWindow();
		}
	}
}

export class SortTabsByUrl extends Result {
	title(): string {
		return t("Sort tabs by url");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconSortAlphabetically);
	}
	async execute(): Promise<void> {
		const tabs = await getLastActiveWindowTabs();

		const tabsSortedByUrl = tabs.sort((a, b) => {
			if (!a.url || !b.url) {
				return 0;
			}
			if (a.url > b.url) {
				return 1;
			}
			if (a.url < b.url) {
				return -1;
			}
			return 0;
		});

		let isSortingNeeded = false;
		for (const [index, _] of tabsSortedByUrl.entries()) {
			// t1 t2 t3
			// t3 t2 t1
			// t1 t2 t3
			if (tabsSortedByUrl[index].index !== index) {
				isSortingNeeded = true;
				break;
			}
		}

		if (!isSortingNeeded) {
			alert(t("Already Sorted"));
			return;
		}

		const promises = [];
		for (const [index, tab] of tabsSortedByUrl.entries()) {
			if (tab.id) {
				promises.push(chrome.tabs.move(tab.id, { index }));
			}
		}
		await Promise.all(promises);
		await focusLastActiveWindow();
	}
}

export class MergeWindows extends Result {
	title(): string {
		return t("Merge Windows");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconWindowRestore);
	}
	async execute(): Promise<void> {
		const lastWindow = await getLastActiveWindow();
		const tabs = await chrome.tabs.query({});
		const tabsNotInLastWindow = tabs
			.filter((tab) => tab.windowId !== lastWindow.id)
			.map((w) => w.id || -1);
		await chrome.tabs.move(tabsNotInLastWindow, {
			windowId: lastWindow.id,
			index: 999,
		});
		await focusLastActiveWindow();
	}
}

export class SplitIntoWindows extends Result {
	title(): string {
		return t("SplitIntoWindows");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconArrowVerticalSplit);
	}

	async execute(): Promise<void> {
		const tabs = await getLastActiveWindowTabs();
		const promises = [];
		for (const tab of tabs) {
			promises.push(chrome.windows.create({ tabId: tab.id }));
		}
		await Promise.all(promises);
		await focusLastActiveWindow();
	}
}

export class CloseOtherTabs extends Result {
	title(): string {
		return t("CloseOtherTabs");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconTabRemove);
	}

	async execute(): Promise<void> {
		const tabs = await getLastActiveWindowTabs();
		const lastActiveTab = await getLastActiveTab();
		const promises = [];
		for (const tab of tabs) {
			if (tab.id && tab.id !== lastActiveTab?.id) {
				promises.push(chrome.tabs.remove(tab.id));
			}
		}
		await Promise.all(promises);
		await focusLastActiveWindow();
	}
}

export class CloseBySearch extends Result {
	constructor(private tabs: chrome.tabs.Tab[]) {
		super();
	}

	options(): Result[] {
		return this.tabs.map((tab) => {
			return new TabsCloseBySearch(tab);
		});
	}
	title(): string {
		return t("CloseBySearch");
	}

	description(): string {
		return t("CloseBySearch.description");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconTabRemove);
	}

	async execute(): Promise<void> {
		this.emitShowOptionsEvent();
	}
}

class TabsCloseBySearch extends Tab {
	async execute(state: BobWindowState): Promise<void> {
		const currentWindow = await chrome.windows.getCurrent();
		for (const result of state.results) {
			if (
				result instanceof Tab &&
				result.tab.id &&
				result.tab.windowId !== currentWindow.id
			) {
				await chrome.tabs.remove(result.tab.id);
			}
		}
		await focusLastActiveWindow();
	}
}
