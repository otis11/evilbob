import type { BobWindowState } from "../../BobPlugin.ts";
import { focusLastActiveWindow } from "../../util/last-active-window.ts";
import type { Tag } from "../tags/tags.ts";
import { Result } from "./result.ts";

export function NewResult(config: SimpleResultConfig) {
	return new SimpleResult(config);
}

export function NewUrlResult(config: NewUrlConfig) {
	return new SimpleResult({
		...config,
		run: async () => {
			await chrome.tabs.create({ url: config.url });
			await focusLastActiveWindow();
		},
	});
}

type NewUrlConfig = {
	title: string;
	url: string;
	description?: string;
	tags?: Tag[];
	prepend?: HTMLElement;
	append?: HTMLElement;
	options?: Result[];
};

type SimpleResultConfig = {
	title: string;
	description?: string;
	tags?: Tag[];
	prepend?: HTMLElement;
	append?: HTMLElement;
	run?: (state: BobWindowState) => Promise<void>;
	options?: Result[];
};

export class SimpleResult extends Result {
	description(): string {
		return this.config.description || "";
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

	append(): HTMLElement | undefined {
		return this.config.append;
	}

	options(): Result[] | undefined {
		return this.config.options || [];
	}

	constructor(private config: SimpleResultConfig) {
		super();
	}

	id(): string {
		return this.className() + this.title();
	}

	async run(state: BobWindowState): Promise<void> {
		await this.config.run?.(state);
	}
}
