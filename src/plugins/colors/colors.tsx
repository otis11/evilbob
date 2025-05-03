import { browserApi } from "@/browser-api.ts";
import {
	VList,
	type VListChildProps,
	type VListRef,
} from "@/components/VList.tsx";
import type { PluginViewProps } from "@/plugins";
import { useEffect, useRef, useState } from "react";
interface Color {
	c: string;
	title: string;
}

export default function Colors({ search }: PluginViewProps) {
	const width = 160;
	const height = 160;
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
								<span className="m-auto p-1">{item.title}</span>
							</VList.ItemTile>
						);
					}}
				</VList>
			)}
		</>
	);
}
