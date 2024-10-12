export function Heading(text: string) {
	const heading = document.createElement("div");
	heading.style.fontWeight = "bold";
	heading.style.fontSize = "20px";
	heading.style.paddingTop = "12px";
	heading.style.paddingBottom = "4px";
	heading.innerText = text;
	return heading;
}
