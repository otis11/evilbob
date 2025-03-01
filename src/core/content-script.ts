chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "bob.open.inline") {
		if (document.getElementById("bob-search-iframe-dialog")) {
			return true;
		}

		const dialog = document.createElement("div");
		dialog.style.position = "fixed";
		dialog.style.zIndex = "2147483647";
		dialog.style.top = "0";
		dialog.style.left = "0";
		dialog.style.right = "0";
		dialog.style.bottom = "0";
		dialog.style.width = "100%";
		dialog.style.height = "100%";
		dialog.style.minHeight = "100%";
		dialog.style.minWidth = "100%";
		dialog.style.display = "flex";
		dialog.style.justifyContent = "center";
		dialog.style.alignItems = "center";
		dialog.id = "bob-search-iframe-dialog";
		dialog.style.background = "rgba(0,0,0,0.6)";

		const iframe = document.createElement("iframe");

		iframe.src =
			"chrome-extension://lheepncdpplcjclapcdacckeihbekldk/src/core/views/search/index.html";

		iframe.id = "bob-search-iframe";
		iframe.style.border = "none";
		iframe.style.outline = "none";
		iframe.height = `${window.innerHeight / 1.5}px`;
		iframe.width = `${window.innerWidth / 1.5}px`;
		dialog.appendChild(iframe);

		document.body.appendChild(dialog);

		window.focus();
	}
	return true;
});

document.addEventListener("click", (clickEvent) => {
	const path = clickEvent.composedPath();
	let hasClickedInsideBobSearch = false;
	for (const element of path) {
		if (
			element instanceof HTMLElement &&
			element.id === "bob-search-iframe"
		) {
			hasClickedInsideBobSearch = true;
		}
	}

	if (!hasClickedInsideBobSearch) {
		document.getElementById("bob-search-iframe-dialog")?.remove();
	}
});
