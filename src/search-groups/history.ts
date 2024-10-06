import { iconFromString, iconFromUrl, iconHistory } from "../components/icon";
import { SearchGroup } from "../components/search-group";
import {
	SearchResult,
	type SearchResultConfig,
} from "../components/search-result";

export class SearchGroupHistory extends SearchGroup {
	constructor() {
		super({
			name: "history",
			permissions: ["history"],
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const items = await chrome.history.search({ text: "" });
		return items.map(
			(item) =>
				new SearchResultHistory({
					description: `${item.visitCount} visits, ${item.url}`,
					title: item.title || "",
					id: item.id,
					url: item.url,
					searchText: `${item.title} ${item.url}`,
					prepend: iconFromUrl(item.url, iconHistory),
					append: iconFromString(iconHistory),
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
