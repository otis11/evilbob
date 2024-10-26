import type { Search } from "../search";
import type { Tag } from "../tags/tags";
import { Result } from "./result";

export type ResultGoToUrlConfig = {
	title: string;
	description: string;
	url: string;
	tags?: Tag[];
	prepend?: HTMLElement;
};

export class ResultGoToUrl extends Result {
	url: string;

	constructor(config: ResultGoToUrlConfig) {
		super(config);

		this.url = config.url;
	}

	id(): string {
		return this.name() + this.title;
	}

	async execute(search: Search): Promise<void> {
		await chrome.tabs.create({ url: this.url });
		window.close();
	}
}
