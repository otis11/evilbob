export function Span(text: string) {
	const span = document.createElement("span");
	span.innerText = text;
	return span;
}
