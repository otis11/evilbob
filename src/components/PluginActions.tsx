import { memoryStore } from "@/lib/memory-store.ts";
import type { JSX } from "react";

export interface PluginActionsProps {
	children: JSX.Element | JSX.Element[];
}
export function PluginActions({ children }: PluginActionsProps) {
	memoryStore.set("actions", children);
	return <></>;
}
