import type { Search } from "../search";
import type { Tag } from "../tags/tags";
import { Result } from "./result";

export class ResultInfo extends Result {
	constructor(title: string, description: string, tags?: Tag[]) {
		super({
			title,
			description,
			tags,
		});
	}

	id(): string {
		return this.name() + this.title;
	}

	async execute(search: Search): Promise<void> {}
}
