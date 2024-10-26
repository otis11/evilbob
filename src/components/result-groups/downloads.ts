import {
	iconDownload,
	iconFromString,
	iconFromUrl,
	iconIncognito,
} from "../../icons";
import { formatBytes } from "../../util/format-bytes";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";
import type { Tag } from "../tags/tags";

export class Downloads extends ResultGroup {
	public prefix?: string | undefined = "d";
	permissions = ["downloads"];
	public description(): string {
		return "List and manage downloads.";
	}

	public name(): string {
		return "Downloads";
	}

	public async getResults(): Promise<Result[]> {
		const downloads = await chrome.downloads.search({});
		const results: Result[] = [];
		for (const download of downloads) {
			const icon = await chrome.downloads.getFileIcon(download.id);
			results.push(new Download(download, icon));
		}
		return results;
	}
}

export class Download extends Result {
	tags(): Tag[] {
		const tags: Tag[] = [{ text: formatBytes(this.item.fileSize, true) }];

		if (this.item.state === "complete") {
			//
		} else if (this.item.state === "interrupted") {
			tags.push({ text: "interrupted", type: "error" });
		} else if (this.item.state === "in_progress") {
			tags.push({ text: "in progress" });
		}

		if (this.item.incognito) {
			tags.push({
				html: iconFromString(iconIncognito, "12px").outerHTML,
			});
		}
		return tags;
	}

	title(): string {
		return this.item.filename;
	}

	description(): string {
		return this.item.url;
	}

	prepend(): HTMLElement | undefined {
		return this.iconUrl
			? iconFromUrl(this.iconUrl)
			: iconFromString(iconDownload);
	}

	options(): ResultGroup | undefined {
		return new DownloadOptions(this.item);
	}
	constructor(
		private item: chrome.downloads.DownloadItem,
		private iconUrl?: string,
	) {
		super();
	}
	async execute(): Promise<void> {
		this.emitShowOptionsEvent();
	}
}

class DownloadOptions extends ResultGroup {
	public name(): string {
		return "DownloadOptions";
	}
	constructor(private item: chrome.downloads.DownloadItem) {
		super();
	}

	public async getResults(): Promise<Result[]> {
		return [
			new ShowDownload(this.item),
			new EraseDownload(this.item),
			new RemoveDownload(this.item),
		];
	}
}

class ShowDownload extends Result {
	title(): string {
		return "Show in file explorer";
	}
	description(): string {
		return "Opens the platform's file manager application to show the downloaded file in its containing folder.";
	}
	constructor(private item: chrome.downloads.DownloadItem) {
		super();
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		chrome.downloads.show(this.item.id);
	}
}

class EraseDownload extends Result {
	title(): string {
		return "Erase download from browser";
	}
	description(): string {
		return "Erases matching DownloadItems from the browser's download history, without deleting the downloaded files from disk.";
	}
	constructor(private item: chrome.downloads.DownloadItem) {
		super();
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		await chrome.downloads.erase({ id: this.item.id });
		focusLastActiveWindow();
	}
}

class RemoveDownload extends Result {
	title(): string {
		return "Remove download from disk";
	}
	description(): string {
		return "Removes a downloaded file from disk, but not from the browser's download history.";
	}
	constructor(private item: chrome.downloads.DownloadItem) {
		super();
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		await chrome.downloads.removeFile(this.item.id);
		focusLastActiveWindow();
	}
}
