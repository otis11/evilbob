import { Result } from "../../components/result/result";
import { getLiFromEvent } from "../../util/li-from-event";
import { resultOptionsContainer, resultsContainer } from "./dom";
import { bobWindowState } from "./main";
import { isResultOptionsVisible } from "./result-options";
import { updateSelectedIndex } from "./selected";

let lastMousePosition = {
	x: 0,
	y: 0,
};

window.addEventListener("click", (event) => {
	const target = getLiFromEvent(event);
	if (target) {
		const searchResult = Result.instanceFromId(
			target?.getAttribute("data-instance-id") || "",
		);
		searchResult?.onSelect(bobWindowState());
	}
});

window.addEventListener("mouseover", (event) => {
	// ignore mouseover if mouse stood still
	if (
		lastMousePosition.x === event.clientX &&
		lastMousePosition.y === event.clientY
	) {
		return;
	}

	lastMousePosition = {
		x: event.clientX,
		y: event.clientY,
	};

	const target = getLiFromEvent(event);

	if (target) {
		const container = isResultOptionsVisible()
			? resultOptionsContainer
			: resultsContainer;
		const index = Array.from(container.children).indexOf(target);

		updateSelectedIndex(index);
	}
});
