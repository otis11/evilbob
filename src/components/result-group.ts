import type { BrowserName } from "../platform";
import type { Result } from "./result/result";
import type { Search } from "./search";

export abstract class ResultGroup {
	public name = this.constructor.name;
	public nameHumanReadable = this.name.replace("ResultGroup", "");
	public permissions: string[] = [];
	public hostPermissions: string[] = [];
	public supportedBrowser: BrowserName[] = [
		"chromium",
		"firefox",
		"chrome",
		"edg",
	];

	public prefix?: string;
	public description = "";
	public results: Result[] = [];

	public async loadResults() {
		this.results = await this.getResults();
	}

	public abstract getResults(): Promise<Result[]>;

	public shouldRenderAlone(search: Search) {
		return !!this.prefix && search.words()[0] === this.prefix;
	}
}
