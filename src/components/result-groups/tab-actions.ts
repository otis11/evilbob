import {
	iconArrowVerticalSplit,
	iconFromString,
	iconMusic,
	iconMusicOff,
	iconPin,
	iconPinOff,
	iconSortAlphabetically,
	iconTabPlus,
	iconTabRemove,
	iconWindowRestore,
} from "../../icons";
import { getLastActiveTab } from "../../util/last-active-tab";
import {
	focusLastActiveWindow,
	getLastActiveWindow,
	getLastActiveWindowTabs,
} from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";
import { Tab } from "./tabs";

export class TabActions extends ResultGroup {
	permissions = ["tabs"];
	prefix = "a";
	public name(): string {
		return "Tab Actions";
	}
	public description(): string {
		return "Interact with browser tabs. Sort, merge, duplicate...";
	}

	public async getResults(): Promise<Result[]> {
		return [
			new CloseOtherTabs(),
			new SortTabsByUrl(),
			new TabDuplicate(),
			new TabMute(),
			new TabUnmute(),
			new TabPin(),
			new TabUnpin(),
			new MergeWindows(),
			new CloseBySearch(),
			new SplitIntoWindows(),
		];
	}
}

class TabDuplicate extends Result {
	title(): string {
		return "Duplicate Tab";
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconTabPlus);
	}

	async execute(search: Search): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.duplicate(lastActive.id);
			focusLastActiveWindow();
		}
	}
}

class TabMute extends Result {
	title(): string {
		return "Mute Tab";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconMusicOff);
	}

	async execute(search: Search): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { muted: true });
			focusLastActiveWindow();
		}
	}
}

class TabUnmute extends Result {
	title(): string {
		return "Unmute Tab";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconMusic);
	}

	async execute(search: Search): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { muted: false });
			focusLastActiveWindow();
		}
	}
}

class TabPin extends Result {
	title(): string {
		return "Pin Tab";
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconPin);
	}

	async execute(search: Search): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { pinned: true });
			focusLastActiveWindow();
		}
	}
}

class TabUnpin extends Result {
	title(): string {
		return "Unpin Tab";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconPinOff);
	}

	async execute(search: Search): Promise<void> {
		const lastActive = await getLastActiveTab();
		if (lastActive?.id) {
			await chrome.tabs.update(lastActive.id, { pinned: false });
			focusLastActiveWindow();
		}
	}
}

export class SortTabsByUrl extends Result {
	title(): string {
		return "Sort tabs by url";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconSortAlphabetically);
	}
	async execute(): Promise<void> {
		const tabs = await getLastActiveWindowTabs();

		const tabsSortedByUrl = tabs.sort((a, b) => {
			if (!a.url || !b.url) {
				// TODO use name instead of url?
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
			// TODO replace with notifcation or sonner
			alert("already ordered");
			return;
		}

		for (const [index, tab] of tabsSortedByUrl.entries()) {
			if (tab.id) {
				chrome.tabs.move(tab.id, { index });
			}
		}
		focusLastActiveWindow();
	}
}

export class MergeWindows extends Result {
	title(): string {
		return "Merge Windows";
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
		focusLastActiveWindow();
	}
}

export class SplitIntoWindows extends Result {
	title(): string {
		return "Split tabs into windows";
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
		focusLastActiveWindow();
	}
}

export class CloseOtherTabs extends Result {
	title(): string {
		return "Close other tabs";
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
		focusLastActiveWindow();
	}
}

export class CloseBySearch extends Result {
	options(): ResultGroup | undefined {
		return new CloseBySearchOptions();
	}
	title(): string {
		return "Close tabs by search";
	}

	description(): string {
		return "Close the following tabs by search. Select any tab to close them.";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconTabRemove);
	}

	async execute(search: Search): Promise<void> {
		this.emitShowOptionsEvent();
	}
}

class CloseBySearchOptions extends ResultGroup {
	public name(): string {
		return "Close By Search Options";
	}
	public async getResults(): Promise<Result[]> {
		const tabs = await chrome.tabs.query({});
		return tabs.map((tab) => new TabsCloseBySearch(tab));
	}
}

class TabsCloseBySearch extends Tab {
	async execute(search: Search, results: Result[]): Promise<void> {
		const currentWindow = await chrome.windows.getCurrent();
		for (const result of results) {
			if (
				result instanceof Tab &&
				result.tab.id &&
				result.tab.windowId !== currentWindow.id
			) {
				await chrome.tabs.remove(result.tab.id);
			}
		}
		focusLastActiveWindow();
	}
}
