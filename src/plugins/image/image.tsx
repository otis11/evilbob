import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ImageCanvas } from "@/lib/image-canvas.ts";
import { downloadUrl } from "@/lib/utils.ts";
import { useRef } from "react";

export function Command() {
	const canvas = useRef<HTMLCanvasElement>(null);
	const input = useRef<HTMLInputElement>(null);
	async function onSaveClick() {
		if (!input.current?.files) {
			return;
		}
		const imageCanvas = new ImageCanvas();
		for (const file of Array.from(input.current.files)) {
			await imageCanvas.drawImage(file);
			const url = await imageCanvas.getImageUrl("image/jpeg", 1);
			if (!url) {
				continue;
			}
			downloadUrl(url);
		}
	}

	return (
		<>
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label htmlFor="picture">Picture</Label>
				<Input id="picture" type="file" ref={input} accept="image/*" />
				<Button onClick={onSaveClick}>Save</Button>
			</div>
			<canvas ref={canvas}></canvas>
		</>
	);
}
