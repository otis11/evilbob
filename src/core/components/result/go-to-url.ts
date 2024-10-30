import { focusLastActiveWindow } from "../../util/last-active-window";
import type { Tag } from "../tags/tags";
import { Result } from "./result";

type GoToUrlConfig = {
	title: string;
	description: string;
	url: string;
	tags?: Tag[];
	prepend?: HTMLElement;
};

export class GoToUrl extends Result {
	description(): string {
		return this.config.description;
	}

	title(): string {
		return this.config.title;
	}

	tags(): Tag[] {
		return this.config.tags || [];
	}

	prepend(): HTMLElement | undefined {
		return this.config.prepend;
	}

	constructor(private config: GoToUrlConfig) {
		super();
	}

	id(): string {
		return this.name() + this.title();
	}

	async execute(): Promise<void> {
		await chrome.tabs.create({ url: this.config.url });
		focusLastActiveWindow();
	}
}
