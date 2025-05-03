import { ActionsBoxTop } from "@/components/ActionsBoxTop.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ArrowLeft, Blocks, Maximize2, Minimize2 } from "lucide-react";
import {
	type ChangeEvent,
	type JSX,
	type KeyboardEvent,
	type RefObject,
	useEffect,
	useState,
} from "react";
import { EvilBob } from "./EvilBob.tsx";

export interface MainTopBarProps {
	hint?: string;
	onChange?: (data: ChangeEvent<HTMLInputElement>) => void;
	onBack?: () => void;
	showBack?: boolean;
	inputRef: RefObject<HTMLInputElement | null>;
	search: string;
	actions: JSX.Element;
}

export function MainTopBar({
	hint,
	onChange,
	showBack,
	onBack,
	inputRef,
	search,
	actions,
}: MainTopBarProps) {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [open, setOpen] = useState(false);
	useEffect(() => {
		window.addEventListener("evil-bob-open-actions", () => {
			setOpen(true);
		});
	}, []);

	function onOpenChange(isOpen: boolean) {
		setOpen(isOpen);
		if (!isOpen) {
			inputRef.current?.focus();
		}
	}

	async function onPluginsClick() {
		await chrome.runtime.sendMessage({ event: "open-plugins" });
	}
	function onKeyDownActions(e: KeyboardEvent<HTMLElement>) {
		e.stopPropagation();
	}

	EvilBob.instance().fullscreen(isFullscreen);
	return (
		<>
			<div className="flex items-center gap-3">
				<ArrowLeft
					onClick={onBack}
					size={20}
					className={showBack ? "" : "pointer-events-none opacity-50"}
				></ArrowLeft>
				<Input
					className="h-12 !text-lg"
					ref={inputRef}
					onChange={onChange}
					value={search}
				></Input>
				{isFullscreen ? (
					<Minimize2
						onClick={() => setIsFullscreen(false)}
						size={20}
					></Minimize2>
				) : (
					<Maximize2
						onClick={() => setIsFullscreen(true)}
						size={20}
					></Maximize2>
				)}
				<Blocks size={20} onClick={onPluginsClick}></Blocks>
			</div>
			<div
				className="h-8 min-h-8 flex items-center justify-between"
				onKeyDown={onKeyDownActions}
			>
				<div className="text-xs tracking-widest text-muted-foreground">
					Go Back ⌘b
				</div>
				<div className="text-sm text-muted-foreground">{hint}</div>
				<ActionsBoxTop open={open} onOpenChange={onOpenChange}>
					{actions}
				</ActionsBoxTop>
			</div>
		</>
	);
}
