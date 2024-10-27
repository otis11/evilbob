import type { BrowserName } from "../platform";
import type { Result } from "./result/result";
import type { Search } from "./search";

export abstract class ResultGroup {
	public permissions: string[] = [];
	public hostPermissions: string[] = [];
	public supportedBrowsers: BrowserName[] = [
		"chromium",
		"firefox",
		"chrome",
		"edg",
	];

	public prefix?: string;
	public description(): string {
		return "";
	}
	public abstract name(): string;
	public abstract id(): string;
	public results: Result[] = [];

	public async loadResults() {
		this.results = await this.getResults();
	}

	public abstract getResults(): Promise<Result[]>;

	public shouldRenderAlone(search: Search) {
		return !!this.prefix && search.words()[0] === this.prefix;
	}
}
