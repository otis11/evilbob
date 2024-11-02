export function Span(text: string) {
	const span = document.createElement("span");
	span.innerText = text;
	return span;
}

export function Div(text: string) {
	const div = document.createElement("div");
	div.innerText = text;
	return div;
}

export function H2(text: string) {
	const h2 = document.createElement("h2");
	h2.innerText = text;
	return h2;
}
