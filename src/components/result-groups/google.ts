import { iconFromString, iconGoogle } from "../../icons";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { Search } from "../search";

export class Google extends ResultGroup {
	prefix = "g";
	public description(): string {
		return "Google search & Google filters like intitle:youtube.";
	}

	public name(): string {
		return "Google";
	}

	public getResults(): Promise<Result[]> {
		return new Promise((resolve) => {
			resolve([
				new GoogleDork(
					"intitle",
					'intitle:"Youtube". Searches for pages with a specific keyword in the title',
				),
				new GoogleDork(
					"inurl",
					"inurl:python. Searches for URLs containing a specific keyword",
				),
				new GoogleDork(
					"filetype",
					"filetype:pdf. Searches for specific file types",
				),
				new GoogleDork(
					"site",
					"site:github.com. Limits search to a specific website.",
				),
				new GoogleDork(
					"intext",
					'intext:"Hello World".  Searches for pages with a specific keyword in the page content.',
				),
				new GoogleDork(
					"before/after",
					"before:2000-01-01 after:2001-01-01. Searches for a specific date range.",
				),
				new GoogleDork(
					"|",
					"site:facebook.com | site:twitter.com. Searches for a OR b.",
				),
				new GoogleDork(
					"&",
					"site:facebook.com & site:twitter.com. Searches for a AND b.",
				),
				new GoogleDork("-", "-site:facebook.com. Exclude results."),
				new GoogleSearch(),
			]);
		});
	}
}

export class GoogleDork extends Result {
	public id(): string {
		return this.name() + this.title();
	}

	title(): string {
		return this.titleText;
	}

	description(): string {
		return this.descriptionText;
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconGoogle);
	}

	constructor(
		private titleText: string,
		private descriptionText: string,
	) {
		super();
	}

	public search(search: Search) {
		return this.makeFakeSearch(
			new Search({
				selectionStart: 0,
				text: search.text,
			}),
			this.title().includes(search.words().at(-1) || "")
				? search.minMatchScore() + 1
				: 0,
		);
	}

	async execute(search: Search): Promise<void> {
		chrome.tabs.create({
			url: `https://google.com/search?q=${search.text.replace("g", "").trim().replaceAll(" ", "+")}`,
		});
		focusLastActiveWindow();
	}
}

export class GoogleSearch extends Result {
	public id(): string {
		return this.name() + this.title();
	}

	public search(search: Search) {
		return this.makeFakeSearch(
			new Search({
				selectionStart: 0,
				text: "",
			}),
			search.text.length > 0 ? search.minMatchScore() + 1 : 0,
		);
	}

	title(): string {
		return "Google";
	}

	description(): string {
		return "Search Google";
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconGoogle);
	}

	async execute(search: Search): Promise<void> {
		const query =
			search.words()[0] === "g"
				? search.text.slice(1).trim()
				: search.text;
		chrome.tabs.create({
			url: `https://google.com/search?q=${query.replaceAll(" ", "+")}`,
		});
		focusLastActiveWindow();
	}
}
