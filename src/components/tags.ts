export type Tag = {
	text: string;
	type: "default" | "error" | "success";
};

export function Tags(tags: Tag[]) {
	const container = document.createElement("div");
	container.classList.add("tag-container");
	for (const tag of tags) {
		const el = document.createElement("span");
		el.classList.add("tag");
		el.classList.add(`tag-${tag.type}`);
		el.innerText = tag.text;
		container.appendChild(el);
	}
	return container;
}
