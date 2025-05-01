import type { JSX } from "react";

export interface PluginCommand {
	title: string;
	type: "command" | "view";
	slash?: string;
	name: string;
	description?: string;
}

export interface PluginCommandExtended extends PluginCommand {
	plugin: {
		id: string;
		title: string;
	};
}

export interface Plugin {
	id: string;
	definition: PluginDefinition;
}

export interface PluginDefinition {
	commands?: PluginCommand[];
	permissions?: chrome.runtime.ManifestPermissions[];
	hostPermissions?: string[];
	icon?: string;
	title: string;
	description?: string;
}

export interface PluginViewProps {
	search: string;
}
export type PluginView = (props: PluginViewProps) => JSX.Element;
