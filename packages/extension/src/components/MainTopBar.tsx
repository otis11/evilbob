import { ArrowLeft, Blocks, Maximize2, Minimize2 } from "lucide-react";
import { type RefObject, useState } from "react";
import { EvilBob } from "./EvilBob.tsx";
import { SearchInput, type onSearchInputChangeProps } from "./SearchInput.tsx";

export interface MainTopBarProps {
	hint?: string;
	onChange?: (data: onSearchInputChangeProps) => void;
	onBack?: () => void;
	showBack?: boolean;
	inputRef: RefObject<HTMLInputElement | null>;
	search: string;
}

export function MainTopBar({
	hint,
	onChange,
	showBack,
	onBack,
	inputRef,
	search,
}: MainTopBarProps) {
	const [isFullscreen, setIsFullscreen] = useState(false);

	async function onPluginsClick() {
		await chrome.runtime.sendMessage({ event: "open-plugins" });
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
				<SearchInput
					ref={inputRef}
					onChange={onChange}
					value={search}
				></SearchInput>
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
			<div className="h-6 flex items-center pl-8">
				<div className="text-sm text-fg-weak">{hint}</div>
			</div>
		</>
	);
}
