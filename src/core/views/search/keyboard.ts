import { Result } from "../../components/result/result";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { resultOptionsContainer, resultsContainer, searchInput } from "./dom";
import { bobWindowState } from "./main";
import {
	closeResultOptions,
	isResultOptionsVisible,
	showResultOptions,
} from "./result-options";
import {
	getLastSelectedResultIndex,
	getSelectedResultIndex,
	selectNextResult,
	selectPrevResult,
	updateSelectedIndex,
} from "./selected";

let arrowKeyHeldDownCurrent: "ArrowDown" | "ArrowUp";
let arrowKeyHeldDownTimeout: Timer | number = 0;
const ARROW_KEY_HELD_DOWN_INITIAL_MS = 300;
const ARROW_KEY_HELD_DOWN_BETWEEN_MS = 100;

function onKeyUp(event: KeyboardEvent) {
	const container = isResultOptionsVisible()
		? resultOptionsContainer
		: resultsContainer;

	if (event.key === "ArrowDown") {
		clearTimeout(arrowKeyHeldDownTimeout);
		arrowKeyHeldDownTimeout = 0;
		selectNextResult();
	}
	if (event.key === "ArrowUp") {
		clearTimeout(arrowKeyHeldDownTimeout);
		arrowKeyHeldDownTimeout = 0;
		selectPrevResult();
	}
	if (event.key === "Enter") {
		const target = container.children[getSelectedResultIndex()];
		const searchResult = Result.instanceFromId(
			target?.getAttribute("data-instance-id") || "",
		);

		if (event.shiftKey && !isResultOptionsVisible() && searchResult) {
			showResultOptions(searchResult);
		} else {
			searchResult?.onSelect(bobWindowState());
		}
	}
}

function onArrowKeyHeldDown() {
	if (arrowKeyHeldDownCurrent === "ArrowDown") {
		selectNextResult();
	}
	if (arrowKeyHeldDownCurrent === "ArrowUp") {
		selectPrevResult();
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
			focusLastActiveWindow();
		}
	}
});
