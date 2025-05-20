import { CommandList } from "@/components/CommandList.tsx";
import { memoryStore, useMemoryStore } from "@/lib/memory-store.ts";
import { importPluginCommand } from "@/lib/plugins-frontend.ts";
import { type PluginCommandExtended, searchForPluginCommands } from "@/plugins";
import type { FunctionComponent } from "react";

export function SearchByPlugins() {
	const [isCommandExecuting, setIsCommandExecuting] =
		useMemoryStore("isCommandExecuting");
	const [plugins, setPlugins] = useMemoryStore("plugins");
	const [search, setSearch] = useMemoryStore("search");
	async function onCommandClick(item: PluginCommandExtended) {
		const command = await importPluginCommand(item.plugin.id, item.name);
		if (item.type === "view") {
			memoryStore.set("search", "");
			memoryStore.set("pluginViewCommand", item);
			memoryStore.set(
				"PluginView",
				command.Command as FunctionComponent | undefined,
			);
		} else if (item.type === "command") {
			setIsCommandExecuting(true);
			await (command.Command as () => Promise<void>)();
			setIsCommandExecuting(false);
		}
	}

	const commands = searchForPluginCommands(search || "", plugins || []);
	return (
		<CommandList
			onSelect={onCommandClick}
			commands={commands}
		></CommandList>
	);
}
