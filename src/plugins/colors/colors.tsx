import { toast } from "@/components/Toast.tsx";
import { VList, VListItem, VListItemTile } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import {
	type Rgba,
	copyTextToClipboard,
	hexToRgba,
	rgbaToHex,
	unique,
} from "@/lib/utils";
import {
	EditColor,
	type EditColorOnSaveProps,
} from "@/plugins/colors/components/edit-color.tsx";
import { useEffect, useState } from "react";
interface Color {
	c: string;
	title: string;
}

export function Command() {
	const [editColor, setEditColor] = useState<Color | undefined>();
	const [search, useSearch] = useMemoryStore("search");
	const [colors, setColors] = useState<Color[] | undefined>();
	const [editRgba, setEditRgba] = useState<Rgba | undefined>(undefined);
	const [colorsLoadingMessage, setColorsLoadingMessage] =
		useState("loading...");

	useEffect(() => {
		if (editColor) {
			setEditRgba(hexToRgba(editColor.c));
		}
	}, [editColor]);
	async function onEditSave({
		newColor,
		newTitle,
		oldColor,
		oldTitle,
		currentColors,
	}: EditColorOnSaveProps) {
		currentColors = currentColors.filter(
			(c) => !(c.c === rgbaToHex(oldColor) && c.title === oldTitle),
		);
		currentColors.push({
			c: rgbaToHex(newColor),
			title: unique(
				newTitle,
				currentColors.map((c) => c.title),
			),
		});
		await browserApi.storage.sync.set({ colors: currentColors });
		toast(<span>Color Edited.</span>);
	}

	useEffect(() => {
		browserApi.storage.sync.get(["colors"]).then((res) => {
			setColors(res.colors);
			setColorsLoadingMessage("");
		});
	}, []);

	return (
		<>
			{colorsLoadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{colorsLoadingMessage}
				</div>
			) : editRgba && editColor ? (
				<EditColor
					{...editRgba}
					onSave={onEditSave}
					onCancel={() => setEditColor(undefined)}
					initialTitle={editColor.title}
				></EditColor>
			) : (
				<ColorList
					setEditColor={setEditColor}
					colors={colors}
					search={search}
				></ColorList>
			)}
		</>
	);
}

interface ColorListProps {
	colors: Color[] | undefined;
	search: string;
	setEditColor: (newColor: Color | undefined) => void;
}
function ColorList({ colors, search, setEditColor }: ColorListProps) {
	function searchInColor(s: string, color: Color) {
		return (
			color.title.toLowerCase().includes(s.toLowerCase()) ||
			color.c.toLowerCase().includes(s.toLowerCase())
		);
	}

	async function onSelect(item: Color) {
		await copyTextToClipboard(item.c);
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
					key={item.title}
					actions={
						<Actions
							color={item}
							setEditColor={setEditColor}
						></Actions>
					}
				>
					<div
						className="w-full h-full"
						style={{ backgroundColor: item.c }}
					></div>
					<span className="m-auto p-1">{item.title}</span>
				</VListItemTile>
			))}
		</VList>
	);
}

interface ActionsProps {
	color: Color;
	setEditColor: (color: Color | undefined) => void;
}
function Actions({ color, setEditColor }: ActionsProps) {
	async function removeColor() {
		const colors: Color[] =
			(await browserApi.storage.sync.get(["colors"])).colors || [];
		await browserApi.storage.sync.set({
			colors: colors.filter(
				(c) => !(c.title === color.title && c.c === color.c),
			),
		});
		toast(<span>Color Removed.</span>);
	}

	function editColor() {
		setEditColor(color);
	}

	return (
		<VList>
			<VListItem key={1} onClick={editColor}>
				Edit
			</VListItem>
			<VListItem key={2} onClick={removeColor}>
				Remove
			</VListItem>
		</VList>
	);
}
