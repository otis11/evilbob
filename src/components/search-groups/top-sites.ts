import {
	faviconFromUrl,
	iconArrowUpBold,
	iconBob,
	iconFromString,
	iconFromUrl,
} from "../../icons";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";

export class SearchGroupTopSites extends SearchGroup {
	constructor() {
		super({
			filter: "!to",
			name: "top-sites",
			permissions: ["topSites"],
			description:
				"The top sites (i.e. most visited sites) that are displayed on the new tab page",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		return (await chrome.topSites.get()).map(
			(site) => new SearchResultMostVisitedURL(site),
		);
	}
}

export class SearchResultMostVisitedURL extends SearchResult {
	constructor(private site: chrome.topSites.MostVisitedURL) {
		super({
			title: site.title,
			searchText: `${site.title} ${site.url}`,
			description: site.url,
			prepend: faviconFromUrl(site.url),
			tags: [{ html: iconFromString(iconArrowUpBold, "12px").outerHTML }],
		});
	}
	async onSelect(): Promise<void> {
		chrome.tabs.create({ url: this.site.url });
		window.close();
	}
}
