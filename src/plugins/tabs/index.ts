import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import type { Tag } from "../../core/components/tags/tags";
import {
	faviconFromUrl,
	iconFromString,
	iconFromUrl,
	iconIncognito,
	iconMusic,
	iconMusicOff,
	iconPin,
	iconTab,
} from "../../core/icons";
import type { Locale } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import { focusLastActiveWindow } from "../../core/util/last-active-window";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	permissions: ["tabs"],
	prefix: "t",
	name() {
		return t("Tabs");
	},
	onLocalChange(locale: Locale) {
		setLocale(locale);
	},
	description() {
		return t("Tabs.description");
	},
	async provideResults(): Promise<Result[]> {
		const tabs = await chrome.tabs.query({});
		return tabs.map((tab) => new Tab(tab));
	},
	icon: iconTab,
});

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
				text: t("Active"),
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
		return this.className() + this.tab.id;
	}

	async execute(state: BobWindowState): Promise<void> {
		await chrome.tabs.highlight({
			tabs: [this.tab.index],
			windowId: this.tab.windowId,
		});
		await focusLastActiveWindow();
	}
}
