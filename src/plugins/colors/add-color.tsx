import { toast } from "@/components/Toast";
import { browserApi } from "@/lib/browser-api.ts";
import { EvilbobRoot } from "@/lib/evilbob-root";
import { rgbaToHex, unique } from "@/lib/utils.ts";
import { EditColor, type EditColorOnSaveProps } from "./components/edit-color";

export function Command() {
	async function onSave({
		newColor,
		newTitle,
		currentColors,
	}: EditColorOnSaveProps) {
		currentColors.push({
			c: rgbaToHex(newColor),
			title: unique(
				newTitle,
				currentColors.map((c) => c.title),
			),
		});
		await browserApi.storage.sync.set({ colors: currentColors });
		toast(<span>Color Added.</span>);
	}

	return (
		<EditColor
			r={100}
			g={100}
			b={100}
			a={255}
			onSave={onSave}
			onCancel={() => EvilbobRoot.instance().unmountPluginView()}
		></EditColor>
	);
}
