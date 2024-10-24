import { resultOptionsContainer, resultsContainer } from "./dom";
import { isResultOptionsVisible } from "./result-options";

let selectedResultIndex = 0;
let lastSelectedResultIndex = 0;

export function setLastSelectedResultIndex(n: number) {
	lastSelectedResultIndex = n;
}

export function getLastSelectedResultIndex() {
	return lastSelectedResultIndex;
}

export function getSelectedResultIndex() {
	return selectedResultIndex;
}

export function setSelectedResultIndex(n: number) {
	selectedResultIndex = n;
}

export function updateSelectedIndex(newIndex?: number, scrollTo = false) {
	if (typeof newIndex === "number") {
		selectedResultIndex = newIndex;
	}
	removeHighlightSelectedIndex();
	const el = (
		isResultOptionsVisible() ? resultOptionsContainer : resultsContainer
	).children[selectedResultIndex];

	if (!el) {
		return;
	}
	el.setAttribute("aria-selected", "");
	if (scrollTo) {
		el.scrollIntoView({
			behavior: "smooth",
		});
	}
}

function removeHighlightSelectedIndex() {
	for (const el of Array.from(document.querySelectorAll("[aria-selected]"))) {
		el.removeAttribute("aria-selected");
	}
}
