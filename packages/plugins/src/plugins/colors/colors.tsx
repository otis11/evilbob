import { browserApi } from "@evil-bob/extension/src/browser-api.ts";
import {
	VList,
	type VListChildProps,
	type VListRef,
} from "@evil-bob/extension/src/components/VList.tsx";
import { useEffect, useRef, useState } from "react";
import type { PluginViewProps } from "../../types.ts";
interface Color {
	c: string;
	title: string;
}

export default function Colors({ search }: PluginViewProps) {
	const width = 120;
	const height = 120;
	const [colors, setColors] = useState<Color[] | undefined>();
	const listRef = useRef<VListRef>(null);
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
					items={
						colors?.filter((color) =>
							searchInColor(search, color),
						) || []
					}
					itemWidth={width}
					itemHeight={height}
					ref={listRef}
				>
					{({ item, style, index }: VListChildProps<Color>) => {
						return (
							<VList.ItemTile key={index} style={style}>
								<div
									className="w-full h-full"
									style={{ backgroundColor: item.c }}
								></div>
								<span className="m-auto p-2">{item.title}</span>
							</VList.ItemTile>
						);
					}}
				</VList>
			)}
		</>
	);
}
