import { Checkbox } from "@/components/Checkbox.tsx";
import {
	VList,
	type VListChildProps,
	type VListRef,
} from "@/components/VList.tsx";
import type { PluginViewProps } from "@/plugins";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

type MediaType =
	| "img"
	| "svg"
	| "video"
	| "background-image"
	| "picture"
	| "object"
	| "canvas";
export default function MediaContentView(props: PluginViewProps) {
	const [elements, setElements] = useState<HTMLOrSVGElement[]>([]);
	const [selectedCheckboxes, setSelectedCheckboxes] = useState<
		Record<MediaType, boolean>
	>({
		img: true,
		svg: true,
		video: true,
		picture: true,
		object: false,
		canvas: false,
		"background-image": false,
	});
	const width = 120;
	const height = 120;

	useEffect(() => {
		const elements: HTMLOrSVGElement[] = [];
		if (selectedCheckboxes.img) {
			elements.push(...Array.from(document.querySelectorAll("img")));
		}
		if (selectedCheckboxes.svg) {
			elements.push(...Array.from(document.querySelectorAll("svg")));
		}
		if (selectedCheckboxes.video) {
			elements.push(...Array.from(document.querySelectorAll("video")));
		}
		if (selectedCheckboxes.picture) {
			elements.push(...Array.from(document.querySelectorAll("picture")));
		}
		if (selectedCheckboxes.object) {
			elements.push(...Array.from(document.querySelectorAll("object")));
		}
		if (selectedCheckboxes.canvas) {
			elements.push(...Array.from(document.querySelectorAll("canvas")));
		}
		if (selectedCheckboxes["background-image"]) {
			const allElements = Array.from(document.querySelectorAll("*"));
			const elementsWithBackgroundImage: HTMLElement[] = [];

			for (const el of allElements) {
				if (el instanceof HTMLElement) {
					const style = getComputedStyle(el);
					if (
						style.backgroundImage &&
						style.backgroundImage !== "none"
					) {
						elementsWithBackgroundImage.push(el);
					}
				}
			}

			elements.push(...elementsWithBackgroundImage);
		}
		setElements(elements);
	}, [selectedCheckboxes]);

	function onCheckboxesChange(event: ChangeEvent<HTMLInputElement>) {
		const checkbox = event.target.value as MediaType;
		setSelectedCheckboxes({
			...selectedCheckboxes,
			[checkbox]: !selectedCheckboxes[checkbox],
		});
	}

	const listRef = useRef<VListRef>(null);

	return (
		<>
			<div
				className="flex items-center gap-2"
				onChange={onCheckboxesChange}
			>
				<Checkbox value="img" checked={selectedCheckboxes.img}>
					img
				</Checkbox>
				<Checkbox value="svg" checked={selectedCheckboxes.svg}>
					svg
				</Checkbox>
				<Checkbox value="video" checked={selectedCheckboxes.video}>
					video
				</Checkbox>
				<Checkbox value="picture" checked={selectedCheckboxes.picture}>
					picture
				</Checkbox>
				<Checkbox value="object" checked={selectedCheckboxes.object}>
					object
				</Checkbox>
				<Checkbox value="canvas" checked={selectedCheckboxes.canvas}>
					canvas
				</Checkbox>
				<Checkbox
					value="background-image"
					checked={selectedCheckboxes["background-image"]}
				>
					background-image (!)
				</Checkbox>
				<div className="ml-auto">{elements.length} Items</div>
			</div>
			<VList
				itemHeight={height}
				itemWidth={width}
				itemSpacing={{ x: 4, y: 4 }}
				ref={listRef}
				items={elements}
			>
				{({
					item,
					index,
					style,
				}: VListChildProps<HTMLOrSVGElement>) => {
					if (item instanceof HTMLImageElement) {
						return (
							<VList.ItemTile style={style} key={index}>
								<img
									alt={item.alt}
									src={item.src}
									className="w-full h-full object-contain"
								/>
							</VList.ItemTile>
						);
					}
					if (item instanceof SVGElement) {
						const node = item.cloneNode(true) as SVGElement;
						node.setAttribute("width", width.toString());
						node.setAttribute("height", height.toString());
						node.style.fill = "var(--color-fg)";
						node.style.color = "var(--color-fg)";
						return (
							<VList.ItemTile style={style} key={index}>
								<div
									// biome-ignore lint/security/noDangerouslySetInnerHtml: can do better? seems okish
									dangerouslySetInnerHTML={{
										__html: node.outerHTML,
									}}
								></div>
							</VList.ItemTile>
						);
					}
					if (item instanceof HTMLVideoElement) {
						return (
							<VList.ItemTile style={style} key={index}>
								<video
									muted
									src={item.src}
									className="w-full h-full object-contain"
								/>
							</VList.ItemTile>
						);
					}
					if (item instanceof HTMLElement) {
						return (
							<VList.ItemTile style={style} key={index}>
								<div
									style={{
										backgroundImage:
											getComputedStyle(item)
												.backgroundImage,
									}}
									className="w-full h-full object-contain"
								/>
							</VList.ItemTile>
						);
					}
					return <></>;
				}}
			</VList>
		</>
	);
}
