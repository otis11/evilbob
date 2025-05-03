"use client";

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
}
export function ActionsBoxTop({
	children,
	open,
	onOpenChange,
}: ActionsTopBoxProps) {
	return (
		<DropdownMenu open={open} onOpenChange={onOpenChange}>
			<DropdownMenuTrigger className="text-xs tracking-widest text-muted-foreground">
				Actions ⌘⏎
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
