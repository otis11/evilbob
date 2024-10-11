export function Heading(text: string) {
	const heading = document.createElement("div");
	heading.style.fontWeight = "bold";
	heading.style.fontSize = "1.125rem";
	heading.innerText = text;
	return heading;
}
