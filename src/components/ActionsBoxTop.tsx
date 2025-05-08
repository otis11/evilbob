"use client";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import type { EvilbobConfig } from "@/lib/config";
import { keysAsString } from "@/lib/keybindings.ts";
import { type ReactNode, useEffect } from "react";
import { Evilbob } from "./Evilbob.tsx";

export interface ActionsTopBoxProps {
	children: ReactNode;
	onOpenChange: (isOpen: boolean) => void;
	open: boolean;
	config?: EvilbobConfig;
}
export function ActionsBoxTop({
	children,
	open,
	onOpenChange,
	config,
}: ActionsTopBoxProps) {
	useEffect(() => {
		const onResultClick = () => {
			onOpenChange(false);
		};
		window.addEventListener("evilbob-vlist-click", onResultClick);
		return () =>
			window.removeEventListener("evilbob-vlist-click", onResultClick);
	}, [onOpenChange]);

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger className="text-xs tracking-widest text-muted-foreground">
				Actions {keysAsString(config?.keybindings.openActions.keys)}
			</PopoverTrigger>
			<PopoverContent
				className="p-1 border rounded-md w-56"
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				container={Evilbob.instance().dialogElement}
			>
				{children}
			</PopoverContent>
		</Popover>
	);
}
