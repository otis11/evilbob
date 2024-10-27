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
	cachedHtmlElement?: HTMLLIElement;
	cachedTitle?: HTMLElement;
	cachedDescription?: HTMLElement;
	resultHitElement: HTMLElement;

	static instanceFromId(id: string): Result | undefined {
		return Result.globalRegistry[id];
	}

	static globalRegistry: Record<string, Result> = {};

	constructor() {
		this.instanceId = Result.lastInstanceId++;
		Result.globalRegistry[this.instanceId] = this;

		this.resultHitElement = document.createElement("span");
		this.resultHitElement.classList.add("result-hit");
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
		if (this.cachedHtmlElement) {
			if (this.cachedDescription) {
				this.cachedDescription.innerHTML = "";
				this.cachedDescription.append(
					this.createMatchesElement(
						this.description(),
						this.lastSearch?.description.matches,
					),
				);
			}
			if (this.cachedTitle) {
				this.cachedTitle.innerHTML = "";
				this.cachedTitle.append(
					this.createMatchesElement(
						this.title(),
						this.lastSearch?.title.matches,
					),
				);
			}

			return this.cachedHtmlElement;
		}

		this.cachedHtmlElement = document.createElement("li");
		this.cachedHtmlElement.classList.add("result");
		this.cachedHtmlElement.setAttribute(
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
			this.cachedHtmlElement.append(span);
		}

		this.cachedTitle = this.makeTitleElement();
		content.append(this.cachedTitle);

		if (this.tags.length > 0) {
			const tags = Tags(this.tags());
			content.append(tags);
		}

		this.cachedDescription = this.makeDescriptionElement();
		content.append(this.cachedDescription);
		this.cachedHtmlElement.append(content);

		const append = this.append();
		if (append) {
			const span = document.createElement("span");
			span.classList.add("result-append");
			span.append(append.cloneNode(true));
			this.cachedHtmlElement.append(span);
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
			this.cachedHtmlElement.append(span);
		}

		return this.cachedHtmlElement;
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
				const result = this.resultHitElement.cloneNode() as HTMLElement;
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
