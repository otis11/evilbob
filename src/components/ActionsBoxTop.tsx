"use client";

import type { EvilbobConfig } from "@/lib/config";
import { keysAsString } from "@/lib/keybindings.ts";
import type { ReactNode } from "react";
import { Evilbob } from "./Evilbob.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
	return (
		<DropdownMenu open={open} onOpenChange={onOpenChange}>
			<DropdownMenuTrigger className="text-xs tracking-widest text-muted-foreground">
				Actions {keysAsString(config?.keybindings.openActions.keys)}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				container={Evilbob.instance().dialogElement}
			>
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
