import { browserApi } from "@evil-bob/extension/src/browser-api.ts";
import { EvilBob } from "@evil-bob/extension/src/components/EvilBob.tsx";
interface Color {
	c: string;
	title: string;
}

export default async function addColor() {
	const color = await EvilBob.instance().showInput({
		type: "color",
		title: "Pick a color",
	});

	if (!color) {
		return;
	}
	const colors: Color[] =
		(await browserApi.storage.sync.get(["colors"])).colors || [];
	colors.push({
		c: color,
		title: color,
	});
	await browserApi.storage.sync.set({ colors: colors });
}
