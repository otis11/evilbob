import { faviconFromUrl, iconFromString, iconHistory } from "../../icons";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";

export class ResultGroupHistory extends ResultGroup {
	permissions = ["history"];
	prefix = "h";
	description = "Search & interact with browser history.";

	public async getResults(): Promise<Result[]> {
		const items = await chrome.history.search({ text: "" });
		return items.map((item) => new ResultHistory(item));
	}
}

export class ResultHistory extends Result {
	constructor(private item: chrome.history.HistoryItem) {
		super({
			description: `${item.url}`,
			title: item.title || "",
			tags: [
				{
					html: iconFromString(iconHistory, "12px").outerHTML,
					type: "default",
				},
				{ text: `${item.visitCount} visits`, type: "default" },
			],
			prepend: item.url ? faviconFromUrl(item.url) : undefined,
		});

		this.options = new ResultHistoryOptions(this.item);
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

class ResultHistoryOptions extends ResultGroup {
	constructor(private item: chrome.history.HistoryItem) {
		super();
	}

	public async getResults(): Promise<Result[]> {
		return [new ResultRemoveHistory(this.item)];
	}
}

class ResultRemoveHistory extends Result {
	constructor(private item: chrome.history.HistoryItem) {
		super({
			title: "Remove url occurences",
			description: "Remove all url occurences from history. Delete",
		});
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		if (this.item.url) {
			await chrome.history.deleteUrl({ url: this.item.url });
			focusLastActiveWindow();
		}
	}
}
