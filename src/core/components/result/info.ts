import type { Search } from "../search";
import type { Tag } from "../tags/tags";
import { Result } from "./result";

export type InfoConfig = {
	title: string;
	description?: string;
	tags?: Tag[];
	append?: HTMLElement | undefined;
	prepend?: HTMLElement | undefined;
};

export class Info extends Result {
	title(): string {
		return this.config.title;
	}

	description(): string {
		return this.config.description || "";
	}

	tags(): Tag[] {
		return this.config.tags || [];
	}
	prepend(): HTMLElement | undefined {
		return this.config.prepend;
	}

	append(): HTMLElement | undefined {
		return this.config.append;
	}

	constructor(private config: InfoConfig) {
		super();
	}

	id(): string {
		return this.name() + this.title();
	}

	async execute(search: Search): Promise<void> {}
}
