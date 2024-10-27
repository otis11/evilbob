import { getConfig } from "../../config";
import { faviconFromUrl, iconFromString, iconHistory } from "../../icons";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";
import type { Tag } from "../tags/tags";

export class History extends ResultGroup {
	permissions = ["history"];
	public id(): string {
		return "history";
	}
	prefix = "h";
	public description(): string {
		return "Search & interact with browser history.";
	}

	public name(): string {
		return "History";
	}

	public async getResults(): Promise<Result[]> {
		const config = await getConfig();
		const items = await chrome.history.search({
			text: "",
			maxResults: config.search?.maxHistoryItems || 100,
		});
		return items.map((item) => new HistoryItem(item));
	}
}

export class HistoryItem extends Result {
	description(): string {
		return this.item.url || "";
	}

	title(): string {
		return this.item.title || "";
	}

	tags(): Tag[] {
		return [
			{
				html: iconFromString(iconHistory, "12px").outerHTML,
				type: "default",
			},
			{ text: `${this.item.visitCount} visits`, type: "default" },
		];
	}

	prepend(): HTMLElement | undefined {
		return this.item.url ? faviconFromUrl(this.item.url) : undefined;
	}

	options(): ResultGroup | undefined {
		return new HistoryItemOptions(this.item);
	}
	constructor(private item: chrome.history.HistoryItem) {
		super();
	}

	public id(): string {
		return this.name() + this.item.id;
	}

	async execute(): Promise<void> {
		if (this.item.url) {
			chrome.tabs.create({ url: this.item.url });
			focusLastActiveWindow();
		} else {
			console.error("history has no url", this);
		}
	}
}

class HistoryItemOptions extends ResultGroup {
	public id(): string {
		return "history-item-options";
	}
	constructor(private item: chrome.history.HistoryItem) {
		super();
	}

	public async getResults(): Promise<Result[]> {
		return [new HistoryRemove(this.item)];
	}

	public name(): string {
		return "History Item Options";
	}
}

class HistoryRemove extends Result {
	title(): string {
		return "Remove url occurences";
	}
	description(): string {
		return "Remove all url occurences from history. Delete";
	}
	constructor(private item: chrome.history.HistoryItem) {
		super();
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		if (this.item.url) {
			await chrome.history.deleteUrl({ url: this.item.url });
			focusLastActiveWindow();
		}
	}
}
