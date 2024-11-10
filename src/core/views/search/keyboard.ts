import { registerKeysListener } from "../../components/keys";
import { Result } from "../../components/result/result";
import { getConfig } from "../../config";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { resultOptionsContainer, resultsContainer } from "./dom";
import { setLoading } from "./loading";
import { bobWindowState } from "./main";
import {
	closeResultOptions,
	isResultOptionsVisible,
	showResultOptions,
} from "./result-options";
import {
	getSelectedResultIndex,
	selectNextResult,
	selectPrevResult,
} from "./selected";

(async () => {
	const config = await getConfig();
	registerKeysListener(config.keybindings.nextResult?.keys || [], () => {
		selectNextResult();
	});
	registerKeysListener(config.keybindings.previousResult?.keys || [], () => {
		selectPrevResult();
	});
	registerKeysListener(
		config.keybindings.selectResult?.keys || [],
		async () => {
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
		},
	);

	registerKeysListener(
		config.keybindings.openResultOptions?.keys || [],
		() => {
			const container = isResultOptionsVisible()
				? resultOptionsContainer
				: resultsContainer;
			const target = container.children[getSelectedResultIndex()];
			const searchResult = Result.instanceFromId(
				target?.getAttribute("data-instance-id") || "",
			);
			if (searchResult && (searchResult.options()?.length || 0) > 0) {
				showResultOptions(searchResult);
			}
		},
	);

	registerKeysListener(config.keybindings.close?.keys || [], async () => {
		if (isResultOptionsVisible()) {
			await closeResultOptions();
		} else {
			await focusLastActiveWindow();
		}
	});
})();

function onKeyDown(event: KeyboardEvent) {
	if (event.key === "ArrowDown" || event.key === "ArrowUp") {
		event.preventDefault();
	}
}
window.addEventListener("keydown", onKeyDown);
