import { toast } from "@/components/Toast.tsx";
import { VList, VListItem, VListItemTile } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { copyTextToClipboard, rgbaStyleToHex, unique } from "@/lib/utils.ts";
import type { Color } from "@/plugins/colors/components/edit-color.tsx";
import { useEffect, useState } from "react";
import {getAllColorsInDocument, saveColor} from "@/plugins/colors/lib.ts";

export interface WebsiteColor {
	c: string;
	count: number;
}

export function Command() {
	const [colors, setColors] = useState<WebsiteColor[]>([]);
	const [search, setSearch] = useMemoryStore("search");

	useEffect(() => {
		setColors(getAllColorsInDocument());
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
        await saveColor({title: color.c, c: color.c});
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
