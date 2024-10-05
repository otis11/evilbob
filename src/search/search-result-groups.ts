import { SearchResultGroupBookmarks } from "./bookmarks";
import type { SearchResultGroup } from "./search-result-group";
import { SearchResultGroupShortcuts } from "./shortcuts";
import { SearchResultGroupSystemCpu } from "./system-cpu";

export type SearchResultGroupStorage = {
	enabled?: boolean;
	order?: number;
};

const all = () => [
	new SearchResultGroupBookmarks(),
	new SearchResultGroupSystemCpu(),
	new SearchResultGroupShortcuts(),
];

export class SearchResultGroups {
	public list: SearchResultGroup[];

	constructor() {
		this.list = all();
	}

	static async getConfig(): Promise<
		Record<string, SearchResultGroupStorage>
	> {
		return (
			(await chrome.storage.sync.get(["searchResultGroups"]))
				.searchResultGroups || {}
		);
	}

	static async setConfig(
		name: string,
		newValues: {
			enabled?: boolean;
			order?: number;
		},
	) {
		const config = await SearchResultGroups.getConfig();
		config[name] = {
			enabled: newValues.enabled || config[name]?.enabled || false,
			order: newValues.order || config[name]?.order || 0,
		};
		await chrome.storage.sync.set({
			searchResultGroups: config,
		});
	}

	public orderAlphabetically() {
		this.list.sort((a, b) => {
			if (a.name > b.name) {
				return 1;
			}
			if (a.name < b.name) {
				return -1;
			}
			return 0;
		});
		return this;
	}

	public async filterEnabled() {
		const groups = [];
		for (const group of this.list) {
			if (await group.isEnabled()) {
				groups.push(group);
			}
		}
		this.list = groups;
		return this;
	}

	public async order() {
		const config = await SearchResultGroups.getConfig();
		this.list.sort((a, b) => {
			const orderA = config[a.name].order || 0;
			const orderB = config[b.name].order || 0;
			if (orderA > orderB) {
				return 1;
			}
			if (orderA < orderB) {
				return -1;
			}
			return 0;
		});
		return this;
	}
}
