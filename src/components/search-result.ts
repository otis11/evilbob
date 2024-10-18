import type { Search } from "./search";
import { type Tag, Tags } from "./tags";

export type SearchResultConfig = {
	title: string;
	description: string;
	searchText: string;
	append?: HTMLElement;
	prepend?: HTMLElement;
	tags?: Tag[];
};

export abstract class SearchResult {
	title: string;
	description: string;
	searchText: string;
	append?: HTMLElement;
	prepend?: HTMLElement;
	instanceId: string;
	tags: Tag[];

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
		this.tags = config.tags || [];

		SearchResult.globalRegistry[this.instanceId] = this;
	}

	public isHit(search: Search) {
		const cleanSearch = search.text.toLowerCase().trim();
		return this.searchText.toLowerCase().includes(cleanSearch);
	}

	abstract onSelect(search: Search): void;

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
			const span = document.createElement("span");
			span.classList.add("result-prepend");
			span.append(this.prepend);
			li.append(span);
		}

		content.append(title);

		if (this.tags.length > 0) {
			const tags = Tags(this.tags);
			content.append(tags);
		}
		content.append(description);
		li.append(content);

		if (this.append) {
			const span = document.createElement("span");
			span.classList.add("result-append");
			span.append(this.append);
			li.append(span);
		}

		return li;
	}
}
