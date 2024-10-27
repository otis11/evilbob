import { Checkbox } from "../../components/checkbox";
import { FlexContainer } from "../../components/flex-container";
import { GroupHeading } from "../../components/group-heading";
import { type BobConfig, updateConfig } from "../../config";
import { t } from "../../locale";

export async function renderOnBobWindowEvents(config: BobConfig) {
	const container = FlexContainer({
		flexDirection: "column",
		gap: "8px",
	});
	container.append(GroupHeading(t("onBobWindowLeave.title")));
	const [clearSearch, clearSearchCheckbox] = Checkbox(
		t("Clear Search"),
		config.onBobWindowLeave?.clearSearch,
		t("onBobWindowLeave.clearSearch"),
	);
	const [closeWindow, closeWindowCheckbox] = Checkbox(
		t("Close Window"),
		config.onBobWindowLeave?.closeWindow,
		t("onBobWindowLeave.closeWindow"),
	);

	const [refreshResults, refreshResultsCheckbox] = Checkbox(
		t("Refresh Results"),
		config.onBobWindowFocus?.refreshResults,
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
			onBobWindowFocus: {
				refreshResults: refreshResultsCheckbox.checked,
			},
		});
	});

	container.append(clearSearch, closeWindow);
	container.append(GroupHeading(t("onBobWindowFocus.title")));
	container.append(refreshResults);

	document.body.append(container);
}
