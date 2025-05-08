import { Toast } from "@/components/Toast.tsx";
import { type Bang, getBangSearchUrl } from "@/lib/bangs/bangs.ts";
import type { EvilbobConfig } from "@/lib/config.ts";
import { findStringStartUntil } from "@/lib/utils";
import { searchForPluginCommands } from "@/plugins";
import type { Plugin, PluginCommandExtended } from "@/plugins";
import { type ChangeEvent, type JSX, useEffect, useRef, useState } from "react";
import { browserApi } from "../browser-api.ts";
import { BangsList } from "../components/BangsList.tsx";
import { CommandList } from "../components/CommandList.tsx";
import { Evilbob } from "../components/Evilbob.tsx";
import { MainTopBar } from "../components/MainTopBar.tsx";
import { Button } from "../components/ui/button.tsx";
import { importPluginCommand } from "../lib/plugins-frontend.ts";

export interface MainViewProps {
	search?: string;
	pluginView: PluginCommandExtended | undefined;
	plugins: Plugin[];
	onBack?: () => void;
	actions: JSX.Element;
	config?: EvilbobConfig;
	isActionsOpen?: boolean;
}

export function MainSearchView({
	plugins,
	pluginView,
	onBack,
	actions,
	config,
	isActionsOpen,
}: MainViewProps) {
	const [search, setSearch] = useState("");
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [searchBehindBang, setSearchBehindBang] = useState("");
	const [searchHasBang, setSearchHasBang] = useState(false);
	const [isCommandExecuting, setIsCommandExecuting] = useState(false);

	useEffect(() => {
		if (!pluginView) {
			inputRef.current?.focus();
		}
	}, [pluginView]);

	useEffect(() => {
		const listener = () => {
			setSearch("");
		};
		window.addEventListener("evilbob-unmount-plugin-view", listener);
		return () =>
			window.removeEventListener("evilbob-unmount-plugin-view", listener);
	}, []);

	useEffect(() => {
		const [foundBang, newSearchBehindBang] = findStringStartUntil(
			search,
			"!",
			" ",
		);
		setSearchHasBang(foundBang);
		setSearchBehindBang(newSearchBehindBang);
	}, [search]);

	async function onBangSelect(item: Bang) {
		await browserApi.tabs.create({
			url: getBangSearchUrl(search, item),
		});
	}

	async function onCommandClick(item: PluginCommandExtended) {
		const command = await importPluginCommand(item.plugin.id, item.name);
		if (item.type === "view") {
			setSearch("");
			Evilbob.instance().renderPluginCommand(item, command, {
				search: "",
			});
		} else if (item.type === "command") {
			setIsCommandExecuting(true);
			await (command.Command as () => Promise<void>)();
			setIsCommandExecuting(false);
		}
	}

	function onChange(data: ChangeEvent<HTMLInputElement>) {
		setSearch(data.target.value);
		Evilbob.instance().updatePluginView({
			search: data.target.value,
		});
	}

	const commands = searchForPluginCommands(search, plugins);

	async function onManagePluginsClick() {
		await chrome.runtime.sendMessage({ event: "open-plugins" });
	}

	let searchHint = "";
	if (pluginView) {
		searchHint = pluginView.title;
	} else if (searchHasBang) {
		searchHint = "Bangs";
	}

	return (
		<>
			<Toast></Toast>
			<MainTopBar
				isActionsOpen={isActionsOpen}
				config={config}
				actions={actions}
				search={search}
				inputRef={inputRef}
				showBack={!!pluginView}
				onBack={onBack}
				onChange={onChange}
				hint={searchHint}
				isCommandExecuting={isCommandExecuting}
			></MainTopBar>
			{pluginView !== undefined ? (
				""
			) : searchHasBang ? (
				<BangsList
					search={searchBehindBang}
					onBangSelect={onBangSelect}
				></BangsList>
			) : plugins.length === 0 ? (
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
