import { Checkbox } from "../../components/checkbox";
import { FlexContainer } from "../../components/flex-container";
import { GroupHeading } from "../../components/group-heading";
import { type BobConfig, updateConfig } from "../../config";

export async function renderOnBobWindowLeave(config: BobConfig) {
	const onBobWindowLeave = FlexContainer({
		flexDirection: "column",
		gap: "8px",
	});
	onBobWindowLeave.append(GroupHeading("On Bob window leave"));
	const [clearSearch, clearSearchCheckbox] = Checkbox(
		"Clear Search",
		config.onBobWindowLeave?.clearSearch,
		"Clears the search text.",
	);
	const [closeWindow, closeWindowCheckbox] = Checkbox(
		"Close Window",
		config.onBobWindowLeave?.closeWindow,
		"Closes the bob window. This is not recommend, as it takes longer to open than just refocusing the window.",
	);
	const [refreshResults, refreshResultsCheckbox] = Checkbox(
		"Refresh Results",
		config.onBobWindowLeave?.refreshResults,
		"Refreshes the results.",
	);

	clearSearchCheckbox.addEventListener("change", async () => {
		updateConfig({
			onBobWindowLeave: {
				clearSearch: clearSearchCheckbox.checked,
			},
		});
	});

	closeWindowCheckbox.addEventListener("change", async () => {
		updateConfig({
			onBobWindowLeave: {
				closeWindow: closeWindowCheckbox.checked,
			},
		});
	});

	refreshResultsCheckbox.addEventListener("change", async () => {
		updateConfig({
			onBobWindowLeave: {
				refreshResults: refreshResultsCheckbox.checked,
			},
		});
	});

	onBobWindowLeave.append(clearSearch, refreshResults, closeWindow);
	document.body.append(onBobWindowLeave);
}
