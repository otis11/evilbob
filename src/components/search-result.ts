import type { Shortcut } from "./shortcut";

export type SearchResultConfig = {
	title: string;
	description: string;
	searchText: string;
	append?: HTMLElement;
	prepend?: HTMLElement;
};

export abstract class SearchResult {
	title: string;
	description: string;
	searchText: string;
	append?: HTMLElement;
	prepend?: HTMLElement;
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
		this.append = config.append;
		this.prepend = config.prepend;

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

		if (this.prepend) {
			this.prepend.classList.add("result-prepend");
			li.append(this.prepend);
		}

		content.append(title, description);
		li.append(content);

		if (this.append) {
			this.append.classList.add("result-append");
			li.append(this.append);
		}

		return li;
	}
}
