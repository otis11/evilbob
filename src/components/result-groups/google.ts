import { iconFromString, iconGoogle } from "../../icons";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { Search } from "../search";

export class ResultGroupGoogle extends ResultGroup {
	prefix = "g";
	description = "Google search & Google filters like intitle:youtube.";

	public getResults(): Promise<Result[]> {
		return new Promise((resolve) => {
			resolve([
				new ResultGoogle(
					"intitle",
					'intitle:"Youtube". Searches for pages with a specific keyword in the title',
				),
				new ResultGoogle(
					"inurl",
					"inurl:python. Searches for URLs containing a specific keyword",
				),
				new ResultGoogle(
					"filetype",
					"filetype:pdf. Searches for specific file types",
				),
				new ResultGoogle(
					"site",
					"site:github.com. Limits search to a specific website.",
				),
				new ResultGoogle(
					"intext",
					'intext:"Hello World".  Searches for pages with a specific keyword in the page content.',
				),
				new ResultGoogle(
					"before/after",
					"before:2000-01-01 after:2001-01-01. Searches for a specific date range.",
				),
				new ResultGoogle(
					"|",
					"site:facebook.com | site:twitter.com. Searches for a OR b.",
				),
				new ResultGoogle(
					"&",
					"site:facebook.com & site:twitter.com. Searches for a AND b.",
				),
				new ResultGoogle("-", "-site:facebook.com. Exclude results."),
				new ResultGoogleSearch(),
			]);
		});
	}
}

export class ResultGoogle extends Result {
	public id(): string {
		return this.name() + this.title;
	}

	constructor(title: string, description: string) {
		super({
			title,
			description,
			prepend: iconFromString(iconGoogle),
		});
	}

	public search(search: Search) {
		return this.makeFakeSearch(
			new Search({
				selectionStart: 0,
				text: search.text,
			}),
			this.title.includes(search.words().at(-1) || "")
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

export class ResultGoogleSearch extends Result {
	public id(): string {
		return this.name() + this.title;
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

	constructor() {
		super({
			title: "Google",
			description: "Search google",
			prepend: iconFromString(iconGoogle),
		});
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
