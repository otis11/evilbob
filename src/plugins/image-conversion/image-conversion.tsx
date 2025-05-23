import { NumberSelect } from "@/components/NumberSelect.tsx";
import { TextSelect } from "@/components/TextSelect.tsx";
import { type FileWithId, UploadZone } from "@/components/UploadZone.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	IMAGE_CANVAS_TYPES,
	IMAGE_TYPE_FILE_EXTENSION_MAP,
	ImageCanvas,
	type ImageCanvasType,
} from "@/lib/image-canvas.ts";
import { downloadUrl } from "@/lib/utils.ts";
import { XIcon } from "lucide-react";
import { useState } from "react";

export function Command() {
	const [files, setFiles] = useState<FileWithId[]>([]);
	const [imageTypeValue, setImageTypeValue] =
		useState<ImageCanvasType>("image/jpeg");
	const [imageQuality, setImageQuality] = useState<number>(1.0);
	async function onSaveClick() {
		const imageCanvas = new ImageCanvas();
		for (const file of files) {
			await imageCanvas.drawImage(file.file);
			const url = await imageCanvas.getImageUrl(
				imageTypeValue,
				imageQuality,
			);
			if (!url) {
				continue;
			}
			downloadUrl(
				url,
				`${file.file.name.substring(0, file.file.name.lastIndexOf("."))}${IMAGE_TYPE_FILE_EXTENSION_MAP[imageTypeValue]}`,
			);
		}
		imageCanvas.destroy();
	}

	function onDeleteClick(file: FileWithId) {
		setFiles(files.filter((f) => f.id !== file.id));
	}

	return (
		<>
			<div className="flex items-center gap-2">
				<UploadZone files={files} onChange={setFiles}></UploadZone>
			</div>
			<div className="flex py-4">
				<div className="flex flex-col gap-2 pt-4">
					<span>{files.length} files uploaded.</span>
					{files.map((file, index) => (
						<span
							className="text-muted-foreground flex items-center"
							key={file.id}
						>
							{file.file.name}
							<XIcon
								className="ml-2 text-destructive-foreground"
								size={20}
								onClick={() => onDeleteClick(file)}
							></XIcon>
						</span>
					))}
				</div>
				<div className="ml-auto">
					<span className="text-muted-foreground">Convert to</span>
					<TextSelect
						values={[...IMAGE_CANVAS_TYPES]}
						value={imageTypeValue}
						onValueChange={(value) =>
							setImageTypeValue(value as ImageCanvasType)
						}
					></TextSelect>
					<div className="text-muted-foreground pt-2">Quality</div>
					<NumberSelect
						values={[
							0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5,
							0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0,
						]}
						value={imageQuality}
						onValueChange={setImageQuality}
					></NumberSelect>
				</div>
			</div>
			<div className="flex mt-auto">
				<Button className="ml-auto" onClick={onSaveClick}>
					Convert
				</Button>
			</div>
		</>
	);
}
