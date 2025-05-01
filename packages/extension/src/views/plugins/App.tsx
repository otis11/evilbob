import { searchInPlugin } from "@evil-bob/plugins/src/plugin.ts";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import pluginJsonList from "../../../../plugins/src/list.json";
import type { Plugin } from "../../../../plugins/src/types.ts";
import { Button } from "../../components/Button.tsx";
import {
	VList,
	type VListChildProps,
	type VListRef,
} from "../../components/VList.tsx";

import {
	SearchInput,
	type onSearchInputChangeProps,
} from "../../components/SearchInput.tsx";
import { type EvilBobConfig, getConfig } from "../../config/config.ts";
import { disablePlugin, enablePlugin } from "../../config/plugins-frontend.ts";
const plugins = pluginJsonList as Plugin[];

interface AppProps {
	config: EvilBobConfig;
}
export default function App({ config }: AppProps) {
	const listRef = useRef<VListRef>(null);
	const [localConfig, setLocalConfig] = useState<EvilBobConfig>(config);
	const [searchValue, setSearchValue] = useState("");
	const [pluginLoading, setPluginLoading] = useState("");
	useEffect(() => {
		listRef.current?.focus();
	}, []);

	async function onEnableDisableClick(plugin: Plugin) {
		setPluginLoading(plugin.id);
		if (localConfig.plugins.enabled[plugin.id]) {
			await disablePlugin(plugin);
		} else {
			await enablePlugin(plugin);
		}
		await setLocalConfig(await getConfig());
		setPluginLoading("");
	}

	function onChange(data: onSearchInputChangeProps) {
		setSearchValue(data.value);
	}

	return (
		<>
			<SearchInput onChange={onChange}></SearchInput>
			<VList
				keyboardListenerTarget={window}
				itemHeight={280}
				itemWidth={280}
				itemSpacing={{ x: 12, y: 12 }}
				ref={listRef}
				items={plugins.filter((plugin) =>
					searchInPlugin(searchValue, plugin),
				)}
			>
				{({ item, index, style }: VListChildProps<Plugin>) => {
					return (
						<VList.ItemTile
							className="rounded-lg m-2 p-5"
							style={style}
							key={item.id}
						>
							<div className="pb-3">{item.definition.title}</div>
							<div className="text-fg-weak">
								{item.definition.description}
							</div>
							<Button
								className="mt-auto w-full"
								onClick={() => onEnableDisableClick(item)}
								variant={
									localConfig.plugins.enabled[item.id]
										? "accent"
										: "default"
								}
								loading={pluginLoading === item.id}
							>
								{localConfig.plugins.enabled[item.id] ? (
									<>
										<Check
											className="mr-2"
											size={16}
										></Check>
										Disable
									</>
								) : (
									"Enable"
								)}
							</Button>
						</VList.ItemTile>
					);
				}}
			</VList>
		</>
	);
}
