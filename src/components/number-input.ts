export function NumberInput(config: { value: string; label: string }): [
	HTMLLabelElement,
	HTMLInputElement,
] {
	const label = document.createElement("label");
	const input = document.createElement("input");
	const labelText = document.createElement("span");
	labelText.innerText = config.label;
	input.type = "number";
	input.value = config.value;
	label.append(input, labelText);
	return [label, input];
}
