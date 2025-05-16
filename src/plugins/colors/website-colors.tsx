import { toast } from "@/components/Toast.tsx";
import { VList, VListItem, VListItemTile } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { copyTextToClipboard, rgbaStyleToHex, unique } from "@/lib/utils.ts";
import type { Color } from "@/plugins/colors/components/edit-color.tsx";
import { useEffect, useState } from "react";

export interface WebsiteColor {
	c: string;
	count: number;
}

export function Command() {
	const [colors, setColors] = useState<WebsiteColor[]>([]);
	const [search, setSearch] = useMemoryStore("search");

	useEffect(() => {
		const colorMap: Record<string, number> = {};
		const allElements = Array.from(document.querySelectorAll("*"));

		function addToColorMap(c: string) {
			try {
				const hex = rgbaStyleToHex(c);
				if (colorMap[hex]) {
					colorMap[hex] += 1;
				} else {
					colorMap[hex] = 1;
				}
			} catch (e) {}
		}

		for (const el of allElements) {
			const style = getComputedStyle(el);
			const possibleColors = [
				style.color,
				style.backgroundColor,
				style.borderColor,
				style.borderInlineColor,
				style.caretColor,
				style.accentColor,
				style.outlineColor,
				style.floodColor,
				style.lightingColor,
				style.scrollbarColor,
				style.fill,
				style.stopColor,
				style.stroke,
			];
			for (const possibleColor of possibleColors) {
				if (possibleColor.trim() !== "") {
					addToColorMap(possibleColor);
				}
			}
		}
		setColors(
			Object.keys(colorMap)
				.map((color) => ({
					c: color,
					count: colorMap[color] || 1,
				}))
				.sort((a, b) => {
					if (a.count > b.count) {
						return -1;
					}
					if (a.count < b.count) {
						return 1;
					}
					return 0;
				}),
		);
	}, []);

	function searchInColor(s: string, color: WebsiteColor) {
		return color.c.toLowerCase().includes(s.toLowerCase());
	}

	async function onSelect(color: WebsiteColor) {
		await copyTextToClipboard(color.c);
		toast("Copied.");
	}

	return (
		<VList
			itemWidth={160}
			itemHeight={160}
			itemSpacing={{ x: 4, y: 4 }}
			onSelect={onSelect}
		>
			{(
				colors?.filter((color) => searchInColor(search, color)) || []
			).map((item, index) => (
				<VListItemTile
					data={item}
					key={item.c}
					actions={<Actions color={item}></Actions>}
				>
					<div
						className="w-full h-full"
						style={{ backgroundColor: item.c }}
					></div>
					<span className="m-auto p-1">{item.c}</span>
					<span className="m-auto p-1 text-muted-foreground">
						({item.count})
					</span>
				</VListItemTile>
			))}
		</VList>
	);
}

interface ActionsProps {
	color: WebsiteColor;
}
function Actions({ color }: ActionsProps) {
	async function onSaveClick() {
		const currentColors: Color[] =
			(await browserApi.storage.sync.get(["colors"])).colors || [];
		currentColors.push({
			c: color.c,
			title: unique(
				color.c,
				currentColors.map((c) => c.title),
			),
		});
		await browserApi.storage.sync.set({ colors: currentColors });
		toast(<span>Color Added.</span>);
	}

	return (
		<VList>
			<VListItem key={1} onClick={onSaveClick}>
				Save
			</VListItem>
		</VList>
	);
}
