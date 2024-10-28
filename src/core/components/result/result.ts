import { iconDotsVertical, iconFromString } from "../../icons";
import { getUsage, updateUsage } from "../../usage";
import { wordSplitMatch } from "../../util/word-split-match";
import type { Search } from "../search";
import { type Tag, Tags } from "../tags/tags";
import "./result.css";

export abstract class Result {
	abstract title(): string;
	description(): string {
		return "";
	}
	options(): Result[] | undefined {
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

	static LiTemplate = (() => {
		const el = document.createElement("li");
		el.classList.add("result");
		return el;
	})();

	static HitTemplate = (() => {
		const el = document.createElement("span");
		el.classList.add("result-hit");
		return el;
	})();

	static OptionsTemplate = (() => {
		const span = document.createElement("span");
		span.classList.add("result-options");
		span.append(iconFromString(iconDotsVertical));
		span.title = "Shift Enter";
		return span;
	})();

	static lastInstanceId = 0;
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
	rootEl?: HTMLLIElement;
	titleEl?: HTMLElement;
	descriptionEl?: HTMLElement;

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

	// TODO make abstract and each result should implement it.
	public name() {
		return this.constructor.name;
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
		if (this.rootEl) {
			if (this.descriptionEl) {
				this.descriptionEl.innerHTML = "";
				this.descriptionEl.append(
					this.createMatchesElement(
						this.description(),
						this.lastSearch?.description.matches,
					),
				);
			}
			if (this.titleEl) {
				this.titleEl.innerHTML = "";
				this.titleEl.append(
					this.createMatchesElement(
						this.title(),
						this.lastSearch?.title.matches,
					),
				);
			}
			return this.rootEl;
		}

		this.rootEl = Result.LiTemplate.cloneNode(true) as HTMLLIElement;
		this.rootEl.setAttribute(
			"data-instance-id",
			this.instanceId.toString(),
		);

		const content = document.createElement("div");
		content.classList.add("result-content");

		const prepend = this.prepend();
		if (prepend) {
			const span = document.createElement("span");
			span.classList.add("result-prepend");
			span.append(prepend.cloneNode(true));
			this.rootEl.append(span);
		}

		this.titleEl = this.makeTitleElement();
		content.append(this.titleEl);

		const tags = this.tags();
		if (tags.length > 0) {
			const tagsEl = Tags(tags);
			content.append(tagsEl);
		}

		this.descriptionEl = this.makeDescriptionElement();
		content.append(this.descriptionEl);
		this.rootEl.append(content);

		const append = this.append();
		if (append) {
			const span = document.createElement("span");
			span.classList.add("result-append");
			span.append(append.cloneNode(true));
			this.rootEl.append(span);
		}

		if (this.options()) {
			const span = Result.OptionsTemplate.cloneNode(true);
			span.addEventListener("click", (event) => {
				event.stopImmediatePropagation();
				this.emitShowOptionsEvent();
			});
			this.rootEl.append(span);
		}
		return this.rootEl;
	}

	makeDescriptionElement() {
		const description = document.createElement("div");
		description.classList.add("result-description");
		description.append(
			this.createMatchesElement(
				this.description(),
				this.lastSearch?.description.matches,
			),
		);
		return description;
	}

	private createMatchesElement(str: string, matches?: boolean[]) {
		const fragment = document.createDocumentFragment();
		const l = str.length;
		const hasMatches = !!matches;
		for (let i = 0; i < l; i++) {
			if (hasMatches && matches[i]) {
				const result = Result.HitTemplate.cloneNode() as HTMLElement;
				result.innerText = str[i];
				fragment.appendChild(result);
			} else {
				fragment.appendChild(document.createTextNode(str[i]));
			}
		}
		return fragment;
	}

	makeTitleElement() {
		const title = document.createElement("div");
		title.classList.add("result-title");
		title.append(
			this.createMatchesElement(
				this.title(),
				this.lastSearch?.title.matches,
			),
		);
		return title;
	}
}
