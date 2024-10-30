import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import { Search } from "../../core/components/search";
import { iconFromString, iconGoogle } from "../../core/icons";
import { NewLocales } from "../../core/locales/new-locales";
import { focusLastActiveWindow } from "../../core/util/last-active-window";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	icon: iconGoogle,
	prefix: "g",
	description(): string {
		return t("Google.description");
	},

	name(): string {
		return t("Google");
	},

	async provideResults(): Promise<Result[]> {
		return [
			new GoogleDork("intitle", t("GoogleDork.intitle")),
			new GoogleDork("inurl", t("GoogleDork.inurl")),
			new GoogleDork("filetype", t("GoogleDork.filetype")),
			new GoogleDork("site", t("GoogleDork.site")),
			new GoogleDork("intext", t("GoogleDork.intext")),
			new GoogleDork("before/after", t("GoogleDork.before")),
			new GoogleDork("|", t("GoogleDork.or")),
			new GoogleDork("&", t("GoogleDork.and")),
			new GoogleDork("-", t("GoogleDork.exclude")),
			new GoogleSearch(),
		];
	},
});

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
				? search.minMatchScore + 1
				: 0,
		);
	}

	async execute(state: BobWindowState): Promise<void> {
		chrome.tabs.create({
			url: `https://google.com/search?q=${state.currentSearch.text.replace("g", "").trim().replaceAll(" ", "+")}`,
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
			search.text.length > 0 ? search.minMatchScore + 1 : 0,
		);
	}

	title(): string {
		return t("GoogleSearch");
	}

	description(): string {
		return t("GoogleSearch.description");
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconGoogle);
	}

	async execute(state: BobWindowState): Promise<void> {
		const query =
			state.currentSearch.words()[0] === "g"
				? state.currentSearch.text.slice(1).trim()
				: state.currentSearch.text;
		chrome.tabs.create({
			url: `https://google.com/search?q=${query.replaceAll(" ", "+")}`,
		});
		focusLastActiveWindow();
	}
}
