import { GroupHeading } from "../../components/group-heading";
import { type BobConfig, updateConfig } from "../../config";

export async function renderPreserveInput(config: BobConfig) {
	const preserveInputContainer = document.createElement("div");
	document.body.append(GroupHeading("Preserve Input"));
	const labelOnWindowChange = document.createElement("label");
	labelOnWindowChange.classList.add("preserver-input-title");

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = config.preserveInput?.onWindowChange;
	checkbox.addEventListener("change", async () => {
		updateConfig({
			preserveInput: {
				onWindowChange: checkbox.checked,
			},
		});
	});

	const labelText = document.createElement("span");
	labelText.innerText = "On window change";
	labelOnWindowChange.append(checkbox, labelText);
	preserveInputContainer.append(labelOnWindowChange);
	document.body.append(preserveInputContainer);
}
