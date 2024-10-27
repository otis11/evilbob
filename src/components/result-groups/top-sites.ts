import { faviconFromUrl, iconArrowUpBold, iconFromString } from "../../icons";
import { t } from "../../locale";
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
		return t("TopSites.description");
	}
	public name(): string {
		return t("TopSites");
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
