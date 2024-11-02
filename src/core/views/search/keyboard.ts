import { registerKeysListener } from "../../components/keys";
import { Result } from "../../components/result/result";
import { getConfig } from "../../config";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { resultOptionsContainer, resultsContainer, searchInput } from "./dom";
import { setLoading } from "./loading";
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

(async () => {
	const config = await getConfig();
	registerKeysListener(config.keybinds.nextResult?.keys || [], () => {
		selectNextResult();
	});
	registerKeysListener(config.keybinds.previousResult?.keys || [], () => {
		selectPrevResult();
	});
	registerKeysListener(config.keybinds.selectResult?.keys || [], async () => {
		const container = isResultOptionsVisible()
			? resultOptionsContainer
			: resultsContainer;
		const target = container.children[getSelectedResultIndex()];
		const searchResult = Result.instanceFromId(
			target?.getAttribute("data-instance-id") || "",
		);
		setLoading(true);
		await searchResult?.onSelect(bobWindowState());
		setLoading(false);
	});

	registerKeysListener(config.keybinds.openResultOptions?.keys || [], () => {
		const container = isResultOptionsVisible()
			? resultOptionsContainer
			: resultsContainer;
		const target = container.children[getSelectedResultIndex()];
		const searchResult = Result.instanceFromId(
			target?.getAttribute("data-instance-id") || "",
		);
		if (searchResult) {
			showResultOptions(searchResult);
		}
	});

	registerKeysListener(config.keybinds.close?.keys || [], () => {
		if (isResultOptionsVisible()) {
			closeResultOptions();
			updateSelectedIndex(getLastSelectedResultIndex());
			searchInput?.focus();
			document.documentElement.style.overflow = "unset";
		} else {
			focusLastActiveWindow();
		}
	});
})();

function onKeyDown(event: KeyboardEvent) {
	if (event.key === "ArrowDown" || event.key === "ArrowUp") {
		event.preventDefault();
	}
}
window.addEventListener("keydown", onKeyDown);
