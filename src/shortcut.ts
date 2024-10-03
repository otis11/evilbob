export function shortcutAsHtmlElement(keys: string[]) {
	const container = document.createElement("div");
	container.classList.add("shortcut");
	for (const key of keys) {
		const kbd = document.createElement("kbd");
		kbd.innerText = key;
		container.append(kbd);
	}
	return container;
}
