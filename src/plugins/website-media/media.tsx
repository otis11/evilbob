import { Checkbox } from "@/components/Checkbox.tsx";
import { toast } from "@/components/Toast";
import { VList, VListItem, VListItemTile } from "@/components/VList.tsx";
import { EvilbobRoot } from "@/lib/evilbob-root";
import { useMemoryStore } from "@/lib/memory-store";
import { copyTextToClipboard, markElementInDocument } from "@/lib/utils.ts";
import { useEffect, useState } from "react";
let imageIdCounter = 0;
type MediaType =
	| "img"
	| "svg"
	| "video"
	| "background-image"
	| "picture"
	| "object"
	| "canvas";
export function Command() {
	const [elements, setElements] = useState<HTMLOrSVGElement[]>([]);
	const [search, useSearch] = useMemoryStore("search");
	const [selectedCheckboxes, setSelectedCheckboxes] = useState<
		Record<MediaType, boolean>
	>({
		img: true,
		svg: true,
		video: true,
		picture: true,
		object: true,
		canvas: true,
		"background-image": true,
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
					background-image
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
						if (
							!element.src.includes(search.toLowerCase()) &&
							!element.alt.includes(search.toLowerCase())
						) {
							return "";
						}
						const classes: string[] = [];
						if (element.naturalHeight > element.naturalWidth) {
							classes.push("w-auto", "h-full");
						} else {
							classes.push("w-full", "h-auto");
						}
						return (
							<VListItemTile
								className="p-1"
								key={imageIdCounter++}
								actions={
									<Actions
										ogItemReference={element}
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
						if (!element.outerHTML.includes(search.toLowerCase())) {
							return "";
						}
						const node = element.cloneNode(true) as SVGElement;
						const ogStyle = getComputedStyle(element);
						const classes = ["!text-foreground"];
						if (
							Number.parseInt(ogStyle.height.replace("px", "")) >
							Number.parseInt(ogStyle.width.replace("px", ""))
						) {
							classes.push("w-auto", "h-full");
						} else {
							classes.push("w-full", "h-auto");
						}
						if (ogStyle.fill !== "none" && ogStyle.fill !== "") {
							classes.push("!fill-foreground");
						}
						if (
							ogStyle.stroke !== "none" &&
							ogStyle.stroke !== ""
						) {
							classes.push("!stroke-foreground");
						}
						node.classList.add(...classes);
						return (
							<VListItemTile
								className="p-1"
								key={imageIdCounter++}
								actions={
									<Actions
										html={element.outerHTML}
										ogItemReference={element}
									></Actions>
								}
							>
								<div
									className="w-full h-full flex items-center justify-center"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: can do better? seems okish
									dangerouslySetInnerHTML={{
										__html: node.outerHTML,
									}}
								></div>
							</VListItemTile>
						);
					}
					if (element instanceof HTMLVideoElement) {
						if (!element.src.includes(search.toLowerCase())) {
							return "";
						}
						return (
							<VListItemTile
								className="p-1"
								key={imageIdCounter++}
								actions={
									<Actions
										ogItemReference={element}
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
						if (
							!getComputedStyle(element).backgroundImage.includes(
								search.toLowerCase(),
							)
						) {
							return "";
						}
						return (
							<VListItemTile
								className="p-1"
								key={imageIdCounter++}
								actions={
									<Actions
										ogItemReference={element}
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
									className="w-full h-full bg-contain bg-center bg-no-repeat"
								/>
							</VListItemTile>
						);
					}
					return "";
				})}
			</VList>
		</>
	);
}

function Actions(props: {
	url?: string;
	html?: string;
	backgroundStyle?: string;
	ogItemReference: HTMLOrSVGElement;
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

	function highlightOnPage() {
		EvilbobRoot.instance().close();
		requestAnimationFrame(() => {
			if (
				props.ogItemReference instanceof HTMLElement ||
				props.ogItemReference instanceof SVGElement
			) {
				markElementInDocument(props.ogItemReference);
			}
		});
	}

	return (
		<VList>
			{props.url ? (
				<VListItem key="url" onClick={() => tryCopy(props.url)}>
					Copy Url
				</VListItem>
			) : (
				""
			)}
			<VListItem key="highlightOnPage" onClick={highlightOnPage}>
				Highlight on Page (experimental)
			</VListItem>
			{props.html ? (
				<VListItem key="html" onClick={() => tryCopy(props.html)}>
					Copy Html
				</VListItem>
			) : (
				""
			)}
			{props.backgroundStyle ? (
				<VListItem
					key="style"
					onClick={() => tryCopy(props.backgroundStyle)}
				>
					Copy Background Style
				</VListItem>
			) : (
				""
			)}
		</VList>
	);
}
