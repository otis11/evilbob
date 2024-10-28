import { isElementInViewport } from "../../util/viewport";
import { resultOptionsContainer, resultsContainer, searchInput } from "./dom";
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

	if (!(el instanceof HTMLElement)) {
		return;
	}
	el.setAttribute("aria-selected", "");
	if (scrollTo) {
		if (!isElementInViewport(el)) {
			document.documentElement.scrollTop =
				el.offsetTop - searchInput.clientHeight;
		}
	}
}

function removeHighlightSelectedIndex() {
	for (const el of Array.from(document.querySelectorAll("[aria-selected]"))) {
		el.removeAttribute("aria-selected");
	}
}
