import { iconDotsVertical, iconFromString } from "../../icons";
import { getUsage, updateUsage } from "../../usage";
import { wordSplitMatch } from "../../util/word-split-match";
import type { ResultGroup } from "../result-group";
import type { Search } from "../search";
import { type Tag, Tags } from "../tags/tags";
import "./result.css";

export abstract class Result {
	abstract title(): string;
	description(): string {
		return "";
	}
	options(): ResultGroup | undefined {
		return undefined;
	}
	tags(): Tag[] {
		return [];
	}
	append(): HTMLElement | undefined {
		return undefined;
	}
	prepend(): HTMLElement | undefined {
		return undefined;
	}

	static lastInstanceId = 0
	instanceId: number;
	lastSearch?: {
		textLower: string;
		title: {
			score: number;
			matches: boolean[];
		};
		description: {
			score: number;
			matches: boolean[];
		};
	};
	cachedHtmlElement?: HTMLLIElement;

	static instanceFromId(id: string): Result | undefined {
		return Result.globalRegistry[id];
	}

	static globalRegistry: Record<string, Result> = {};

	constructor() {
		this.instanceId = Result.lastInstanceId++;
		Result.globalRegistry[this.instanceId] = this;
	}

	public search(search: Search) {
		if (search.textLower === this.lastSearch?.textLower) {
			return this.lastSearch;
		}

		this.lastSearch = {
			title: wordSplitMatch(
				search.text,
				search.textLower,
				this.title(),
				this.title().toLowerCase(),
			),
			description: wordSplitMatch(
				search.text,
				search.textLower,
				this.description(),
				this.description().toLowerCase(),
			),
			textLower: search.textLower,
		};

		return this.lastSearch;
	}

	makeFakeSearch(search: Search, scoreTitle?: number) {
		this.lastSearch = {
			title: wordSplitMatch(
				search.text,
				search.textLower,
				this.title(),
				this.title().toLowerCase(),
			),
			description: wordSplitMatch(
				search.text,
				search.textLower,
				this.description(),
				this.description().toLowerCase(),
			),
			textLower: search.textLower,
		};

		if (scoreTitle) {
			this.lastSearch.title.score = scoreTitle;
		}

		return this.lastSearch;
	}

	public emitShowOptionsEvent() {
		window.dispatchEvent(
			new CustomEvent("show-options-for-result", { detail: this }),
		);
	}

	public id() {
		return this.name();
	}

	public name() {
		return this.constructor.name;
	}

	public nameHumandReadable() {
		return this.name().replace("Result", "");
	}

	public async onSelect(search: Search, results: Result[]) {
		const currentUsage = await getUsage();
		let usage = currentUsage.results[this.id()];
		if (!usage) {
			usage = {
				c: 0,
				l: 0,
			};
		}
		usage.l = new Date().getTime();
		usage.c += 1;
		await updateUsage({
			results: {
				[this.id()]: usage,
			},
		});
		await this.execute(search, results);
	}

	abstract execute(search: Search, results: Result[]): Promise<void>;

	public asHtmlElement() {
		const li = document.createElement("li");
		li.classList.add("result");
		li.setAttribute("data-instance-id", this.instanceId.toString());

		const content = document.createElement("div");
		content.classList.add("result-content");

		const prepend = this.prepend();
		if (prepend) {
			const span = document.createElement("span");
			span.classList.add("result-prepend");
			span.append(prepend.cloneNode(true));
			li.append(span);
		}

		const title = this.makeTitleElement();
		content.append(title);

		if (this.tags.length > 0) {
			const tags = Tags(this.tags());
			content.append(tags);
		}

		const description = this.makeDescriptionElement();
		content.append(description);
		li.append(content);

		const append = this.append();
		if (append) {
			const span = document.createElement("span");
			span.classList.add("result-append");
			span.append(append.cloneNode(true));
			li.append(span);
		}

		if (this.options()) {
			const span = document.createElement("span");
			span.classList.add("result-options");
			span.append(iconFromString(iconDotsVertical));
			span.title = "Shift Enter";
			span.addEventListener("click", (event) => {
				event.stopImmediatePropagation();
				this.emitShowOptionsEvent();
			});
			li.append(span);
		}

		return li;
	}

	makeDescriptionElement() {
		const description = document.createElement("div");
		description.classList.add("result-description");
		description.append(
			...this.description()
				.split("")
				.map((char, index) => {
					if (this.lastSearch?.description.matches[index]) {
						const span = document.createElement("span");
						span.classList.add("result-hit");
						span.innerText = char;
						return span;
					}
					return document.createTextNode(char);
				}),
		);

		return description;
	}

	makeTitleElement() {
		const title = document.createElement("div");
		title.classList.add("result-title");
		title.innerHTML = "";
		title.append(
			...this.title()
				.split("")
				.map((char, index) => {
					if (this.lastSearch?.title.matches[index]) {
						const span = document.createElement("span");
						span.classList.add("result-hit");
						span.innerText = char;
						return span;
					}
					return document.createTextNode(char);
				}),
		);
		return title;
	}
}
