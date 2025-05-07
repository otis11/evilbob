// @ts-expect-error typescript doesnt know ?raw imports. Can be fixed with declare global module for ?raw files
import evilBob16 from "@/media/evilbob-icon-16x16.svg?raw";
// @ts-expect-error typescript doesnt know ?raw imports. Can be fixed with declare global module for ?raw files
import evilBob32 from "@/media/evilbob-icon-32x32.svg?raw";
// @ts-expect-error typescript doesnt know ?raw imports. Can be fixed with declare global module for ?raw files
import evilBob48 from "@/media/evilbob-icon-48x48.svg?raw";
// is probably too large import evilBob128 from "@/media/evilbob-icon-128x128.svg?raw"

export async function Command() {
	const bobIcons: string[] = [evilBob16, evilBob32, evilBob48];
	const scatteringRate = 0.1;
	const allElements = Array.from(document.querySelectorAll("*"));
	for (const element of allElements) {
		if (Math.random() < scatteringRate) {
			// -0.5 make smaller icons happen more often
			const icon =
				bobIcons[Math.floor(Math.random() * (bobIcons.length - 0.5))];

			if (icon) {
				const template = document.createElement("template");
				template.innerHTML = icon;
				element.append(...Array.from(template.content.childNodes));
			}
		}
	}
}
