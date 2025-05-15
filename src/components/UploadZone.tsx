import { Input } from "@/components/ui/input.tsx";
import {
	type ChangeEvent,
	type DragEvent,
	useEffect,
	useRef,
	useState,
} from "react";

export interface DropZoneProps {
	onChange?: (files: File[]) => void;
	files?: File[];
}
export function UploadZone({ onChange, files }: DropZoneProps) {
	const [isDragOver, setDragOver] = useState<boolean>(false);
	const input = useRef<HTMLInputElement>(null);
	const [localFiles, setLocalFiles] = useState<File[]>([]);

	useEffect(() => {
		if (files) {
			setLocalFiles(files);
		}
	}, [files]);

	function onDropHandler(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		const newFiles = [
			...localFiles,
			...Array.from(event.dataTransfer.files),
		] as File[];
		setLocalFiles(newFiles);
		onChange?.(newFiles);
	}

	function onDragOverHandler(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		setDragOver(true);
	}

	function onDragLeaveHandler(event: DragEvent<HTMLDivElement>) {
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
		const newFiles = [...localFiles, ...Array.from(event.target.files)];
		setLocalFiles(newFiles);
		onChange?.(newFiles);
	}

	return (
		<div
			className={`bg-muted flex items-center flex-col justify-center border border-dashed w-full h-full min-h-32 ${isDragOver ? "border-foreground" : "border-muted-foreground"}`}
			onDrop={onDropHandler}
			onDragLeave={onDragLeaveHandler}
			onDragOver={onDragOverHandler}
			onClick={onClickHandler}
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
		</div>
	);
}
