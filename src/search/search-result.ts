export type SearchResultConfig = {
	title: string;
	description: string;
	id: string;
	searchText: string;
	shortcut?: string[];
	icon?: string;
};

export abstract class SearchResult {
	title: string;
	description: string;
	id: string;
	searchText: string;
	shortcut: string[];
	icon: string;

	constructor(config: SearchResultConfig) {
		this.title = config.title;
		this.description = config.description;
		this.id = config.id;
		this.searchText = config.searchText;
		this.shortcut = config.shortcut || [];
		this.icon = config.icon || "";
	}

	abstract onSelect(): void;

	public asHtmlElement() {
		const li = document.createElement("li");
		li.classList.add("result");
		li.setAttribute("data-id", this.id);
		li.setAttribute("data-search", this.searchText);

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
		return li;
	}
}
