import { ActionsBoxTop } from "@/components/ActionsBoxTop.tsx";
import { SearchByPlugins } from "@/components/SearchByPlugins.tsx";
import { SearchEverywhere } from "@/components/SearchEverywhere.tsx";
import { Toast } from "@/components/Toast.tsx";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { type Bang, getBangSearchUrl } from "@/lib/bangs/bangs.ts";
import { memoryStore, useMemoryStore } from "@/lib/memory-store.ts";
import { findStringStartUntil } from "@/lib/utils";
import { type JSX, useEffect, useState } from "react";
import { BangsList } from "../components/BangsList.tsx";
import { SearchTopBar } from "../components/SearchTopBar.tsx";
import { Button } from "../components/ui/button.tsx";
import { browserApi } from "../lib/browser-api.ts";

export function Search() {
	const [search, setSearch] = useMemoryStore("search");
	const [searchBehindBang, setSearchBehindBang] = useState("");
	const [searchHasBang, setSearchHasBang] = useState(false);
	const [pluginViewCommand, setPluginViewCommand] =
		useMemoryStore("pluginViewCommand");
	const [plugins, setPlugins] = useMemoryStore("plugins");
	const [actions, setActions] = useMemoryStore("actions");
	const [config, setConfig] = useMemoryStore("config");
	const [searchHint, setSearchHint] = useMemoryStore("searchHint");

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

	async function onManagePluginsClick() {
		await chrome.runtime.sendMessage({ event: "open-plugins" });
	}

	function SearchContent(props: { children: JSX.Element }) {
		return (
			<>
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
					props.children
				)}
			</>
		);
	}

	return (
		<>
			<Toast></Toast>
			<Tabs defaultValue="everywhere" className="w-full h-full">
				<SearchTopBar></SearchTopBar>
				<div className="h-8 min-h-8 flex items-center relative">
					<TabsList className="ml-8">
						<TabsTrigger value="everywhere">Everywhere</TabsTrigger>
						<TabsTrigger value="by-plugins">By Plugins</TabsTrigger>
					</TabsList>
					<div className="text-sm text-muted-foreground left-1/2 transform -translate-x-1/2 absolute">
						{searchHint}
					</div>
					<span className="ml-auto"></span>
					<ActionsBoxTop>{actions}</ActionsBoxTop>
					<span className="mr-14"></span>
				</div>
				<TabsContent value="everywhere" className="overflow-hidden">
					<SearchContent>
						<SearchEverywhere></SearchEverywhere>
					</SearchContent>
				</TabsContent>
				<TabsContent value="by-plugins" className="overflow-hidden">
					<SearchContent>
						<SearchByPlugins></SearchByPlugins>
					</SearchContent>
				</TabsContent>
			</Tabs>
		</>
	);
}
