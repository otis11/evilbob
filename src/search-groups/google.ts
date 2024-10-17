import type { Search } from "../components/search";
import { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { iconFromString, iconGoogle } from "../icons";

export class SearchGroupGoogle extends SearchGroup {
	constructor() {
		super({
			name: "google",
			permissions: [],
			filter: "!g",
		});
	}

	public getResults(): Promise<SearchResult[]> {
		return new Promise((resolve) => {
			resolve([
				new SearchResultGoogle(
					"intitle",
					'intitle:"Youtube". Searches for pages with a specific keyword in the title',
				),
				new SearchResultGoogle(
					"inurl",
					"inurl:python. Searches for URLs containing a specific keyword",
				),
				new SearchResultGoogle(
					"filetype",
					"filetype:pdf. Searches for specific file types",
				),
				new SearchResultGoogle(
					"site",
					"site:github.com. Limits search to a specific website.",
				),
				new SearchResultGoogle(
					"intext",
					'intext:"Hello World".  Searches for pages with a specific keyword in the page content.',
				),
				new SearchResultGoogle(
					"before/after",
					"before:2000-01-01 after:2001-01-01. Searches for a specific date range.",
				),
				new SearchResultGoogle(
					"|",
					"site:facebook.com | site:twitter.com. Searches for a OR b.",
				),
				new SearchResultGoogle(
					"&",
					"site:facebook.com & site:twitter.com. Searches for a AND b.",
				),
				new SearchResultGoogle(
					"&",
					"site:facebook.com & site:twitter.com. Searches for a AND b.",
				),
				new SearchResultGoogle(
					"-",
					"-site:facebook.com. Exclude results.",
				),
				new SearchResultGoogle("Google", "Search Google"),
			]);
		});
	}
}

export class SearchResultGoogle extends SearchResult {
	constructor(title: string, description: string) {
		super({
			title,
			searchText: `${title} ${description}`,
			description,
			prepend: iconFromString(iconGoogle),
		});
	}

	public isHit(search: Search): boolean {
		if (this.title === "Google") {
			return true;
		}

		const currentWord = search.currentWord();
		if (currentWord === "") {
			return true;
		}

		if (currentWord) {
			return this.searchText.includes(currentWord);
		}
		return false;
	}
	onSelect(search: Search): void {
		chrome.tabs.create({
			url: `https://google.com/search?q=${search.text.replaceAll("!g", "").trim().replaceAll(" ", "+")}`,
		});
		window.close();
	}
}
