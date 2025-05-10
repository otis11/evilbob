import { Button } from "@/components/ui/button.tsx";
import { ExternalLinkIcon } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

import { KeybindingInput } from "@/components/KeybindingInput";
import { NumberSelect } from "@/components/NumberSelect.tsx";
import { Input } from "@/components/ui/input.tsx";
import { type EvilbobConfig, updateConfig } from "@/lib/config.ts";
import type { Keybinding, KeybindingKey } from "@/lib/keybindings.ts";

interface AppProps {
	config: EvilbobConfig;
}
export default function App({ config }: AppProps) {
	const [searchValue, setSearchValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const [keybindingLoading, setKeybindingLoading] = useState<string>("");

	useEffect(() => {
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
		setKeybindingLoading("");
	}

	async function onHeightChange(value: number) {
		await updateConfig({
			dimensions: {
				height: value,
				width: config.dimensions.width,
			},
		});
	}

	async function onWidthChange(value: number) {
		await updateConfig({
			dimensions: {
				width: value,
				height: config.dimensions.height,
			},
		});
	}

	return (
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
			<h2 className="font-bold text-base">Keybindings</h2>
			{(Object.keys(config.keybindings) as KeybindingKey[])
				.filter((key) => {
					return (
						config.keybindings[key].keys
							.join("")
							.toLowerCase()
							.includes(searchValue.toLowerCase()) ||
						config.keybindings[key].title
							?.toLowerCase()
							.includes(searchValue.toLowerCase()) ||
						config.keybindings[key].description
							?.toLowerCase()
							.includes(searchValue.toLowerCase())
					);
				})
				.map((key) => (
					<div
						className={
							keybindingLoading === key
								? "opacity-60 pointer-events-none"
								: ""
						}
						key={config.keybindings[key]?.title}
					>
						<h3 className="text-sm pt-4">
							{config.keybindings[key]?.title}
						</h3>
						<span className="text-muted-foreground text-sm">
							{config.keybindings[key]?.description}
						</span>
						<KeybindingInput
							className="max-w-60"
							keys={config.keybindings[key]?.keys || []}
							onAllKeysUp={(keys) =>
								onKeysUpInput(
									key,
									config.keybindings[key],
									keys,
								)
							}
						/>
					</div>
				))}
			<h2 className="font-bold text-base pt-4">Window Dimensions</h2>
			<div className="flex gap-4 items-center">
				<NumberSelect
					container={document.body}
					values={[400, 500, 600, 800, 1000]}
					onValueChange={onHeightChange}
					value={config.dimensions.height}
				></NumberSelect>
				<NumberSelect
					container={document.body}
					values={[400, 500, 600, 800, 1000]}
					onValueChange={onWidthChange}
					value={config.dimensions.width}
				></NumberSelect>
			</div>
			<div className="pb-12"></div>
		</>
	);
}
