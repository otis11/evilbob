import type { Search } from "../search";
import type { Tag } from "../tags/tags";
import { Result } from "./result";

export class ResultGoToUrl extends Result {
	url: string;

	constructor(title: string, description: string, url: string, tags?: Tag[]) {
		super({
			title,
			description,
			tags,
		});

		this.url = url;
	}

	id(): string {
		return this.name() + this.title;
	}

	async execute(search: Search): Promise<void> {
		await chrome.tabs.create({ url: this.url });
		window.close();
	}
}
