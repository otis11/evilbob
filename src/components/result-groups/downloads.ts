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

export class ResultGroupDownloads extends ResultGroup {
	public prefix?: string | undefined = "d";
	permissions = ["downloads"];
	description = "List and manage downloads.";

	public async getResults(): Promise<Result[]> {
		const downloads = await chrome.downloads.search({});
		const results: Result[] = [];
		for (const download of downloads) {
			const icon = await chrome.downloads.getFileIcon(download.id);
			results.push(new ResultDownload(download, icon));
		}
		return results;
	}
}

export class ResultDownload extends Result {
	constructor(
		private item: chrome.downloads.DownloadItem,
		iconUrl?: string,
	) {
		const tags: Tag[] = [{ text: formatBytes(item.fileSize, true) }];

		if (item.state === "complete") {
			//
		} else if (item.state === "interrupted") {
			tags.push({ text: "interrupted", type: "error" });
		} else if (item.state === "in_progress") {
			tags.push({ text: "in progress" });
		}

		if (item.incognito) {
			tags.push({
				html: iconFromString(iconIncognito, "12px").outerHTML,
			});
		}

		super({
			title: item.filename,
			description: `${item.url}`,
			tags,
			prepend: iconUrl
				? iconFromUrl(iconUrl)
				: iconFromString(iconDownload),
		});

		this.options = new ResultDownloadOptions(this.item);
	}
	async execute(): Promise<void> {
		this.emitShowOptionsEvent();
	}
}

class ResultDownloadOptions extends ResultGroup {
	constructor(private item: chrome.downloads.DownloadItem) {
		super();
	}

	public async getResults(): Promise<Result[]> {
		return [
			new ResultShowDownload(this.item),
			new ResultEraseDownload(this.item),
			new ResultRemoveDownload(this.item),
		];
	}
}

class ResultShowDownload extends Result {
	constructor(private item: chrome.downloads.DownloadItem) {
		super({
			title: "Show in file explorer",
			description:
				"Opens the platform's file manager application to show the downloaded file in its containing folder.",
		});
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		chrome.downloads.show(this.item.id);
	}
}

class ResultEraseDownload extends Result {
	constructor(private item: chrome.downloads.DownloadItem) {
		super({
			title: "Erase download from browser",
			description:
				"Erases matching DownloadItems from the browser's download history, without deleting the downloaded files from disk.",
		});
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		await chrome.downloads.erase({ id: this.item.id });
		focusLastActiveWindow();
	}
}

class ResultRemoveDownload extends Result {
	constructor(private item: chrome.downloads.DownloadItem) {
		super({
			title: "Remove download from disk",
			description:
				"Removes a downloaded file from disk, but not from the browser's download history.",
		});
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		await chrome.downloads.removeFile(this.item.id);
		focusLastActiveWindow();
	}
}
