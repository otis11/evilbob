export interface TabsCreateProps {
	url: string;
}

export interface BookmarksCreateProps {
	title: string;
	url: string;
}

export type ChromeStorageSetProps = {
	// biome-ignore lint/suspicious/noExplicitAny: chrome.storage.set has any
	[key: string]: any;
};

export const browserApi = {
	runtime: {
		async openOptionsPage(): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.runtime.openOptionsPage",
			});
		},
	},
	sessions: {
		async getRecentlyClosed(
			props: chrome.sessions.Filter,
		): Promise<chrome.sessions.Session[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.sessions.getRecentlyClosed",
				data: props,
			});
		},
		async restore(sessionId: string): Promise<chrome.sessions.Session> {
			return await chrome.runtime.sendMessage({
				event: "chrome.sessions.restore",
				data: sessionId,
			});
		},
	},
	cookies: {
		async getAll(
			props: chrome.cookies.GetAllDetails,
		): Promise<chrome.cookies.Cookie[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.cookies.getAll",
				data: props,
			});
		},
		async remove(
			props: chrome.cookies.CookieDetails,
		): Promise<chrome.cookies.CookieDetails> {
			return await chrome.runtime.sendMessage({
				event: "chrome.cookies.remove",
				data: props,
			});
		},
	},
	downloads: {
		async getFileIcon(
			downloadId: number,
			options?: chrome.downloads.GetFileIconOptions,
		): Promise<string> {
			return await chrome.runtime.sendMessage({
				event: "chrome.downloads.getFileIcon",
				data: { downloadId, options },
			});
		},
		async show(downloadId: number): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.downloads.show",
				data: downloadId,
			});
		},
		async erase(query: chrome.downloads.DownloadQuery): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.downloads.erase",
				data: query,
			});
		},
		async search(
			query: chrome.downloads.DownloadQuery,
		): Promise<chrome.downloads.DownloadItem[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.downloads.search",
				data: query,
			});
		},
		async removeFile(id: number): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.downloads.removeFile",
				data: id,
			});
		},
		async showDefaultFolder(): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.downloads.showDefaultFolder",
			});
		},
	},
	topSites: {
		async get(): Promise<chrome.topSites.MostVisitedURL[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.topSites.get",
			});
		},
	},
	management: {
		async getAll(): Promise<chrome.management.ExtensionInfo[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.management.getAll",
			});
		},
		async uninstall(props: {
			id: string;
			options?: chrome.management.UninstallOptions;
		}): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.management.uninstall",
				data: props,
			});
		},
	},
	history: {
		async search(props: chrome.history.HistoryQuery) {
			return await chrome.runtime.sendMessage({
				event: "chrome.history.search",
				data: props,
			});
		},
		async deleteUrl(props: chrome.history.Url) {
			return await chrome.runtime.sendMessage({
				event: "chrome.history.deleteUrl",
				data: props,
			});
		},
		async getVisits(
			props: chrome.history.Url,
		): Promise<chrome.history.VisitItem[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.history.getVisits",
				data: props,
			});
		},
	},
	tabs: {
		async create(props: TabsCreateProps): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.tabs.create",
				data: props,
			});
		},
		async remove(tabId: number): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.tabs.remove",
				data: tabId,
			});
		},
		async query(props: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.tabs.query",
				data: props,
			});
		},
		async duplicate(props: number): Promise<chrome.tabs.Tab[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.tabs.duplicate",
				data: props,
			});
		},
		async move(
			tabId: number | number[],
			moveProperties: chrome.tabs.MoveProperties,
		) {
			return await chrome.runtime.sendMessage({
				event: "chrome.tabs.move",
				data: { tabId, moveProperties },
			});
		},
		async update(
			id: number,
			props: chrome.tabs.UpdateProperties,
		): Promise<chrome.tabs.Tab | undefined> {
			return await chrome.runtime.sendMessage({
				event: "chrome.tabs.update",
				data: { id, props },
			});
		},
	},
	browsingData: {
		async remove(
			options: chrome.browsingData.RemovalOptions,
			dataToRemove: chrome.browsingData.DataTypeSet,
		): Promise<chrome.windows.Window[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.browsingData.remove",
				data: {
					options,
					dataToRemove,
				},
			});
		},
	},
	windows: {
		async getAll(): Promise<chrome.windows.Window[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.windows.getAll",
			});
		},
		async create(
			props: chrome.windows.CreateData,
		): Promise<chrome.windows.Window> {
			return await chrome.runtime.sendMessage({
				event: "chrome.windows.create",
				data: props,
			});
		},
		async getLastFocused(): Promise<chrome.windows.Window> {
			return await chrome.runtime.sendMessage({
				event: "chrome.windows.getLastFocused",
			});
		},
		async remove(id: number): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.windows.remove",
				data: id,
			});
		},
	},
	bookmarks: {
		async getTree() {
			return await chrome.runtime.sendMessage({
				event: "chrome.bookmarks.getTree",
			});
		},
		async create(props: BookmarksCreateProps) {
			return await chrome.runtime.sendMessage({
				event: "chrome.bookmarks.create",
				data: props,
			});
		},
		async remove(id: string) {
			return await chrome.runtime.sendMessage({
				event: "chrome.bookmarks.remove",
				data: id,
			});
		},
		async search(
			query: string | chrome.bookmarks.SearchQuery,
		): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.bookmarks.search",
				data: query,
			});
		},
		async update(id: string, changes: chrome.bookmarks.UpdateChanges) {
			return await chrome.runtime.sendMessage({
				event: "chrome.bookmarks.update",
				data: { id, changes },
			});
		},
	},
	storage: {
		local: {
			async set(data: ChromeStorageSetProps) {
				return await chrome.runtime.sendMessage({
					event: "chrome.storage.local.set",
					data: data,
				});
			},
			async get(keys: string[]) {
				return await chrome.runtime.sendMessage({
					event: "chrome.storage.local.get",
					data: keys,
				});
			},
		},
		sync: {
			async set(data: ChromeStorageSetProps) {
				return await chrome.runtime.sendMessage({
					event: "chrome.storage.sync.set",
					data: data,
				});
			},
			async get(keys: string[]) {
				return await chrome.runtime.sendMessage({
					event: "chrome.storage.sync.get",
					data: keys,
				});
			},
		},
	},
};

export async function getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
	const [currentTab] = await browserApi.tabs.query({
		active: true,
		currentWindow: true,
	});
	return currentTab;
}
