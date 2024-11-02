import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import { iconDelete, iconDeleteSweep, iconFromString } from "../../core/icons";
import { getLastActiveTab } from "../../core/util/last-active-tab";
import { focusLastActiveWindow } from "../../core/util/last-active-window";

export default defineBobPlugin({
	permissions: ["browsingData", "tabs"],
	name() {
		return "Browsing Data";
	},
	description() {
		return "Manage your browsing data.";
	},
	async provideResults() {
		return [new ResetPage(), new ClearAllDataSince()];
	},
	icon: iconDelete,
});

class ResetPage extends Result {
	prepend(): HTMLElement | undefined {
		return iconFromString(iconDeleteSweep);
	}
	title(): string {
		return "Reset Page";
	}
	description(): string {
		return "Clears cache, cacheStorage, cookies, localStorage, appcache & indexedDB and reloads";
	}
	async execute(state: BobWindowState): Promise<void> {
		const tab = await getLastActiveTab();
		if (tab?.id && tab.url) {
			const url = new URL(tab.url);
			await chrome.browsingData.remove(
				{
					origins: [url.origin],
				},
				{
					cache: true,
					cacheStorage: true,
					cookies: true,
					localStorage: true,
					appcache: true,
					indexedDB: true,
				},
			);
			await chrome.tabs.reload(tab.id, { bypassCache: true });
			await focusLastActiveWindow();
		}
	}
}

async function clearAllDataSince(since: number) {
	await chrome.browsingData.remove(
		{
			since,
		},
		{
			appcache: true,
			cache: true,
			cacheStorage: true,
			cookies: true,
			downloads: true,
			fileSystems: true,
			formData: true,
			history: true,
			indexedDB: true,
			localStorage: true,
			passwords: true,
			serviceWorkers: true,
			webSQL: true,
		},
	);
}

class ClearAllDataSince extends Result {
	title(): string {
		return "Clear all data since...";
	}

	description(): string {
		return "Deletes all browsing data since...";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconDelete);
	}

	options(): Result[] | undefined {
		const minute = 1000 * 60;
		const hour = minute * 60;
		const week = hour * 24 * 7;
		return [
			new ClearSinceMilliseconds(() => "15 minutes ago", minute * 15),
			new ClearSinceMilliseconds(() => "1 hour ago", hour),
			new ClearSinceMilliseconds(() => "12 hours ago", hour * 12),
			new ClearSinceMilliseconds(() => "1 day ago", hour * 24),
			new ClearSinceMilliseconds(() => "1 week ago", week),
			new ClearSinceMilliseconds(() => "4 weeks ago", week * 4),
			new ClearSinceMilliseconds(() => "All time.", Date.now() - 1000),
		];
	}
	async execute(state: BobWindowState): Promise<void> {
		this.emitShowOptionsEvent();
	}
}

class ClearSinceMilliseconds extends Result {
	constructor(
		private titleText: () => string,
		private milliseconds: number,
	) {
		super();
	}

	title(): string {
		return this.titleText();
	}

	async execute(state: BobWindowState): Promise<void> {
		if (window.confirm("You sure?")) {
			const oneWeekAgo = new Date().getTime() - this.milliseconds;
			state.closeResultOptions();
			await clearAllDataSince(oneWeekAgo);
		}
	}
}
