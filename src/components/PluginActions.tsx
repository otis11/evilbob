import type { JSX } from "react";
import { EvilBob } from "./EvilBob";

export interface PluginActionsProps {
	children: JSX.Element;
}
export function PluginActions({ children }: PluginActionsProps) {
	EvilBob.instance().setPluginActions(children);
	return <></>;
}
