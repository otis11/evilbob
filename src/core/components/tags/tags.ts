import "./tags.css";

export type Tag = {
	text?: string;
	html?: string;
	type?: "default" | "error" | "success";
};

export function Tags(tags: Tag[]) {
	const container = document.createElement("div");
	container.classList.add("tag-container");
	for (const tag of tags) {
		const el = document.createElement("span");
		el.classList.add("tag");
		el.classList.add(`tag-${tag.type || "default"}`);
		if (tag.html) {
			el.innerHTML = tag.html;
		}
		if (tag.text) {
			el.innerText = tag.text;
		}
		container.appendChild(el);
	}
	return container;
}
