import type { BobConfig } from "../../config";
import type { ResultGroup } from "../result-group";
import { disableResultGroup, enableResultGroup } from "../result-groups";
import "./result-group-card.css";

export function ResultGroupCard(group: ResultGroup, config: BobConfig) {
	const container = document.createElement("div");
	container.classList.add("result-group-card");

	const label = document.createElement("label");
	label.classList.add("result-group-title");

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = !!config.groups[group.name()]?.enabled;
	checkbox.addEventListener("change", async () => {
		if (checkbox.checked) {
			enableResultGroup(group);
		} else {
			disableResultGroup(group);
		}
	});
	const labelText = document.createElement("span");
	labelText.innerText = group.name();
	label.append(checkbox, labelText);
	const description = document.createElement("div");
	description.classList.add("result-group-description");
	description.innerText = group.description();
	container.append(label, description);

	return container;
}
