import {
	faviconFromUrl,
	iconFromString,
	iconFromUrl,
	iconIncognito,
	iconMusic,
	iconMusicOff,
	iconPin,
	iconTab,
} from "../../icons";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";
import type { Tag } from "../tags/tags";

export class Tabs extends ResultGroup {
	permissions = ["tabs"];
	prefix = "t";
	public name(): string {
		return "Tabs";
	}
	public description(): string {
		return "Search browser tabs.";
	}

	public async getResults(): Promise<Result[]> {
		const tabs = await chrome.tabs.query({});
		return tabs.map((tab) => new Tab(tab));
	}
}

export class Tab extends Result {
	tags(): Tag[] {
		const tags: Tag[] = [
			{ html: iconFromString(iconTab, "12px").outerHTML },
		];
		if (this.tab.incognito) {
			tags.push({
				html: iconFromString(iconIncognito, "12px").outerHTML,
			});
		}
		if (this.tab.audible) {
			tags.push({
				html: iconFromString(iconMusic, "12px").outerHTML,
			});
		}
		if (this.tab.pinned) {
			tags.push({
				html: iconFromString(iconPin, "12px").outerHTML,
			});
		}
		if (this.tab.mutedInfo?.muted) {
			tags.push({
				html: `${iconFromString(iconMusicOff, "12px").outerHTML} ${this.tab.mutedInfo.reason}`,
			});
		}
		if (this.tab.highlighted) {
			tags.push({
				text: "active",
				type: "success",
			});
		}
		return tags;
	}
	prepend(): HTMLElement | undefined {
		return this.tab.favIconUrl
			? iconFromUrl(this.tab.favIconUrl)
			: faviconFromUrl(this.tab.url || "");
	}

	title(): string {
		return this.tab.title || "";
	}

	description(): string {
		return this.tab.url || "";
	}
	constructor(public tab: chrome.tabs.Tab) {
		super();
	}

	public id(): string {
		return this.name() + this.tab.id;
	}

	async execute(search: Search, results: Result[]): Promise<void> {
		await chrome.tabs.highlight({
			tabs: [this.tab.index],
			windowId: this.tab.windowId,
		});
		focusLastActiveWindow();
	}
}
