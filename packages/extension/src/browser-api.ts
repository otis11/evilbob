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
	tabs: {
		async create(props: TabsCreateProps): Promise<void> {
			return await chrome.runtime.sendMessage({
				event: "chrome.tabs.create",
				data: props,
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
