"use client";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { keysAsString } from "@/lib/keybindings.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { type ReactNode, useEffect } from "react";
import { EvilbobRoot } from "../lib/evilbob-root.tsx";

export interface ActionsTopBoxProps {
	children: ReactNode;
}
export function ActionsBoxTop({ children }: ActionsTopBoxProps) {
	const [config, setConfig] = useMemoryStore("config");
	const [isActionsOpen, setIsActionsOpen] = useMemoryStore("isActionsOpen");

	useEffect(() => {
		const onResultClick = () => {
			setIsActionsOpen(false);
		};
		window.addEventListener("evilbob-vlist-click", onResultClick);
		return () =>
			window.removeEventListener("evilbob-vlist-click", onResultClick);
	}, [setIsActionsOpen]);

	return (
		<Popover open={isActionsOpen} onOpenChange={setIsActionsOpen}>
			<PopoverTrigger className="text-xs tracking-widest text-muted-foreground flex items-center gap-1">
				Actions{" "}
				{keysAsString(config?.keybindings.openActions?.keys).map(
					(key) => (
						<span key={key}>{key}</span>
					),
				)}
			</PopoverTrigger>
			<PopoverContent
				data-testid="actions-container"
				className="p-1 border rounded-md w-56"
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				container={EvilbobRoot.instance().dialogElement}
			>
				{children}
			</PopoverContent>
		</Popover>
	);
}
