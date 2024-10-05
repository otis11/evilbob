import type { Shortcut } from "./shortcut";

export type SearchResultConfig = {
	title: string;
	description: string;
	searchText: string;
	shortcut?: Shortcut;
	icon?: string;
};

export abstract class SearchResult {
	title: string;
	description: string;
	searchText: string;
	shortcut?: Shortcut;
	icon: string;
	instanceId: string;

	static instanceFromId(id: string): SearchResult | undefined {
		return SearchResult.globalRegistry[id];
	}

	static globalRegistry: Record<string, SearchResult> = {};

	constructor(config: SearchResultConfig) {
		this.title = config.title;
		this.description = config.description;
		this.instanceId = crypto.randomUUID();
		this.searchText = config.searchText;
		this.shortcut = config.shortcut;
		this.icon = config.icon || "";

		SearchResult.globalRegistry[this.instanceId] = this;
	}

	abstract onSelect(): void;

	public asHtmlElement() {
		const li = document.createElement("li");
		li.classList.add("result");
		li.setAttribute("data-instance-id", this.instanceId);

		const content = document.createElement("div");
		content.classList.add("result-content");

		const title = document.createElement("div");
		title.classList.add("result-title");
		title.innerText = this.title;

		const description = document.createElement("div");
		description.classList.add("result-description");
		description.innerText = this.description;

		if (this.icon) {
			const icon = document.createElement("span");
			icon.classList.add("result-icon");
			icon.innerHTML = this.icon;
			li.append(icon);
		}

		content.append(title, description);
		li.append(content);

		if (this.shortcut) {
			li.append(this.shortcut.asHtmlElement());
		}

		return li;
	}
}
