import { VList, VListItemTile } from "@/components/VList.tsx";
import { Button } from "@/components/ui/button.tsx";
import { type Plugin, searchInPlugin } from "@/plugins";
import pluginJsonList from "@/plugins/list.json";
import { Check } from "lucide-react";
import { type ChangeEvent, useState } from "react";

import { Input } from "@/components/ui/input.tsx";
import { type EvilBobConfig, getConfig } from "@/lib/config.ts";
import { disablePlugin, enablePlugin } from "@/lib/plugins-frontend.ts";
const plugins = pluginJsonList as Plugin[];

interface AppProps {
	config: EvilBobConfig;
}
export default function App({ config }: AppProps) {
	const [localConfig, setLocalConfig] = useState<EvilBobConfig>(config);
	const [searchValue, setSearchValue] = useState("");
	const [pluginLoading, setPluginLoading] = useState("");

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

	function onChange(data: ChangeEvent<HTMLInputElement>) {
		setSearchValue(data.target.value);
	}

	return (
		<>
			<Input className="h-12 !text-lg" onChange={onChange}></Input>
			<VList
				keyboardListenerTarget={window}
				itemHeight={280}
				itemWidth={280}
				itemSpacing={{ x: 12, y: 12 }}
			>
				{plugins
					.filter((plugin) => searchInPlugin(searchValue, plugin))
					.map((item) => (
						<VListItemTile
							className="rounded-lg m-2 p-5"
							key={item.id}
						>
							<div className="pb-3">{item.definition.title}</div>
							<div className="text-muted-foreground">
								{item.definition.description}
							</div>
							<Button
								className="mt-auto w-full"
								onClick={() => onEnableDisableClick(item)}
								variant={
									localConfig.plugins.enabled[item.id]
										? "secondary"
										: "default"
								}
								disabled={pluginLoading === item.id}
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
						</VListItemTile>
					))}
			</VList>
		</>
	);
}
