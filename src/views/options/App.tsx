import { Button } from "@/components/ui/button.tsx";
import { ExternalLinkIcon, Loader2 } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

import { KeybindingInput } from "@/components/KeybindingInput";
import { NumberSelect } from "@/components/NumberSelect.tsx";
import { Input } from "@/components/ui/input.tsx";
import { type EvilbobConfig, getConfig, updateConfig } from "@/lib/config.ts";
import {
	type Keybinding,
	type KeybindingKey,
	defaultKeybindings,
} from "@/lib/keybindings.ts";

export default function App() {
	const [localConfig, setLocalConfig] = useState<EvilbobConfig | undefined>(
		undefined,
	);
	const [searchValue, setSearchValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const [keybindingLoading, setKeybindingLoading] = useState<string>("");

	useEffect(() => {
		getConfig().then((config) => setLocalConfig(config));
		inputRef.current?.focus();
	}, []);

	function onChange(data: ChangeEvent<HTMLInputElement>) {
		setSearchValue(data.target.value);
	}

	async function onPluginsClick() {
		await chrome.runtime.sendMessage({ event: "open-plugins" });
	}

	async function onKeysUpInput(
		key: KeybindingKey,
		keybinding: Keybinding,
		keys: string[],
	) {
		setKeybindingLoading(key);
		await updateConfig({
			// @ts-expect-error this config will get merged. no keys will be missing
			keybindings: {
				[key]: {
					...keybinding,
					keys: keys,
				},
			},
		});
		setLocalConfig(await getConfig());
		setKeybindingLoading("");
	}

	async function onHeightChange(value: number) {
		if (!localConfig) {
			return;
		}
		await updateConfig({
			dimensions: {
				height: value,
				width: localConfig.dimensions.width,
			},
		});
		setLocalConfig(await getConfig());
	}

	async function onWidthChange(value: number) {
		if (!localConfig) {
			return;
		}
		await updateConfig({
			dimensions: {
				width: value,
				height: localConfig.dimensions.height,
			},
		});
		setLocalConfig(await getConfig());
	}

	async function resetKeybindings() {
		await updateConfig({
			keybindings: defaultKeybindings,
		});
		setLocalConfig(await getConfig());
	}

	return (
		<>
			{localConfig ? (
				<>
					<div className="flex gap-4 items-center mb-4">
						<Input
							autoCapitalize="off"
							autoCorrect="off"
							autoComplete="off"
							ref={inputRef}
							className="h-12 !text-lg"
							onChange={onChange}
							data-vlist-stay-focused
						></Input>
						<Button onClick={onPluginsClick}>
							<span className="mr-2">Plugins</span>
							<ExternalLinkIcon></ExternalLinkIcon>
						</Button>
					</div>
					<div className="flex gap-4 items-center">
						<h2 className="font-bold text-base">Keybindings</h2>
						<Button onClick={resetKeybindings} variant="ghost">
							Reset
						</Button>
					</div>

					{(Object.keys(localConfig.keybindings) as KeybindingKey[])
						.filter((key) => {
							return (
								localConfig.keybindings[key].keys
									.join("")
									.toLowerCase()
									.includes(searchValue.toLowerCase()) ||
								localConfig.keybindings[key].title
									?.toLowerCase()
									.includes(searchValue.toLowerCase()) ||
								localConfig.keybindings[key].description
									?.toLowerCase()
									.includes(searchValue.toLowerCase())
							);
						})
						.map((key) => (
							<div
								className={`${
									keybindingLoading === key
										? "opacity-60 pointer-events-none"
										: ""
								} relative`}
								key={localConfig.keybindings[key]?.title}
							>
								{keybindingLoading === key ? (
									<Loader2
										className="animate-spin absolute bottom-2 left-2"
										size={20}
									/>
								) : (
									""
								)}
								<h3 className="text-sm pt-4">
									{localConfig.keybindings[key]?.title}
								</h3>
								<span className="text-muted-foreground text-sm">
									{localConfig.keybindings[key]?.description}
								</span>
								<KeybindingInput
									className="max-w-60"
									keys={
										localConfig.keybindings[key]?.keys || []
									}
									onKeydownTimeout={(keys) =>
										onKeysUpInput(
											key,
											localConfig.keybindings[key],
											keys,
										)
									}
								/>
							</div>
						))}
					<h2 className="font-bold text-base pt-4">
						Window Dimensions (width, height)
					</h2>
					<div className="flex gap-4 items-center">
						<NumberSelect
							container={document.body}
							values={[400, 500, 600, 800, 1000]}
							onValueChange={onWidthChange}
							value={localConfig.dimensions.width}
						></NumberSelect>
						<NumberSelect
							container={document.body}
							values={[400, 500, 600, 800, 1000]}
							onValueChange={onHeightChange}
							value={localConfig.dimensions.height}
						></NumberSelect>
					</div>
					<div className="pb-12"></div>
				</>
			) : (
				""
			)}
		</>
	);
}
