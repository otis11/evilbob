import { Checkbox } from "@/components/Checkbox.tsx";
import { toast } from "@/components/Toast";
import { VList, VListItemTile } from "@/components/VList.tsx";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu.tsx";
import { copyTextToClipboard } from "@/lib/utils.ts";
import type { PluginViewProps } from "@/plugins";
import { useEffect, useState } from "react";

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

	function onCheckboxesChange(checkbox: MediaType) {
		setSelectedCheckboxes({
			...selectedCheckboxes,
			[checkbox]: !selectedCheckboxes[checkbox],
		});
	}

	return (
		<>
			<div className="flex items-center gap-2 pb-4">
				<Checkbox
					onClick={() => onCheckboxesChange("img")}
					value="img"
					checked={selectedCheckboxes.img}
				>
					img
				</Checkbox>
				<Checkbox
					onClick={() => onCheckboxesChange("svg")}
					value="svg"
					checked={selectedCheckboxes.svg}
				>
					svg
				</Checkbox>
				<Checkbox
					onClick={() => onCheckboxesChange("video")}
					value="video"
					checked={selectedCheckboxes.video}
				>
					video
				</Checkbox>
				<Checkbox
					onClick={() => onCheckboxesChange("picture")}
					value="picture"
					checked={selectedCheckboxes.picture}
				>
					picture
				</Checkbox>
				<Checkbox
					onClick={() => onCheckboxesChange("object")}
					value="object"
					checked={selectedCheckboxes.object}
				>
					object
				</Checkbox>
				<Checkbox
					onClick={() => onCheckboxesChange("canvas")}
					value="canvas"
					checked={selectedCheckboxes.canvas}
				>
					canvas
				</Checkbox>
				<Checkbox
					onClick={() => onCheckboxesChange("background-image")}
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
			>
				{elements.map((element, index) => {
					if (element instanceof HTMLImageElement) {
						return (
							<VListItemTile
								className="p-1"
								key={index}
								actions={
									<Actions
										url={element.src}
										html={element.outerHTML}
									></Actions>
								}
							>
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
						node.classList.add(
							"text-foreground",
							"fill-foreground",
							"w-full",
							"h-auto",
						);
						return (
							<VListItemTile
								className="p-1"
								key={index}
								actions={
									<Actions html={element.outerHTML}></Actions>
								}
							>
								<div
									className="w-full h-full object-contain"
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
							<VListItemTile
								className="p-1"
								key={index}
								actions={
									<Actions
										url={element.src}
										html={element.outerHTML}
									></Actions>
								}
							>
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
							<VListItemTile
								className="p-1"
								key={index}
								actions={
									<Actions
										backgroundStyle={
											getComputedStyle(element)
												.backgroundImage
										}
										html={element.outerHTML}
									></Actions>
								}
							>
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

function Actions(props: {
	url?: string;
	html?: string;
	backgroundStyle?: string;
}) {
	async function tryCopy(text: string | undefined) {
		if (!text) {
			return;
		}
		if (await copyTextToClipboard(text)) {
			toast("Copied.");
		} else {
			toast("Copy failed.");
		}
	}

	return (
		<>
			{props.url ? (
				<DropdownMenuItem onClick={() => tryCopy(props.url)}>
					Copy Url
				</DropdownMenuItem>
			) : (
				""
			)}
			{props.html ? (
				<DropdownMenuItem onClick={() => tryCopy(props.html)}>
					Copy Html
				</DropdownMenuItem>
			) : (
				""
			)}
			{props.backgroundStyle ? (
				<DropdownMenuItem
					onClick={() => tryCopy(props.backgroundStyle)}
				>
					Copy Background Style
				</DropdownMenuItem>
			) : (
				""
			)}
		</>
	);
}
