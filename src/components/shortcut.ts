export class Shortcut {
	constructor(public keys: string[]) {}

	asHtmlElement() {
		const container = document.createElement("div");
		container.classList.add("shortcut");
		for (const key of this.keys) {
			const kbd = document.createElement("kbd");
			kbd.innerText = key;
			container.append(kbd);
		}
		return container;
	}
}
