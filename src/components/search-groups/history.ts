import { faviconFromUrl, iconFromString, iconHistory } from "../../icons";
import type { Search } from "../search";
import { SearchGroup } from "../search-group";
import {
	SearchResult,
	type SearchResultConfig,
} from "../search-result/search-result";

export class SearchGroupHistory extends SearchGroup {
	constructor() {
		super({
			name: "history",
			permissions: ["history"],
			filter: "!h",
			description: "Search & interact with browser history.",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const items = await chrome.history.search({ text: "" });
		return items.map(
			(item) =>
				new SearchResultHistory({
					description: `${item.url}`,
					title: item.title || "",
					id: item.id,
					url: item.url,
					tags: [
						{ text: `${item.visitCount} visits`, type: "default" },
					],
					searchText: `${item.title?.toLowerCase()} ${item.url?.toLowerCase()}`,
					prepend: faviconFromUrl(item.url, iconHistory),
				}),
		);
	}
}

export class SearchResultHistory extends SearchResult {
	public id: string;
	public url: string | undefined;

	constructor(
		config: { url: string | undefined; id: string } & SearchResultConfig,
	) {
		super(config);
		this.url = config.url;
		this.id = config.id;
	}

	onSelect(): void {
		if (this.url) {
			chrome.tabs.create({ url: this.url });
			window.close();
		} else {
			// TODO handle bookmarks with no url?
			console.error("bookmark has no url", this);
		}
	}
}
