chrome.commands.onCommand.addListener(async (command) => {
	if (command === "open") {
		await tryOpenEvilbobCurrentTab();
	}
});

chrome.runtime.onInstalled.addListener(async (details) => {
	if (details.reason === "install") {
		await chrome.tabs.create({ url: "src/views/welcome/welcome.html" });
	}

	if (details.reason === "update") {
		// on update
	}
	// set uninstall url
	// chrome.runtime.setUninstallURL();
});

// biome-ignore lint/suspicious/noExplicitAny: can be any here
async function notifyBackgroundError(err: any) {
	const [currentTab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});
	await chrome.tabs.sendMessage(currentTab?.id || -1, {
		event: "background-error",
		data: err,
	});
}

async function tryOpenEvilbobCurrentTab(): Promise<void> {
	const [currentTab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});
	try {
		await chrome.tabs.sendMessage(currentTab?.id || -1, {
			event: "open",
		});
	} catch (error) {
		// cannot send a message to the current tab
		console.error(error);
		const emptyTab = await chrome.tabs.create({
			url: "src/views/evilbob-empty-page/evilbob-empty-page.html",
		});
	}
}

chrome.action.onClicked.addListener(async () => {
	await tryOpenEvilbobCurrentTab();
});

// do callback not make async
// https://developer.chrome.com/docs/extensions/develop/concepts/messaging
// return true if the sender should wait for a response
// return false if its done
// !! do not add async. Breaks in firefox sendResponse, will always be undefined
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	const event = message.event;
	const data = message.data;
	if (event === "open-evilbob") {
		tryOpenEvilbobCurrentTab().then();
	} else if (event === "open-plugins") {
		chrome.tabs.create({
			url: "src/views/plugins/plugins.html",
		});
	} else if (event === "chrome.tabs.create") {
		chrome.tabs
			.create({ url: data.url })
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.bookmarks.getTree") {
		chrome.bookmarks
			.getTree()
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.bookmarks.create") {
		chrome.bookmarks
			.create({
				title: data.title,
				url: data.url,
			})
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.storage.sync.get") {
		chrome.storage.sync
			.get(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.storage.sync.set") {
		chrome.storage.sync
			.set(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.storage.local.get") {
		chrome.storage.local
			.get(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.storage.local.set") {
		chrome.storage.local
			.set(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.tabs.query") {
		chrome.tabs
			.query(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.windows.getAll") {
		chrome.windows
			.getAll()
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.windows.getLastFocused") {
		chrome.windows
			.getLastFocused()
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.windows.create") {
		chrome.windows
			.create(data)
			// @ts-expect-error seems to have the wrong type in @types/chrome. can be removed when fixed.
			.then((res) => sendResponse(res))
			// @ts-expect-error seems to have the wrong type in @types/chrome. can be removed when fixed.
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.tabs.move") {
		chrome.tabs
			.move(data.tabId, data.moveProperties)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.tabs.remove") {
		chrome.tabs
			.remove(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.windows.remove") {
		chrome.windows
			.remove(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.topSites.get") {
		chrome.topSites
			.get()
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.history.search") {
		chrome.history
			.search(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.tabs.update") {
		chrome.tabs
			.update(data.id, data.props)
			// @ts-expect-error seems to have the wrong type in @types/chrome. can be removed when fixed.
			.then((res) => sendResponse(res))
			// @ts-expect-error seems to have the wrong type in @types/chrome. can be removed when fixed.
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.history.deleteUrl") {
		chrome.history
			.deleteUrl(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.history.getVisits") {
		chrome.history
			.getVisits(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.management.getAll") {
		chrome.management
			.getAll()
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.management.uninstall") {
		chrome.management
			.uninstall(data.id, data.options)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.tabs.duplicate") {
		chrome.tabs
			.duplicate(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.browsingData.remove") {
		chrome.browsingData
			.remove(data.options, data.dataToRemove)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.downloads.erase") {
		chrome.downloads
			.erase(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.downloads.show") {
		chrome.downloads.show(data);
	} else if (event === "chrome.downloads.getFileIcon") {
		chrome.downloads
			.getFileIcon(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.downloads.search") {
		chrome.downloads
			.search(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.downloads.removeFile") {
		chrome.downloads
			.removeFile(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.cookies.getAll") {
		chrome.cookies
			.getAll(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.cookies.remove") {
		chrome.cookies
			.remove(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.sessions.getRecentlyClosed") {
		chrome.sessions
			.getRecentlyClosed(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.sessions.restore") {
		chrome.sessions
			.restore(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.downloads.showDefaultFolder") {
		chrome.downloads.showDefaultFolder();
	} else if (event === "chrome.runtime.openOptionsPage") {
		chrome.runtime.openOptionsPage();
	} else if (event === "chrome.bookmarks.remove") {
		chrome.bookmarks
			.remove(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	} else if (event === "chrome.bookmarks.search") {
		chrome.bookmarks
			.search(data)
			.then((res) => sendResponse(res))
			.catch((err) => notifyBackgroundError(err));
		return true;
	}
	return false;
});
