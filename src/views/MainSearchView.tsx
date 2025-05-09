import { Toast } from "@/components/Toast.tsx";
import { type Bang, getBangSearchUrl } from "@/lib/bangs/bangs.ts";
import { memoryStore, useMemoryStore } from "@/lib/memory-store.ts";
import { findStringStartUntil } from "@/lib/utils";
import { searchForPluginCommands } from "@/plugins";
import type { PluginCommandExtended } from "@/plugins";
import { type FunctionComponent, useEffect, useState } from "react";
import { BangsList } from "../components/BangsList.tsx";
import { CommandList } from "../components/CommandList.tsx";
import { MainTopBar } from "../components/MainTopBar.tsx";
import { Button } from "../components/ui/button.tsx";
import { browserApi } from "../lib/browser-api.ts";
import { importPluginCommand } from "../lib/plugins-frontend.ts";

export function MainSearchView() {
	const [search, setSearch] = useMemoryStore("search");
	const [searchBehindBang, setSearchBehindBang] = useState("");
	const [searchHasBang, setSearchHasBang] = useState(false);
	const [isCommandExecuting, setIsCommandExecuting] =
		useMemoryStore("isCommandExecuting");
	const [pluginViewCommand, setPluginViewCommand] =
		useMemoryStore("pluginViewCommand");
	const [plugins, setPlugins] = useMemoryStore("plugins");

	useEffect(() => {
		if (pluginViewCommand) {
			memoryStore.set("searchHint", pluginViewCommand.title);
		} else if (searchHasBang) {
			memoryStore.set("searchHint", "Bangs");
		}
	}, [pluginViewCommand, searchHasBang]);

	useEffect(() => {
		const [foundBang, newSearchBehindBang] = findStringStartUntil(
			search || "",
			"!",
			" ",
		);
		setSearchHasBang(foundBang);
		setSearchBehindBang(newSearchBehindBang);
	}, [search]);

	async function onBangSelect(item: Bang) {
		await browserApi.tabs.create({
			url: getBangSearchUrl(search || "", item),
		});
	}

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

	async function onManagePluginsClick() {
		await chrome.runtime.sendMessage({ event: "open-plugins" });
	}

	return (
		<>
			<Toast></Toast>
			<MainTopBar></MainTopBar>
			{pluginViewCommand !== undefined ? (
				""
			) : searchHasBang ? (
				<BangsList
					search={searchBehindBang}
					onBangSelect={onBangSelect}
				></BangsList>
			) : plugins?.length === 0 ? (
				<div className="flex flex-col justify-center p-4 items-center text-base">
					No Plugins enabled.
					<Button className="mt-2" onClick={onManagePluginsClick}>
						Manage Plugins
					</Button>
				</div>
			) : (
				<CommandList
					onSelect={onCommandClick}
					commands={commands}
				></CommandList>
			)}
		</>
	);
}
