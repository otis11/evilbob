import { KeyboardListener } from "@/lib/utils.ts";
import {
	type CSSProperties,
	type FunctionComponent,
	type JSX,
	type ReactNode,
	type RefObject,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { getConfig } from "../lib/config.ts";
import { EvilBob } from "./EvilBob.tsx";

interface VListProps<T> {
	children: ReactNode;
	ref: RefObject<VListRef | null>;
	itemHeight: number;
	itemWidth: number;
	itemsOutOfBounds?: number;
	itemSpacing?: {
		x: number;
		y: number;
	};
	keyboardListenerTarget?: Window | Document | HTMLElement;
}

export interface VListRef {
	focus: () => void;
	blur: () => void;
	highlightNth: (n: number) => void;
	highlightNextBelow: () => void;
	highlightNextAbove: () => void;
	highlightNextLeft: () => void;
	highlightNextRight: () => void;
	getHighlighted: () => HTMLElement | undefined;
}

export interface VListChildProps<T> {
	style: CSSProperties;
	index: number;
	item: T;
}

export type VListChild<T> = (props: VListChildProps<T>) => JSX.Element;

let highlightedItem: HTMLElement | undefined;
let focusedList: HTMLElement | undefined;

function highlightElement(el: HTMLElement | undefined | null) {
	if (!el) {
		return;
	}

	if (highlightedItem) {
		highlightedItem.classList.remove("!bg-accent", "!border-ring");
	}

	highlightedItem = el;
	if (el.classList.contains("vlist-item-tile")) {
		highlightedItem.classList.add("!border-ring");
	} else {
		highlightedItem.classList.add("!bg-accent");
	}
}

function focusList(el: HTMLElement | undefined | null) {
	if (!el) {
		return;
	}
	if (focusedList) {
		focusedList.classList.remove("vlist-focused");
	}
	focusedList = el;
	focusedList.classList.add("vlist-focused");
}

const VList = <T,>({
	children,
	ref,
	itemHeight,
	itemWidth,
	itemsOutOfBounds,
	itemSpacing,
	keyboardListenerTarget,
}: VListProps<T>) => {
	const [renderedChildren, setRenderedChildren] = useState<JSX.Element[]>([]);
	const root = useRef<HTMLUListElement>(null);
	const heightDiv = useRef<HTMLDivElement>(null);
	const [startIndex, setStartIndex] = useState(0);
	const [realItemHeight, setRealItemHeight] = useState(0);
	const [realItemWidth, setRealItemWidth] = useState(0);
	const [itemCountPerRow, setItemCountPerRow] = useState(0);
	const [scrollTop, setScrollTop] = useState(root.current?.scrollTop || 0);
	const parsedChildren = Array.isArray(children) ? children : [];

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore for now, as it should only run once to register keybord listeners
	useEffect(() => {
		getConfig().then((config) => {
			const keyboardListener = new KeyboardListener(
				keyboardListenerTarget || EvilBob.instance().shadowRoot,
			);
			keyboardListener.register(config.keybindings.nextAbove.keys, () => {
				if (!isFocused()) return;
				ref.current?.highlightNextAbove();
			});
			keyboardListener.register(config.keybindings.nextBelow.keys, () => {
				if (!isFocused()) return;
				ref.current?.highlightNextBelow();
			});
			keyboardListener.register(config.keybindings.nextLeft.keys, () => {
				if (!isFocused()) return;
				ref.current?.highlightNextLeft();
			});
			keyboardListener.register(config.keybindings.nextRight.keys, () => {
				if (!isFocused()) return;
				ref.current?.highlightNextRight();
			});
			keyboardListener.register(
				config.keybindings.selectResult.keys,
				() => {
					if (!isFocused()) return;
					const highlighted = ref.current?.getHighlighted();
					highlighted?.click();
				},
			);
		});
		requestAnimationFrame(() => {
			ref.current?.focus();
			ref.current?.highlightNth(0);
		});
	}, []);
	useEffect(() => {
		const availHeight = root.current?.getBoundingClientRect().height || 0;
		const availWidth = root.current?.getBoundingClientRect().width || 0;
		const localRealItemWidth = itemWidth + (itemSpacing?.x || 0);
		const localRealItemHeight = itemHeight + (itemSpacing?.x || 0);
		const localItemCountPerRow =
			itemWidth === -1 ? 1 : Math.floor(availWidth / localRealItemWidth);
		const totalRowCount = Math.ceil(
			parsedChildren.length / localItemCountPerRow,
		);

		if (root.current) {
			root.current.style.position = "relative";
		}
		if (heightDiv.current) {
			heightDiv.current.style.width = "100%";
			heightDiv.current.style.height = `${localRealItemHeight * totalRowCount}px`;
		}

		const outOfBounds = (itemsOutOfBounds || 3) * localItemCountPerRow;
		const localStartIndex = Math.max(
			Math.ceil(scrollTop / localRealItemHeight) * localItemCountPerRow -
				outOfBounds,
			0,
		);
		const localEndIndex = Math.min(
			localStartIndex +
				Math.ceil(availHeight / localRealItemHeight) *
					localItemCountPerRow +
				outOfBounds,
			totalRowCount * localItemCountPerRow,
		);

		setStartIndex(localStartIndex);
		setRealItemHeight(localRealItemHeight);
		setRealItemWidth(localRealItemWidth);
		setItemCountPerRow(localItemCountPerRow);
		setRenderedChildren(
			parsedChildren.slice(localStartIndex, localEndIndex),
		);

		requestAnimationFrame(() => {
			ref.current?.highlightNth(0);
		});
	}, [
		scrollTop,
		itemsOutOfBounds,
		itemSpacing,
		itemWidth,
		itemHeight,
		ref,
		parsedChildren,
	]);
	function isFocused() {
		return root.current?.classList.contains("vlist-focused");
	}

	function getListElements(): [HTMLElement[], number] {
		const listElements = root.current
			? Array.from(
					root.current.querySelectorAll<HTMLElement>(".vlist-item"),
				)
			: [];
		const currentIndex = highlightedItem
			? listElements.indexOf(highlightedItem)
			: -1;
		return [listElements, currentIndex];
	}

	useImperativeHandle(ref, () => ({
		highlightNth(n: number) {
			const listElements = root.current
				? Array.from(
						root.current.querySelectorAll<HTMLElement>(
							".vlist-item",
						),
					)
				: [];

			if (listElements[n]) {
				highlightElement(listElements[n]);
			}
		},
		focus() {
			focusList(root.current);
		},
		blur() {
			root.current?.classList.remove("vlist-focused");
			focusedList = undefined;
		},
		highlightNextBelow() {
			const [listElements, currentIndex] = getListElements();

			if (currentIndex === -1) {
				highlightElement(listElements[0]);
			} else {
				highlightElement(
					listElements[
						(currentIndex + itemCountPerRow) % listElements.length
					],
				);
			}
		},
		highlightNextAbove() {
			const [listElements, currentIndex] = getListElements();

			if (currentIndex === -1) {
				highlightElement(listElements[0]);
			} else {
				let targetIndex = currentIndex - itemCountPerRow;
				if (targetIndex < 0) {
					targetIndex = listElements.length - 1;
				}
				highlightElement(listElements[targetIndex]);
			}
		},
		highlightNextLeft() {
			if (itemWidth === -1) {
				return;
			}
			const [listElements, currentIndex] = getListElements();

			if (currentIndex % itemCountPerRow === 0) {
				// border do nothing
				return;
			}
			if (currentIndex === -1) {
				highlightElement(listElements[0]);
			} else {
				highlightElement(
					listElements[(currentIndex - 1) % listElements.length],
				);
			}
		},
		highlightNextRight() {
			if (itemWidth === -1) {
				return;
			}
			const [listElements, currentIndex] = getListElements();
			if ((currentIndex + 1) % itemCountPerRow === 0) {
				// border do nothing
				return;
			}
			if (currentIndex === -1) {
				highlightElement(listElements[0]);
			} else {
				highlightElement(
					listElements[(currentIndex + 1) % listElements.length],
				);
			}
		},
		getHighlighted() {
			return highlightedItem;
		},
	}));

	function onScroll() {
		setScrollTop(root.current?.scrollTop || 0);
	}

	return (
		<ul
			className="vlist py-3 m-0 text-sm flex list-none h-full overflow-auto relative "
			ref={root}
			onScroll={onScroll}
		>
			<div ref={heightDiv}>
				{renderedChildren.map((child, index) => {
					const style: CSSProperties = {
						position: "absolute",
						top: `${Math.floor((startIndex + index) / itemCountPerRow) * realItemHeight}px`,
						height: `${itemHeight}px`,
						width: itemWidth === -1 ? "100%" : `${itemWidth}px`,
						left: `${((startIndex + index) % itemCountPerRow) * realItemWidth}px`,
					};
					return (
						<div style={style} key={index}>
							{child}
						</div>
					);
				})}
			</div>
		</ul>
	);
};

function onMouseOver(e: MouseEvent) {
	const composedPath = e.composedPath();
	let hoveredListElement: HTMLElement | undefined;
	let hoveredList: HTMLElement | undefined;
	for (const item of composedPath) {
		if (!(item instanceof HTMLElement)) {
			continue;
		}
		if (item.classList.contains("vlist-item")) {
			hoveredListElement = item;
		}
		if (item.classList.contains("vlist")) {
			hoveredList = item;
		}
	}
	if (hoveredListElement) {
		highlightElement(hoveredListElement);
	}
	if (hoveredList) {
		focusList(hoveredList);
	}
}

window.addEventListener("mouseover", onMouseOver);
window.addEventListener("evil-bob-mouse-over", (e) => {
	if ("detail" in e) {
		onMouseOver(e.detail as MouseEvent);
	}
});

export interface VListItemTileProps {
	children: ReactNode;
	className?: string;
	Actions?: FunctionComponent | undefined;
}

const VListItemTile = ({
	children,
	className,
	Actions,
}: VListItemTileProps) => {
	return (
		<li
			className={`${className} vlist-item vlist-item-tile rounded-lg border-2 border-solid border-transparent overflow-hidden flex flex-col items-start justify-start`}
		>
			{children}
		</li>
	);
};

export interface VListItemProps {
	children: ReactNode;
	onClick?: () => void;
	style?: CSSProperties;
	Actions?: FunctionComponent | undefined;
}
const VListItem = ({ children, onClick, style }: VListItemProps) => {
	return (
		<li
			className="vlist-item truncate text-base text-fg items-center flex  w-full m-0 py-1.5 px-2 rounded-sm list-none"
			onClick={onClick}
			style={style}
		>
			{children}
		</li>
	);
};

export { VList, VListItemTile, VListItem };
