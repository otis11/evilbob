import { faviconFromUrl, iconFromString, iconHistory } from "../../icons";
import { ResultGroup } from "../result-group";
import { Result, type ResultConfig } from "../result/result";

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
	}

	public id(): string {
		return this.name() + this.item.id;
	}

	async execute(): Promise<void> {
		if (this.item.url) {
			chrome.tabs.create({ url: this.item.url });
			window.close();
		} else {
			// TODO handle bookmarks with no url?
			console.error("bookmark has no url", this);
		}
	}
}
