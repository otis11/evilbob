"use client";

import type { EvilBobConfig } from "@/lib/config";
import { keysAsString } from "@/lib/keybindings.ts";
import type { ReactNode } from "react";
import { EvilBob } from "./EvilBob";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export interface ActionsTopBoxProps {
	children: ReactNode;
	onOpenChange: (isOpen: boolean) => void;
	open: boolean;
	config?: EvilBobConfig;
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
				container={EvilBob.instance().dialogElement}
			>
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
