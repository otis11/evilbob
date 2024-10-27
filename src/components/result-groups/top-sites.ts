import { faviconFromUrl, iconArrowUpBold, iconFromString } from "../../icons";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Tag } from "../tags/tags";

export class TopSites extends ResultGroup {
	public id(): string {
		return "top-sites";
	}
	prefix = "top";
	permissions = ["topSites"];
	public description(): string {
		return "The top sites (i.e. most visited sites) that are displayed on the new tab page";
	}
	public name(): string {
		return "Top Sites";
	}

	public async getResults(): Promise<Result[]> {
		return (await chrome.topSites.get()).map(
			(site) => new MostVisitedURL(site),
		);
	}
}

export class MostVisitedURL extends Result {
	title(): string {
		return this.site.title;
	}
	description(): string {
		return this.site.url;
	}
	prepend(): HTMLElement | undefined {
		return faviconFromUrl(this.site.url);
	}
	tags(): Tag[] {
		return [{ html: iconFromString(iconArrowUpBold, "12px").outerHTML }];
	}
	constructor(private site: chrome.topSites.MostVisitedURL) {
		super();
	}
	public id(): string {
		return this.name() + this.site.url;
	}

	async execute(): Promise<void> {
		chrome.tabs.create({ url: this.site.url });
		focusLastActiveWindow();
	}
}
