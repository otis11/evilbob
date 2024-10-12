import { type SearchGroupName, SearchGroups } from "../search-groups";
import type { Search } from "./search";
import { SearchResult } from "./search-result";

export type SearchGroupConfig = {
	name: SearchGroupName;
	permissions?: string[];
	hostPermissions?: string[];
	filter?: string;
};

export abstract class SearchGroup {
	public name: SearchGroupName;
	public permissions: string[];
	public hostPermissions: string[];
	private results: SearchResult[];
	private renderedNodes: HTMLLIElement[] = [];
	public filter: string;
	public isResultsLoaded = false;

	constructor(config: SearchGroupConfig) {
		this.name = config.name;
		this.permissions = config.permissions || [];
		this.hostPermissions = config.hostPermissions || [];
		this.results = [];
		this.filter = config.filter || "";
	}

	public async isEnabled(): Promise<boolean> {
		return new Promise((resolve) => {
			chrome.permissions.contains(
				{
					permissions: this.permissions,
					origins: this.hostPermissions,
				},
				async (result) => {
					if (result) {
						const config = await SearchGroups.getConfig();
						resolve(!!config[this.name]?.enabled);
					} else {
						resolve(false);
					}
				},
			);
		});
	}

	public async enable() {
		return new Promise((resolve) => {
			chrome.permissions.request(
				{
					permissions: this.permissions,
					origins: this.hostPermissions,
				},
				async (granted) => {
					if (!granted) {
						console.error(
							"could not grant permission for group?",
							this,
						);
					}
					await SearchGroups.setConfig(this.name, {
						enabled: true,
					});
					resolve(true);
				},
			);
		});
	}

	public async disable() {
		return new Promise((resolve) => {
			chrome.permissions.remove(
				{
					permissions: this.permissions,
					origins: this.hostPermissions,
				},
				async (removed) => {
					if (!removed) {
						console.error(
							"could not remove permission for group?",
							this,
						);
					}
					await SearchGroups.setConfig(this.name, {
						enabled: false,
					});
					resolve(true);
				},
			);
		});
	}

	public storageKey() {
		return `group.config.${this.name}`;
	}

	public async loadResults() {
		this.results = await this.getResults();
		this.isResultsLoaded = true;
	}

	public abstract getResults(): Promise<SearchResult[]>;

	public asHtmlElement() {
		this.renderedNodes = this.results.map((result) =>
			result.asHtmlElement(),
		);
		return this.renderedNodes;
	}

	public isSearchHitForResult(search: Search, instance: SearchResult) {
		const cleanSearch = search.text.toLowerCase().trim();
		return instance?.searchText.toLowerCase().includes(cleanSearch);
	}

	public filterRenderedNodes(search: Search) {
		for (const node of this.renderedNodes) {
			const instance = SearchResult.instanceFromId(
				node.getAttribute("data-instance-id") || "",
			);

			if (instance && this.isSearchHitForResult(search, instance)) {
				node.classList.remove("hidden");
			} else {
				node.classList.add("hidden");
			}
		}
	}

	public hideRenderedNodes() {
		for (const node of this.renderedNodes) {
			node.classList.add("hidden");
		}
	}

	public shouldRenderAlone(search: Search) {
		return !!this.filter && search.text.includes(this.filter);
	}
}
