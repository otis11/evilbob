import type { Search } from "../search";
import type { SearchGroup } from "../search-group";
import { type Tag, Tags } from "../tags/tags";
import "./search-result.css";

export type SearchResultConfig = {
	title: string;
	description: string;
	searchText: string;
	append?: HTMLElement;
	prepend?: HTMLElement;
	tags?: Tag[];
	options?: SearchGroup;
};

export abstract class SearchResult {
	title: string;
	description: string;
	searchText: string;
	append?: HTMLElement;
	prepend?: HTMLElement;
	instanceId: string;
	tags: Tag[];
	options?: SearchGroup;

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
		this.options = config.options;

		SearchResult.globalRegistry[this.instanceId] = this;
	}

	public isHit(search: Search) {
		const cleanSearch = search.text.toLowerCase().trim();
		return this.searchText.toLowerCase().includes(cleanSearch);
	}

	public emitShowOptionsEvent() {
		window.dispatchEvent(
			new CustomEvent("show-options-for-result", { detail: this }),
		);
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
			span.append(this.prepend.cloneNode(true));
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
			span.append(this.append.cloneNode(true));
			li.append(span);
		}

		return li;
	}
}
