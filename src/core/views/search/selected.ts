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

export function selectNextResult() {
	let newIndex = getSelectedResultIndex();
	const container = isResultOptionsVisible()
		? resultOptionsContainer
		: resultsContainer;
	if (newIndex === container.children.length - 1) {
		newIndex = 0;
	} else {
		newIndex += 1;
	}
	updateSelectedIndex(newIndex, true);
}

export function selectPrevResult() {
	let newIndex = getSelectedResultIndex();
	const container = isResultOptionsVisible()
		? resultOptionsContainer
		: resultsContainer;
	if (newIndex === 0 || newIndex === -1) {
		newIndex = container.children.length - 1;
	} else {
		newIndex -= 1;
	}
	updateSelectedIndex(newIndex, true);
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
