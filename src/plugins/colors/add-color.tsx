import { browserApi } from "@/browser-api.ts";
import { PluginActions } from "@/components/PluginActions";
import { toast } from "@/components/Toast";
import { VList, VListItem } from "@/components/VList.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import {
	type Rgba,
	type RgbaKey,
	decimalToHex,
	hexToRgba,
} from "@/lib/utils.ts";
import { type ChangeEvent, useEffect, useState } from "react";
interface Color {
	c: string;
	title: string;
}
const RGBA: RgbaKey[] = ["r", "g", "b", "a"] as const;

export function Command() {
	const [rgba, setRgba] = useState<Rgba>({
		r: 100,
		g: 100,
		b: 100,
		a: 255,
	});
	const [hexColor, setHexColor] = useState(
		`#${decimalToHex(rgba.r)}${decimalToHex(rgba.g)}${decimalToHex(rgba.b)}${decimalToHex(rgba.a)}`,
	);
	useEffect(() => {
		setHexColor(
			`#${decimalToHex(rgba.r)}${decimalToHex(rgba.g)}${decimalToHex(rgba.b)}${decimalToHex(rgba.a)}`,
		);
	}, [rgba]);

	async function onAddClick() {
		const colors: Color[] =
			(await browserApi.storage.sync.get(["colors"])).colors || [];
		colors.push({ c: hexColor, title: hexColor });
		await browserApi.storage.sync.set({ colors: colors });
		toast(<span>Color Added.</span>);
	}

	function onInputChange(
		e: ChangeEvent<HTMLInputElement>,
		colorSpace: RgbaKey,
	) {
		setRgba({
			...rgba,
			[colorSpace]: Math.min(
				255,
				Math.max(0, Number.parseInt(e.target.value) || 0),
			),
		});
	}

	function onInputHexChange(e: ChangeEvent<HTMLInputElement>) {
		setRgba(hexToRgba(e.target.value));
	}

	return (
		<>
			<PluginActions>
				<VList>
					<VListItem onClick={onAddClick}>Add</VListItem>
				</VList>
			</PluginActions>
			<div
				className="mx-auto mt-4 mb-12 w-48 h-48 border border-solid border-secondary-foreground rounded-lg"
				style={{ backgroundColor: hexColor }}
			></div>
			<div className="flex gap-20">
				<div className="flex flex-col flex-2">
					<div className="font-bold text-center">RGBA</div>
					{RGBA.map((colorSpace) => (
						<div
							className="flex items-center gap-2"
							key={colorSpace}
						>
							<span className="font-bold text-sm">
								{colorSpace}
							</span>
							<Slider
								onValueChange={(value) =>
									setRgba({
										...rgba,
										[colorSpace]: value[0] || 0,
									})
								}
								value={[rgba[colorSpace] || 100]}
								max={255}
								step={1}
							></Slider>
							<Input
								min={0}
								max={255}
								onChange={(e) => onInputChange(e, colorSpace)}
								className="w-24"
								value={rgba[colorSpace] || 100}
								type="number"
							></Input>
						</div>
					))}
				</div>
				<div className="flex flex-col flex-1">
					<div className="font-bold text-center">Hex</div>
					<Input
						className="text-center"
						value={hexColor}
						onChange={onInputHexChange}
					></Input>
				</div>
			</div>
			<div className="mt-auto flex items-center">
				<Button className="ml-auto" onClick={onAddClick}>
					Add
				</Button>
			</div>
		</>
	);
}
