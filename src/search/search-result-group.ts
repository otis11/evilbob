import { shortcutAsHtmlElement } from "../shortcut";

export type SearchResult = {
	type: "bookmark";
	title: string;
	description: string;
	id: string;
	searchText: string;
	shortcut?: string[];
};

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

	public asHtmlElements() {
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
			const li = document.createElement("li");
			li.classList.add("result");
			li.setAttribute("data-type", result.type);
			li.setAttribute("data-id", result.id);
			li.setAttribute("data-search", result.searchText);
			li.setAttribute("data-index", index.toString());

			const content = document.createElement("div");
			content.classList.add("result-content");

			const title = document.createElement("div");
			title.classList.add("result-title");
			title.innerText = result.title;

			const description = document.createElement("div");
			description.classList.add("result-description");
			description.innerText = result.description;

			const icon = document.createElement("span");
			icon.classList.add("result-icon");
			icon.innerHTML = this.icon;

			content.append(title, description);
			li.append(icon, content);
			resultElements.push(li);
		}
		return resultElements;
	}
}
