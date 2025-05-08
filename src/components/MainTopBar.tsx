import { ActionsBoxTop } from "@/components/ActionsBoxTop.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { EvilbobConfig } from "@/lib/config.ts";
import { keysAsString } from "@/lib/keybindings.ts";
import { ArrowLeft, Blocks, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { type ChangeEvent, type JSX, type RefObject, useState } from "react";
import { Evilbob } from "./Evilbob.tsx";

export interface MainTopBarProps {
	hint?: string;
	onChange?: (data: ChangeEvent<HTMLInputElement>) => void;
	onBack?: () => void;
	showBack?: boolean;
	inputRef: RefObject<HTMLInputElement | null>;
	search: string;
	actions: JSX.Element;
	config?: EvilbobConfig;
	isActionsOpen?: boolean;
	isCommandExecuting?: boolean;
}

export function MainTopBar({
	hint,
	onChange,
	showBack,
	onBack,
	inputRef,
	search,
	actions,
	config,
	isActionsOpen,
	isCommandExecuting,
}: MainTopBarProps) {
	const [isFullscreen, setIsFullscreen] = useState(false);

	function onOpenChange(isOpen: boolean) {
		if (!isOpen) {
			Evilbob.instance().isActionsOpen = false;
			Evilbob.instance().updatePluginView({ search });
			Evilbob.instance().renderMainView();
			inputRef.current?.focus();
		}
	}

	async function onPluginsClick() {
		await chrome.runtime.sendMessage({ event: "open-plugins" });
	}
	Evilbob.instance().fullscreen(isFullscreen);
	return (
		<>
			<div className="flex items-center gap-3">
				{isCommandExecuting ? (
					<Loader2 className="animate-spin" size={20} />
				) : (
					<ArrowLeft
						onClick={onBack}
						size={20}
						className={
							showBack ? "" : "pointer-events-none opacity-50"
						}
					></ArrowLeft>
				)}

				<Input
					autoCapitalize="off"
					autoCorrect="off"
					autoComplete="off"
					data-vlist-stay-focused
					id="evilbob-search-input"
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
			<div className="h-8 min-h-8 flex items-center justify-between">
				<div className="text-xs tracking-widest text-muted-foreground">
					Go Back{" "}
					{keysAsString(config?.keybindings.closePluginView.keys)}
				</div>
				<div className="text-sm text-muted-foreground">{hint}</div>
				<ActionsBoxTop
					config={config}
					open={!!isActionsOpen}
					onOpenChange={onOpenChange}
				>
					{actions}
				</ActionsBoxTop>
			</div>
		</>
	);
}
