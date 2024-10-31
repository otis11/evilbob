export function Checkbox(title: string, checked = false, description?: string) {
	const label = document.createElement("label");
	label.style.display = "inline-flex";
	label.style.alignItems = "center";

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = checked;
	checkbox.style.marginRight = "4px";

	const labelText = document.createElement("span");
	labelText.innerText = title;
	label.append(checkbox, labelText);

	if (description) {
		const descriptionEl = document.createElement("span");
		descriptionEl.style.display = "block";
		descriptionEl.innerText = description;
		descriptionEl.style.fontSize = "0.75rem";
		label.appendChild(descriptionEl);
	}

	return [label, checkbox] as [HTMLLabelElement, HTMLInputElement];
}
