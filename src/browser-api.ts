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
	topSites: {
		async get() {
			return await chrome.runtime.sendMessage({
				event: "chrome.topSites.get",
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
	},
	tabs: {
		async create(props: TabsCreateProps): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.tabs.create",
				data: props,
			});
		},
		async query(props: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.tabs.query",
				data: props,
			});
		},
		async update(
			props: chrome.tabs.UpdateProperties,
		): Promise<chrome.tabs.Tab | undefined> {
			return await chrome.runtime.sendMessage({
				event: "chrome.tabs.update",
				data: props,
			});
		},
	},
	windows: {
		async getAll(): Promise<chrome.windows.Window[]> {
			return await chrome.runtime.sendMessage({
				event: "chrome.windows.getAll",
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
