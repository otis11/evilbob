import {
	searchForPluginCommands,
	searchForPluginViewsWithSlash,
} from "@evil-bob/plugins/src/plugin.ts";
import type {
	Plugin,
	PluginCommandExtended,
} from "@evil-bob/plugins/src/types.ts";
import { findStringStartUntil } from "@evil-bob/utils/src/find-string-start-until.ts";
import { useEffect, useRef, useState } from "react";
import { type Bang, getBangSearchUrl } from "../bangs/bangs.ts";
import { browserApi } from "../browser-api.ts";
import { BangsList } from "../components/BangsList.tsx";
import { Button } from "../components/Button.tsx";
import { CommandList } from "../components/CommandList.tsx";
import { EvilBob } from "../components/EvilBob.tsx";
import { MainTopBar } from "../components/MainTopBar.tsx";
import type { onSearchInputChangeProps } from "../components/SearchInput.tsx";
import { importPluginCommand } from "../config/plugins-frontend.ts";

export interface MainViewProps {
	prefillSearch?: string;
	pluginView: PluginCommandExtended | undefined;
	plugins: Plugin[];
	onCommandClick?: (item: PluginCommandExtended) => void;
	onBack?: () => void;
}
export function MainSearchView({
	prefillSearch,
	plugins,
	pluginView,
	onCommandClick,
	onBack,
}: MainViewProps) {
	const [search, setSearch] = useState(prefillSearch || "");
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [searchBehindSlash, setSearchBehindSlash] = useState("");
	const [searchBehindBang, setSearchBehindBang] = useState("");
	const [searchHasBang, setSearchHasBang] = useState(false);
	const [searchHasSlash, setSearchHasSlash] = useState(false);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		const [foundBang, newSearchBehindBang] = findStringStartUntil(
			search,
			"!",
			" ",
		);
		setSearchHasBang(foundBang);
		setSearchBehindBang(newSearchBehindBang);
		const [foundSlash, newSearchBehindSlash] = findStringStartUntil(
			search,
			"/",
			" ",
		);
		setSearchHasSlash(foundSlash);
		setSearchBehindSlash(newSearchBehindSlash);
	}, [search]);

	async function onBangSelect(item: Bang) {
		await browserApi.tabs.create({ url: getBangSearchUrl(search, item) });
	}

	function onChange(data: onSearchInputChangeProps) {
		setSearch(data.value);
		EvilBob.instance().updatePluginView({
			search: data.value,
		});
	}

	let slashViewExactMatch: PluginCommandExtended | undefined;
	let commands: PluginCommandExtended[] = [];
	if (searchHasSlash) {
		[commands, slashViewExactMatch] = searchForPluginViewsWithSlash(
			searchBehindSlash,
			plugins,
		);
	} else {
		commands = searchForPluginCommands(search, plugins);
	}

	if (slashViewExactMatch) {
		setSearch(search.replace(`/${slashViewExactMatch?.slash}`, "").trim());
		setSearchBehindSlash("");
		importPluginCommand(
			slashViewExactMatch.plugin.id,
			slashViewExactMatch.name,
		).then((View) => {
			EvilBob.instance().renderPluginView(slashViewExactMatch, View, {
				search,
			});
		});
	}

	async function onManagePluginsClick() {
		await chrome.runtime.sendMessage({ event: "open-plugins" });
	}

	let searchHint = "";
	if (pluginView) {
		searchHint = pluginView.plugin.title;
	} else if (searchHasSlash) {
		searchHint = "Command Views";
	} else if (searchHasBang) {
		searchHint = "Bangs";
	}

	return (
		<>
			<MainTopBar
				search={search}
				inputRef={inputRef}
				showBack={!!pluginView}
				onBack={onBack}
				onChange={onChange}
				hint={searchHint}
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
					onCommandClick={onCommandClick}
					commands={commands}
				></CommandList>
			)}
		</>
	);
}
