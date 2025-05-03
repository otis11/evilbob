import { Checkbox } from "@/components/Checkbox.tsx";
import { VList, VListItemTile, type VListRef } from "@/components/VList.tsx";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu.tsx";
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
export function Command(props: PluginViewProps) {
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
			>
				{elements.map((element, index) => {
					if (element instanceof HTMLImageElement) {
						return (
							<VListItemTile key={index}>
								<img
									alt={element.alt}
									src={element.src}
									className="w-full h-full object-contain"
								/>
							</VListItemTile>
						);
					}
					if (element instanceof SVGElement) {
						const node = element.cloneNode(true) as SVGElement;
						node.setAttribute("width", width.toString());
						node.setAttribute("height", height.toString());
						node.style.fill = "var(--foreground)";
						node.style.color = "var(--foreground)";
						return (
							<VListItemTile key={index}>
								<div
									// biome-ignore lint/security/noDangerouslySetInnerHtml: can do better? seems okish
									dangerouslySetInnerHTML={{
										__html: node.outerHTML,
									}}
								></div>
							</VListItemTile>
						);
					}
					if (element instanceof HTMLVideoElement) {
						return (
							<VListItemTile key={index}>
								<video
									muted
									src={element.src}
									className="w-full h-full object-contain"
								/>
							</VListItemTile>
						);
					}
					if (element instanceof HTMLElement) {
						return (
							<VListItemTile key={index}>
								<div
									style={{
										backgroundImage:
											getComputedStyle(element)
												.backgroundImage,
									}}
									className="w-full h-full object-contain"
								/>
							</VListItemTile>
						);
					}
					return <div key={index}></div>;
				})}
			</VList>
		</>
	);
}

function Actions(props: { url: string }) {
	return <DropdownMenuItem>{props.url}</DropdownMenuItem>;
}
