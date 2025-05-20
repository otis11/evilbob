import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { memoryStore, useMemoryStore } from "@/lib/memory-store.ts";
import { importPluginCommand } from "@/lib/plugins-frontend.ts";
import {
	type PluginCommandExtended,
	type SearchItem,
	extendedCommand,
} from "@/plugins";
import { type FunctionComponent, useEffect, useState } from "react";

export function SearchEverywhere() {
	const [isCommandExecuting, setIsCommandExecuting] =
		useMemoryStore("isCommandExecuting");
	const [plugins, setPlugins] = useMemoryStore("plugins");
	const [search, setSearch] = useMemoryStore("search");
	const [items, setItems] = useState<SearchItem[]>([]);

	async function onCommandClick(item: PluginCommandExtended) {
		if (!item.plugin) {
			return;
		}
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

	useEffect(() => {
		if (!plugins) {
			return;
		}
		for (const plugin of plugins) {
			if (!plugin.definition.searchEverywhereName) {
				continue;
			}
			importPluginCommand(
				plugin.id,
				plugin.definition.searchEverywhereName,
			).then(async (module) => {
				if (module.AdditionalSearchItems) {
					const additional = await module.AdditionalSearchItems();
					setItems((current) => [...current, ...additional]);
				}
			});
		}

		const pluginItems = plugins.flatMap((plugin) => {
			return plugin.definition.commands
				? plugin.definition.commands?.map((c) => {
						const command = extendedCommand(c, plugin);
						return {
							search:
								command.title.toLowerCase() +
								(command.description
									? command.description.toLowerCase()
									: ""),
							content: (
								<VListItem
									data={command}
									key={command.name}
									data-testid={`command-${command.plugin.id}-${command.name}`}
								>
									<VListItemIcon>
										{command.plugin.icon}
									</VListItemIcon>
									<span>{command.title}</span>
									<span className="text-muted-foreground text-sm pl-4">
										{command.plugin?.title}
									</span>
									{command.type === "command" ? (
										<span className="ml-auto text-muted-foreground text-sm">
											Command
										</span>
									) : (
										<span className="ml-auto text-muted-foreground text-sm">
											View
										</span>
									)}
								</VListItem>
							),
						};
					})
				: [];
		});
		setItems((current) => [...current, ...pluginItems]);
	}, [plugins]);
	return (
		<VList onSelect={onCommandClick}>
			{items
				.filter((item) => item.search.includes(search.toLowerCase()))
				.flatMap((item) => item.content)}
		</VList>
	);
}
