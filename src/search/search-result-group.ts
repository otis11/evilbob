import { shortcutAsHtmlElement } from "../shortcut";
import type { SearchResult } from "./search-result";

export type SearchResultGroupConfig = {
	name: string;
	permissions?: string[];
	hostPermissions?: string[];
	icon?: string;
	shortcut?: string[];
};
export abstract class SearchResultGroup {
	public name: string;
	public icon: string;
	public permissions: string[];
	public hostPermissions: string[];
	private results: SearchResult[];
	public shortcut: string[];

	constructor(config: SearchResultGroupConfig) {
		this.name = config.name;
		this.permissions = config.permissions || [];
		this.hostPermissions = config.hostPermissions || [];
		this.icon = config.icon || "";
		this.results = [];
		this.shortcut = config.shortcut || [];
	}

	public async hasPermission() {
		return new Promise((resolve) => {
			chrome.permissions.contains(
				{
					permissions: this.permissions,
					origins: this.hostPermissions,
				},
				(result) => resolve(!!result),
			);
		});
	}

	public async loadResults() {
		this.results = await this.getResults();
	}

	public abstract getResults(): Promise<SearchResult[]>;

	public asHtmlElement() {
		const resultElements: HTMLLIElement[] = [];
		const groupLi = document.createElement("li");
		groupLi.classList.add("result");

		const groupTitle = document.createElement("div");
		groupTitle.classList.add("result-group-title");
		groupTitle.innerText = this.name;
		groupLi.setAttribute("data-search", this.name);
		groupLi.append(groupTitle);

		if (this.shortcut.length) {
			groupLi.append(shortcutAsHtmlElement(this.shortcut));
		}

		resultElements.push(groupLi);

		for (const [index, result] of this.results.entries()) {
			const li = result.asHtmlElement();
			li.setAttribute("data-index", index.toString());
			resultElements.push(li);
		}
		return resultElements;
	}
}
