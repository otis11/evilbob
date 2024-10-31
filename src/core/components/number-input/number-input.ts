import "./number-input.css";

export function NumberInput(config: {
	value: string;
	label: string;
	description?: string;
}): [HTMLLabelElement, HTMLInputElement] {
	const label = document.createElement("label");
	label.classList.add("number-input");
	const input = document.createElement("input");
	const labelText = document.createElement("div");
	labelText.classList.add("number-input-title");
	labelText.innerText = config.label;
	input.type = "number";
	input.value = config.value;
	label.append(labelText);

	if (config.description) {
		const description = document.createElement("div");
		description.innerText = config.description;
		description.classList.add("number-input-description");
		label.append(description);
	}
	label.append(input);

	return [label, input];
}
