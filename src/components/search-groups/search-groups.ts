import type { SearchGroup } from "../search-group";
import {
	SEARCH_GROUPS_DEFAULT_CONFIG,
	SEARCH_GROUPS_USER_AGENT_FILTERED,
	type SearchGroupStorage,
} from "./config";

export class SearchGroups {
	public list: SearchGroup[];

	constructor() {
		this.list = SEARCH_GROUPS_USER_AGENT_FILTERED();
	}

	static async getConfig(): Promise<Record<string, SearchGroupStorage>> {
		return (
			(await chrome.storage.sync.get(["searchResultGroups"]))
				.searchResultGroups || {}
		);
	}

	static async setConfigToDefaults() {
		await chrome.storage.sync.set({
			searchResultGroups: SEARCH_GROUPS_DEFAULT_CONFIG,
		});
	}

	static async hasEmptyConfig() {
		return (
			Object.keys(await chrome.storage.sync.get(["searchResultGroups"]))
				.length === 0
		);
	}

	static async setConfig(
		name: string,
		newValues: {
			enabled?: boolean;
			order?: number;
		},
	) {
		const config = await SearchGroups.getConfig();
		config[name] = {
			enabled:
				newValues.enabled === undefined
					? config[name]?.enabled || false
					: newValues.enabled,
			order:
				newValues.order === undefined
					? config[name]?.order || 0
					: newValues.order,
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
		const config = await SearchGroups.getConfig();
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
