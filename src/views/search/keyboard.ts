import { Result } from "../../components/result/result";
import {
	optionsSearchInput,
	resultOptionsContainer,
	resultsContainer,
	searchInput,
} from "./dom";
import {
	closeResultOptions,
	isResultOptionsVisible,
	showResultOptions,
} from "./result-options";
import { getCurrentResults } from "./results";
import { newSearch } from "./search";
import {
	getLastSelectedResultIndex,
	getSelectedResultIndex,
	updateSelectedIndex,
} from "./selected";

let arrowKeyHeldDownCurrent: "ArrowDown" | "ArrowUp";
let arrowKeyHeldDownTimeout: Timer | number = 0;
const ARROW_KEY_HELD_DOWN_INITIAL_MS = 300;
const ARROW_KEY_HELD_DOWN_BETWEEN_MS = 100;

function onKeyUp(event: KeyboardEvent) {
	let newIndex = getSelectedResultIndex();
	const container = isResultOptionsVisible()
		? resultOptionsContainer
		: resultsContainer;

	if (event.key === "ArrowDown") {
		clearTimeout(arrowKeyHeldDownTimeout);
		arrowKeyHeldDownTimeout = 0;
		if (newIndex === container.children.length - 1) {
			newIndex = 0;
		} else {
			newIndex += 1;
		}
		updateSelectedIndex(newIndex, true);
	}
	if (event.key === "ArrowUp") {
		clearTimeout(arrowKeyHeldDownTimeout);
		arrowKeyHeldDownTimeout = 0;
		if (newIndex === 0 || newIndex === -1) {
			newIndex = container.children.length - 1;
		} else {
			newIndex -= 1;
		}
		updateSelectedIndex(newIndex, true);
	}
	if (event.key === "Enter") {
		const target = container.children[getSelectedResultIndex()];
		const searchResult = Result.instanceFromId(
			target?.getAttribute("data-instance-id") || "",
		);
		const search = newSearch(
			isResultOptionsVisible() ? optionsSearchInput : searchInput,
		);

		if (event.shiftKey && !isResultOptionsVisible() && searchResult) {
			showResultOptions(searchResult);
		} else {
			searchResult?.onSelect(search, getCurrentResults());
		}
	}
}

function onArrowKeyHeldDown() {
	let newIndex = getSelectedResultIndex();
	const container = isResultOptionsVisible()
		? resultOptionsContainer
		: resultsContainer;
	if (arrowKeyHeldDownCurrent === "ArrowDown") {
		if (newIndex === container.children.length - 1) {
			newIndex = 0;
		} else {
			newIndex += 1;
		}
		updateSelectedIndex(newIndex, true);
	}
	if (arrowKeyHeldDownCurrent === "ArrowUp") {
		if (newIndex === 0 || newIndex === -1) {
			newIndex = container.children.length - 1;
		} else {
			newIndex -= 1;
		}
		updateSelectedIndex(newIndex, true);
	}
	arrowKeyHeldDownTimeout = setTimeout(
		onArrowKeyHeldDown,
		ARROW_KEY_HELD_DOWN_BETWEEN_MS,
	);
}

function onKeyDown(event: KeyboardEvent) {
	if (event.key === "ArrowDown" || event.key === "ArrowUp") {
		event.preventDefault();
		if (!arrowKeyHeldDownTimeout) {
			arrowKeyHeldDownCurrent = event.key;
			arrowKeyHeldDownTimeout = setTimeout(
				onArrowKeyHeldDown,
				ARROW_KEY_HELD_DOWN_INITIAL_MS,
			);
		}
	}
}
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		if (isResultOptionsVisible()) {
			closeResultOptions();
			updateSelectedIndex(getLastSelectedResultIndex());
			searchInput?.focus();
			document.documentElement.style.overflow = "unset";
		} else {
			window.close();
		}
	}
});
