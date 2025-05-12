import { PluginActions } from "@/components/PluginActions.tsx";
import { VList, VListItem } from "@/components/VList.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import {
	type Rgba,
	type RgbaKey,
	decimalToHex,
	hexToRgba,
} from "@/lib/utils.ts";
import { Label } from "@radix-ui/react-label";
import { type ChangeEvent, useEffect, useState } from "react";

export interface Color {
	c: string;
	title: string;
}
const RGBA: RgbaKey[] = ["r", "g", "b", "a"] as const;

export interface EditColorOnSaveProps {
	oldColor: Rgba;
	newColor: Rgba;
	oldTitle?: string;
	newTitle: string;
	currentColors: Color[];
}

export interface EditColorProps {
	r: number;
	g: number;
	b: number;
	a: number;
	initialTitle?: string;
	onCancel?: () => void;
	onSave: (props: EditColorOnSaveProps) => void;
}
export function EditColor({
	r,
	g,
	b,
	a,
	onCancel,
	initialTitle,
	onSave,
}: EditColorProps) {
	function rgbaAsHex() {
		return `#${decimalToHex(rgba.r)}${decimalToHex(rgba.g)}${decimalToHex(rgba.b)}${`0${decimalToHex(rgba.a)}`.slice(-2)}`;
	}
	const [rgba, setRgba] = useState<Rgba>({
		r,
		g,
		b,
		a,
	});
	const [title, setTitle] = useState<string>(initialTitle || rgbaAsHex());
	const [hexColor, setHexColor] = useState(rgbaAsHex());
	// biome-ignore lint/correctness/useExhaustiveDependencies: seems like an error, rgbaAsHex uses rgba.
	useEffect(() => {
		const newHexColor = rgbaAsHex();
		setHexColor(newHexColor);
		if (title === hexColor) {
			setTitle(newHexColor);
		}
	}, [rgba]);

	async function onSaveClick() {
		const colors: Color[] =
			(await browserApi.storage.sync.get(["colors"])).colors || [];

		onSave({
			newTitle: title,
			newColor: rgba,
			oldColor: { r, g, b, a },
			currentColors: colors,
			oldTitle: initialTitle,
		});
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
					<VListItem key={1} onClick={onSaveClick}>
						Save
					</VListItem>
					<VListItem key={2} onClick={onCancel}>
						Cancel
					</VListItem>
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
								value={[rgba[colorSpace] || 0]}
								max={255}
								step={1}
							></Slider>
							<Input
								min={0}
								max={255}
								onChange={(e) => onInputChange(e, colorSpace)}
								className="w-24"
								value={rgba[colorSpace] || 0}
								type="number"
							></Input>
						</div>
					))}
				</div>
				<div className="flex flex-col flex-1">
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="hex">Hex</Label>
						<Input
							id="hex"
							className="text-center"
							value={hexColor}
							onChange={onInputHexChange}
						></Input>
					</div>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							className="text-center"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						></Input>
					</div>
				</div>
			</div>
			<div className="mt-auto flex items-center">
				<Button onClick={onCancel}>Cancel</Button>
				<Button className="ml-auto" onClick={onSaveClick}>
					Save
				</Button>
			</div>
		</>
	);
}
