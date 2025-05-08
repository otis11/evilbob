import { VList, VListItemTile } from "@/components/VList.tsx";
import { Button } from "@/components/ui/button.tsx";
import { type Plugin, searchInPlugin } from "@/plugins";
import pluginJsonList from "@/plugins/list.json";
import { Check } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input.tsx";
import { type EvilbobConfig, getConfig } from "@/lib/config.ts";
import { disablePlugin, enablePlugin } from "@/lib/plugins-frontend.ts";
const plugins = pluginJsonList as Plugin[];

interface AppProps {
	config: EvilbobConfig;
}
export default function App({ config }: AppProps) {
	const [localConfig, setLocalConfig] = useState<EvilbobConfig>(config);
	const [searchValue, setSearchValue] = useState("");
	const [pluginLoading, setPluginLoading] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
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

	function onChange(data: ChangeEvent<HTMLInputElement>) {
		setSearchValue(data.target.value);
	}

	return (
		<>
			<Input
				autoCapitalize="off"
				autoCorrect="off"
				autoComplete="off"
				ref={inputRef}
				className="h-12 !text-lg mb-4"
				onChange={onChange}
				data-vlist-stay-focused
			></Input>
			<VList
				activeElementTarget={document}
				onSelect={onEnableDisableClick}
				itemHeight={280}
				itemWidth={280}
				itemSpacing={{ x: 12, y: 12 }}
			>
				{plugins
					.filter((plugin) => searchInPlugin(searchValue, plugin))
					.map((item) => (
						<VListItemTile
							data={item}
							className="rounded-lg m-2 p-5"
							key={item.id}
						>
							<div className="pb-2">{item.definition.title}</div>
							<div className="text-muted-foreground">
								{item.definition.description}
							</div>
							<div className="mt-auto pb-4 text-muted-foreground flex gap-4 text-xs">
								<span>
									{
										item.definition.commands?.filter(
											(c) => c.type === "command",
										).length
									}{" "}
									Commands
								</span>
								<span>
									{
										item.definition.commands?.filter(
											(c) => c.type === "view",
										).length
									}{" "}
									Views
								</span>
							</div>
							<Button
								className="w-full"
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
