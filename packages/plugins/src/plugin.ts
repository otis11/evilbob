import type {
	Plugin,
	PluginCommand,
	PluginCommandExtended,
	PluginDefinition,
} from "./types.ts";

export function definePlugin(definition: PluginDefinition) {
	return definition;
}

export function extendedCommand(command: PluginCommand, plugin: Plugin) {
	return {
		...command,
		plugin: {
			id: plugin.id,
			title: plugin.definition.title,
		},
	};
}

export function searchInPlugin(value: string, plugin: Plugin) {
	return (
		plugin.id.includes(value.toLowerCase()) ||
		plugin.definition.title.toLowerCase().includes(value.toLowerCase()) ||
		plugin.definition.description
			?.toLowerCase()
			.includes(value.toLowerCase())
	);
}

export function searchInPluginCommand(value: string, command: PluginCommand) {
	return (
		command.title.toLowerCase().includes(value.toLowerCase()) ||
		command.description?.toLowerCase().includes(value.toLowerCase())
	);
}

export function searchForPluginCommands(search: string, plugins: Plugin[]) {
	return plugins.flatMap((plugin) => {
		const foundCommands =
			plugin.definition.commands?.filter((command) => {
				return searchInPluginCommand(search, command);
			}) || [];
		return foundCommands.map((foundCommand) =>
			extendedCommand(foundCommand, plugin),
		);
	});
}

export function searchForPluginViewsWithSlash(
	search: string,
	plugins: Plugin[],
): [PluginCommandExtended[], PluginCommandExtended | undefined] {
	let exactMatchingView: undefined | PluginCommandExtended = undefined;
	const foundViews = plugins.flatMap((plugin) => {
		const foundCommands =
			plugin.definition.commands?.filter((command) => {
				if (command.slash === search) {
					exactMatchingView = extendedCommand(command, plugin);
				}
				return (
					command.type === "view" &&
					command.slash?.toLowerCase().includes(search.toLowerCase())
				);
			}) || [];
		return foundCommands.map((command) => extendedCommand(command, plugin));
	});
	return [foundViews, exactMatchingView];
}
