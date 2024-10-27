export function NumberInput(config: {
	value: string;
	label: string;
	description?: string;
}): [HTMLLabelElement, HTMLInputElement] {
	const label = document.createElement("label");
	const input = document.createElement("input");
	const labelText = document.createElement("span");
	labelText.innerText = config.label;
	labelText.style.minWidth = "170px";
	labelText.style.display = "inline-block";
	input.type = "number";
	input.value = config.value;
	label.append(labelText, input);
	label.style.marginBottom = "16px";
	label.style.display = "block";
	if (config.description) {
		const description = document.createElement("span");
		description.style.display = "block";
		description.style.fontSize = "0.75rem";
		description.innerText = config.description;
		label.append(description);
	}

	return [label, input];
}
