import { Input } from "@/components/ui/input.tsx";
import {
	type ChangeEvent,
	type DragEvent,
	useEffect,
	useRef,
	useState,
} from "react";

let globalFileIdCounter = 0;
export interface FileWithId {
	id: number;
	file: File;
}
export interface DropZoneProps {
	onChange?: (files: FileWithId[]) => void;
	files?: FileWithId[];
}
export function UploadZone({ onChange, files }: DropZoneProps) {
	const [isDragOver, setDragOver] = useState<boolean>(false);
	const input = useRef<HTMLInputElement>(null);
	const [localFiles, setLocalFiles] = useState<FileWithId[]>([]);

	useEffect(() => {
		if (files) {
			setLocalFiles(files);
		}
	}, [files]);

	function onDropHandler(event: DragEvent<HTMLButtonElement>) {
		event.preventDefault();
		const newFiles: FileWithId[] = [
			...localFiles,
			...Array.from(event.dataTransfer.files),
		].map((file) =>
			file instanceof File ? { id: globalFileIdCounter++, file } : file,
		);
		setLocalFiles(newFiles);
		onChange?.(newFiles);
	}

	function onDragOverHandler(event: DragEvent<HTMLButtonElement>) {
		event.preventDefault();
		setDragOver(true);
	}

	function onDragLeaveHandler(event: DragEvent<HTMLButtonElement>) {
		event.preventDefault();
		setDragOver(false);
	}

	function onClickHandler() {
		input.current?.click();
	}

	function onInputChangeHandler(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target.files) {
			return;
		}
		const newFiles: FileWithId[] = [
			...localFiles,
			...Array.from(event.target.files),
		].map((file) =>
			file instanceof File ? { id: globalFileIdCounter++, file } : file,
		);
		setLocalFiles(newFiles);
		onChange?.(newFiles);
	}

	return (
		<button
			className={`bg-muted flex items-center flex-col justify-center border border-dashed w-full h-full min-h-32 focus-visible:border-foreground ${isDragOver ? "border-foreground" : "border-muted-foreground"}`}
			onDrop={onDropHandler}
			onDragLeave={onDragLeaveHandler}
			onDragOver={onDragOverHandler}
			onClick={onClickHandler}
			tabIndex={0}
			type="button"
		>
			<Input
				type="file"
				ref={input}
				accept="image/*"
				aria-hidden
				hidden
				onChange={onInputChangeHandler}
			/>
			<div>Drop files or click to upload</div>
		</button>
	);
}
