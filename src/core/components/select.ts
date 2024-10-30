export function Select(
	options: { value: string; title: string; selected?: boolean }[],
) {
	const select = document.createElement("select");
	for (const option of options) {
		const optionEl = document.createElement("option");
		optionEl.innerText = option.title;
		optionEl.value = option.value;
		select.style.width = "160px";
		if (option.selected) {
			optionEl.selected = true;
		}
		select.append(optionEl);
	}

	return select;
}
