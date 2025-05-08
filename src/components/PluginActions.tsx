import type { JSX } from "react";
import { Evilbob } from "./Evilbob.tsx";

export interface PluginActionsProps {
	children: JSX.Element | JSX.Element[];
}
export function PluginActions({ children }: PluginActionsProps) {
	Evilbob.instance().setPluginActions(children);
	return <></>;
}
