import { getCurrentDimensions } from "./themes";

console.log("bob.background.start");

let openBobWindowId = -1;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("bob.background.message.received", message, sender);
});

chrome.commands.onCommand.addListener((command) => {
	console.log("bob.background.command.received", command);
	if (command === "bob.open") {
		openBob();
	}
});

chrome.action.onClicked.addListener(() => {
	chrome.runtime.openOptionsPage();
});

function openBob() {
	chrome.windows.getLastFocused({ populate: false }, (currentWindow) => {
		chrome.windows.get(openBobWindowId, async (activeBobWindow) => {
			if (activeBobWindow) {
				chrome.windows.update(openBobWindowId, {
					focused: true,
				});
				return;
			}

			const dimensions = await getCurrentDimensions();
			const left =
				(currentWindow.left || 0) +
				Math.floor(((currentWindow.width || 0) - dimensions.width) / 2);
			const top =
				(currentWindow.top || 0) +
				Math.floor(
					((currentWindow.height || 0) - dimensions.height) / 2,
				);
			console.log(currentWindow);

			chrome.windows.create(
				{
					url: "search-view/index.html",
					type: "popup",
					width: dimensions.width,
					height: dimensions.height,
					left: left,
					top: top,
					focused: true,
				},
				(newWindow) => {
					if (!newWindow) {
						console.log("bob.open.error.try.default");
						chrome.windows.create(
							{
								url: "search-view/index.html",
								type: "popup",
								width: currentWindow.width,
								height: currentWindow.height,
								left: currentWindow.left,
								top: currentWindow.top,
								focused: true,
							},
							(newWindow) => {
								openBobWindowId = newWindow?.id || -1;
							},
						);
					} else {
						openBobWindowId = newWindow.id || -1;
					}
				},
			);
		});
	});
}
