import { faviconFromUrl, iconArrowUpBold, iconFromString } from "../../icons";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class ResultGroupTopSites extends ResultGroup {
	prefix = "top";
	permissions = ["topSites"];
	description =
		"The top sites (i.e. most visited sites) that are displayed on the new tab page";

	public async getResults(): Promise<Result[]> {
		return (await chrome.topSites.get()).map(
			(site) => new ResultMostVisitedURL(site),
		);
	}
}

export class ResultMostVisitedURL extends Result {
	constructor(private site: chrome.topSites.MostVisitedURL) {
		super({
			title: site.title,
			description: site.url,
			prepend: faviconFromUrl(site.url),
			tags: [{ html: iconFromString(iconArrowUpBold, "12px").outerHTML }],
		});
	}
	public id(): string {
		return this.name() + this.site.url;
	}

	async execute(): Promise<void> {
		chrome.tabs.create({ url: this.site.url });
		window.close();
	}
}
