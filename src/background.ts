chrome.commands.onCommand.addListener(async (command) => {
	if (command === "open") {
		await tryOpenEvilbobCurrentTab();
	}
});

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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	const event = message.event;
	const data = message.data;
	if (event === "open-plugins") {
		chrome.tabs.create({
			url: "src/views/plugins/plugins.html",
		});
	} else if (event === "chrome.tabs.create") {
		chrome.tabs.create({ url: data.url }).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.bookmarks.getTree") {
		chrome.bookmarks.getTree().then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.bookmarks.create") {
		chrome.bookmarks
			.create({
				title: data.title,
				url: data.url,
			})
			.then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.storage.sync.get") {
		chrome.storage.sync.get(data).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.storage.sync.set") {
		chrome.storage.sync.set(data).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.storage.local.get") {
		chrome.storage.local.get(data).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.storage.local.set") {
		chrome.storage.local.set(data).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.tabs.query") {
		chrome.tabs.query(data).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.windows.getAll") {
		chrome.windows.getAll().then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.windows.remove") {
		chrome.windows.remove(data).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.topSites.get") {
		chrome.topSites.get().then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.history.search") {
		chrome.history.search(data).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.tabs.update") {
		chrome.tabs.update(data).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.history.deleteUrl") {
		chrome.history.deleteUrl(data).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.history.getVisits") {
		chrome.history.getVisits(data).then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.management.getAll") {
		chrome.management.getAll().then((res) => sendResponse(res));
		return true;
	} else if (event === "chrome.management.uninstall") {
		chrome.management
			.uninstall(data.id, data.options)
			.then((res) => sendResponse(res));
		return true;
	}
	return false;
});
