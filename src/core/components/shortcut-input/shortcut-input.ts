import { normalizeKey } from "../keys";
import { ShortcutElement } from "../shortcut";
import "./shortcut-input.css";

export function ShortcutInput(defaultKeys: string[]) {
	const div = document.createElement("div");
	div.classList.add("shortcut-input");
	const fake = document.createElement("div");
	fake.classList.add("shortcut-input-fake");
	const input = document.createElement("input");
	input.spellcheck = false;
	input.autocomplete = "off";
	let keysPressedDown: Record<string, boolean> = {};

	fake.innerHTML = ShortcutElement(defaultKeys).outerHTML;

	input.addEventListener("keydown", (keyboardEvent) => {
		keyboardEvent.preventDefault();
		keysPressedDown[normalizeKey(keyboardEvent.key)] = true;
		fake.innerHTML = ShortcutElement(
			Object.keys(keysPressedDown),
		).outerHTML;
	});
	input.addEventListener("keyup", (keyboardEvent) => {
		// this only needs to be tracked because of macOS and the Meta key. The Meta key does not trigger a keyup event for keys while its pressed.
		// if key not held down emulate the key up event for that specific key.
		// this is not perfect, as holding multiple keys down at once triggers only 1 keydown event for the last key pressed.
		// https://github.com/electron/electron/issues/5188
		if (keyboardEvent.key === "Meta") {
			keysPressedDown = {};
			return;
		}
		delete keysPressedDown[keyboardEvent.key];
	});
	div.append(input, fake);
	function getKeys() {
		return Array.from(fake.querySelectorAll("kbd"))
			.map((el) => el.textContent?.trim())
			.filter((a) => a !== undefined);
	}
	return [div, input, getKeys] as [
		HTMLDivElement,
		HTMLInputElement,
		typeof getKeys,
	];
}
