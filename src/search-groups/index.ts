import type { SearchGroup } from "../components/search-group";
import { isChromium } from "../platform";
import { SearchGroupBob } from "./bob";
import { SearchGroupBookmarks } from "./bookmarks";
import { SearchGroupFilter } from "./filter";
import { SearchGroupGoogle } from "./google";
import { SearchGroupHistory } from "./history";
import { SearchGroupShortcuts } from "./shortcuts";
import { SearchGroupSystemCpu } from "./system-cpu";
import { SearchGroupSystemMemory } from "./system-memory";
import { SearchGroupSystemStorage } from "./system-storage";
import { SearchGroupTabs } from "./tabs";
import { SearchGroupUserScripts } from "./user-scripts";

export type SearchGroupName =
	| "bookmarks"
	| "history"
	| "system.cpu"
	| "system.memory"
	| "system.storage"
	| "shortcuts"
	| "bob"
	| "google"
	| "filter"
	| "user-scripts"
	| "tabs";

export type SearchGroupStorage = {
	enabled?: boolean;
	order?: number;
};

const all = () => {
	const results = [
		new SearchGroupBookmarks(),
		new SearchGroupShortcuts(),
		new SearchGroupBob(),
		new SearchGroupHistory(),
		new SearchGroupTabs(),
		new SearchGroupGoogle(),
		new SearchGroupFilter(),
		new SearchGroupUserScripts(),
	];
	if (isChromium) {
		results.push(new SearchGroupSystemCpu());
		results.push(new SearchGroupSystemMemory());
		results.push(new SearchGroupSystemStorage());
	}
	return results;
};

const defaultConfig: Record<SearchGroupName, SearchGroupStorage> = {
	bob: {
		enabled: true,
		order: 20,
	},
	history: {
		enabled: false,
		order: 100,
	},
	"system.cpu": {
		enabled: false,
		order: 70,
	},
	"system.memory": {
		enabled: false,
		order: 69,
	},
	"system.storage": {
		enabled: false,
		order: 68,
	},
	bookmarks: {
		enabled: false,
		order: 50,
	},
	shortcuts: {
		order: 90,
		enabled: true,
	},
	tabs: {
		order: 30,
		enabled: false,
	},
	google: {
		order: 200,
		enabled: true,
	},
	filter: {
		order: 1,
		enabled: true,
	},
	"user-scripts": {
		order: 20,
		enabled: false,
	},
};

export class SearchGroups {
	public list: SearchGroup[];

	constructor() {
		this.list = all();
	}

	static async getConfig(): Promise<Record<string, SearchGroupStorage>> {
		return (
			(await chrome.storage.sync.get(["searchResultGroups"]))
				.searchResultGroups || {}
		);
	}

	static async setConfigToDefaults() {
		await chrome.storage.sync.set({
			searchResultGroups: defaultConfig,
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
