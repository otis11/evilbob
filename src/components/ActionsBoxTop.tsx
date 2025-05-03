"use client";

import type { JSX } from "react";
import { EvilBob } from "./EvilBob";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const frameworks = [
	{
		value: "next.js",
		label: "Next.js",
	},
	{
		value: "sveltekit",
		label: "SvelteKit",
	},
	{
		value: "nuxt.js",
		label: "Nuxt.js",
	},
	{
		value: "remix",
		label: "Remix",
	},
	{
		value: "astro",
		label: "Astro",
	},
];
export interface ActionsTopBoxProps {
	actions: JSX.Element[];
	onOpenChange: (isOpen: boolean) => void;
	open: boolean;
}
export function ActionsBoxTop({
	actions,
	open,
	onOpenChange,
}: ActionsTopBoxProps) {
	return (
		<DropdownMenu open={open} onOpenChange={onOpenChange}>
			<DropdownMenuTrigger className="ml-auto text-xs tracking-widest text-muted-foreground">
				Actions ⌘⏎
			</DropdownMenuTrigger>
			<DropdownMenuContent container={EvilBob.instance().dialogElement}>
				{actions.map((action, index) => (
					<DropdownMenuItem className="flex items-center" key={index}>
						{action}{" "}
						<span className="ml-auto text-xs tracking-widest text-muted-foreground">
							{index}
						</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
