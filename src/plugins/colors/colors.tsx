import { toast } from "@/components/Toast.tsx";
import { VList, VListItem, VListItemTile } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { useEffect, useState } from "react";
interface Color {
	c: string;
	title: string;
}

export function Command() {
	const [search, useSearch] = useMemoryStore("search");
	const width = 160;
	const height = 160;
	const [colors, setColors] = useState<Color[] | undefined>();
	const [colorsLoadingMessage, setColorsLoadingMessage] =
		useState("loading...");

	function searchInColor(s: string, color: Color) {
		return (
			color.title.toLowerCase().includes(s.toLowerCase()) ||
			color.c.toLowerCase().includes(s.toLowerCase())
		);
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
			) : (
				<VList
					itemWidth={width}
					itemHeight={height}
					itemSpacing={{ x: 4, y: 4 }}
				>
					{(
						colors?.filter((color) =>
							searchInColor(search, color),
						) || []
					).map((item, index) => (
						<VListItemTile
							key={item.title}
							actions={<Actions {...item}></Actions>}
						>
							<div
								className="w-full h-full"
								style={{ backgroundColor: item.c }}
							></div>
							<span className="m-auto p-1">{item.title}</span>
						</VListItemTile>
					))}
				</VList>
			)}
		</>
	);
}

function Actions(color: Color) {
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

	return (
		<VList>
			<VListItem onClick={removeColor}>Remove</VListItem>
		</VList>
	);
}
