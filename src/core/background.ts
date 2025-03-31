import { getConfig } from "./config";
import type { Dimensions } from "./theme";

let currentWindow: chrome.windows.Window | undefined;
let windowDimensions: Dimensions | undefined;

chrome.runtime.onInstalled.addListener(async (details) => {
	if (details.reason === "install") {
		await chrome.tabs.create({ url: "/src/core/views/welcome/index.html" });
	}

	if (details.reason === "update") {
		// on update
	}
	// set uninstall url
	// chrome.runtime.setUninstallURL();
});

chrome.commands.onCommand.addListener(async (command) => {
	if (command === "bob.open") {
		const config = await getConfig(true);
		if (config.windowType === "inline-iframe") {
			openBobInlineIFrame();
		} else {
			await openBobExtraWindow();
		}
	}
});

function openBobInlineIFrame() {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs[0]?.id) {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{ type: "bob.open.inline" },
				(response) => {},
			);
		}
	});
}

chrome.action.onClicked.addListener(async () => {
	await chrome.runtime.openOptionsPage();
});

chrome.windows.getCurrent().then((w) => {
	currentWindow = w;
});
chrome.windows.onFocusChanged.addListener(async () => {
	currentWindow = await chrome.windows.getCurrent();
});

chrome.windows.onRemoved.addListener(async (windowId) => {
	if (windowId === (await getLastBobWindowId())) {
		await chrome.storage.local.set({
			lastBobWindowId: -1,
		});
	}
});

async function getLastBobWindowId() {
	// Important: this cannot be stored inside a variable as browsers can stop activated service workers
	// which causes the variable value to reset and this caused multiple bob windows to open in the past.
	// Service workers should be stateless.
	// https://github.com/otis11/bob-command-palette/issues/32
	// https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle#idle-shutdown
	return (await chrome.storage.local.get("lastBobWindowId"))
		.lastBobWindowId as number;
}

async function openBobExtraWindow() {
	const freshConfig = await getConfig(true);
	const lastBobWindowId = await getLastBobWindowId();
	await chrome.storage.local.set({
		lastFocusedWindowId: currentWindow?.id,
	});
	if (lastBobWindowId > 0) {
		await chrome.windows.update(lastBobWindowId, {
			focused: true,
		});
		// no error occurred focusing the last bob window. Don't continue to open a new bob window.
		if (!chrome.runtime.lastError) {
			return;
		}
	}

	if (!windowDimensions) {
		windowDimensions = (await getConfig()).dimensions;
	}

	const left =
		(currentWindow?.left || 0) +
		Math.floor(((currentWindow?.width || 0) - windowDimensions.width) / 2);
	const top =
		(currentWindow?.top || 0) +
		Math.floor(
			((currentWindow?.height || 0) - windowDimensions.height) / 2,
		);
	let newBobWindow: chrome.windows.Window;
	try {
		newBobWindow = await chrome.windows.create({
			url: "/src/core/views/search/index.html",
			type:
				freshConfig.windowType === "inline-iframe"
					? "popup"
					: freshConfig.windowType,
			width: windowDimensions.width,
			height: windowDimensions.height,
			left: left,
			top: top,
			focused: true,
		});
	} catch {
		if (chrome.runtime.lastError) {
			console.error("could not open bob window");
		}
		newBobWindow = await chrome.windows.create({
			url: "/src/core/views/search/index.html",
			type:
				freshConfig.windowType === "inline-iframe"
					? "popup"
					: freshConfig.windowType,
			width: currentWindow?.width || 600,
			height: currentWindow?.height || 400,
			left: currentWindow?.left || 0,
			top: currentWindow?.top || 0,
			focused: true,
		});
	}

	await chrome.storage.local.set({
		lastBobWindowId: newBobWindow.id || -1,
	});
}
