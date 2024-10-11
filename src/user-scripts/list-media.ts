import { FlexContainer } from "../components/flex-container";
import { Heading } from "../components/heading";
import { resetElementStyles } from "../util/resetElementStyles";

(() => {
	console.log("list-media user script");

	const dialog = document.createElement("dialog");
	const fragmentImages = document.createDocumentFragment();
	const fragmentSvgs = document.createDocumentFragment();

	for (const img of Array.from(document.querySelectorAll("img"))) {
		const newNode = img.cloneNode(true) as HTMLElement;
		resetElementStyles(newNode, {
			width: "128px",
			height: "128px",
		});
		fragmentImages.appendChild(newNode);
	}

	for (const svg of Array.from(document.querySelectorAll("svg"))) {
		const newNode = svg.cloneNode(true) as HTMLElement;
		resetElementStyles(newNode, {
			width: "48px",
			height: "48px",
		});
		fragmentSvgs.appendChild(newNode);
	}

	dialog.append(
		Heading("Images"),
		FlexContainer({
			gap: "4px",
			flexWrap: "wrap",
			alignItems: "center",
			children: [fragmentImages],
		}),
		Heading("Svgs"),
		FlexContainer({
			gap: "4px",
			flexWrap: "wrap",
			alignItems: "center",
			children: [fragmentSvgs],
		}),
	);

	document.body.appendChild(dialog);

	dialog.showModal();

	dialog.addEventListener("close", () => {
		dialog.remove();
	});
})();
