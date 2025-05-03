import { browserApi } from "@/browser-api.ts";
import { VList, VListItemTile } from "@/components/VList.tsx";
import type { PluginViewProps } from "@/plugins";
import { useEffect, useState } from "react";
interface Color {
	c: string;
	title: string;
}

export function Command({ search }: PluginViewProps) {
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
				<VList itemWidth={width} itemHeight={height}>
					{(
						colors?.filter((color) =>
							searchInColor(search, color),
						) || []
					).map((item, index) => (
						<VListItemTile key={index}>
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
