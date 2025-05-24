import { KeyboardListener } from "@/lib/keyboard-listener.ts";
import { memoryStore } from "@/lib/memory-store.ts";
import { CircleHelpIcon } from "lucide-react";
import {
	type CSSProperties,
	type FocusEvent,
	type JSX,
	type MouseEvent,
	type ReactNode,
	isValidElement,
	useEffect,
	useRef,
	useState,
} from "react";
import { getConfig } from "../lib/config.ts";
import { EvilbobRoot } from "../lib/evilbob-root.tsx";

interface VListProps<T> {
	children: ReactNode;
	itemHeight?: number;
	surroundingItems?: number;
	itemWidth?: number;
	itemsOutOfBounds?: number;
	itemSpacing?: {
		x: number;
		y: number;
	};
	// biome-ignore lint/suspicious/noExplicitAny: Can be any but can probably be improved via generic types?
	onSelect?: (item: any) => void;
	activeElementTarget?: Document | ShadowRoot;
}

let lastMousePosition = { x: 0, y: 0 };
function onMouseOver(event: Event) {
	if (event instanceof MouseEvent) {
		lastMousePosition = { x: event.clientX, y: event.clientY };
	}
}
window.addEventListener("mouseover", onMouseOver);

const VList = <T,>({
	children,
	surroundingItems = 1,
	itemHeight = 40,
	itemWidth = -1,
	itemsOutOfBounds,
	itemSpacing,
	onSelect,
	activeElementTarget = EvilbobRoot.instance().shadowRoot,
	...props
}: VListProps<T>) => {
	const [renderedChildren, setRenderedChildren] = useState<JSX.Element[]>([]);
	const listRoot = useRef<HTMLUListElement>(null);
	const heightDiv = useRef<HTMLDivElement>(null);
	const [startIndex, setStartIndex] = useState(0);
	const [realItemHeight, setRealItemHeight] = useState(0);
	const [realItemWidth, setRealItemWidth] = useState(0);
	const [itemCountPerRow, setItemCountPerRow] = useState(0);
	const [scrollTop, setScrollTop] = useState(
		listRoot.current?.scrollTop || 0,
	);
	const [activeIndex, setActiveIndex] = useState(0);
	const [parsedChildren, setParsedChildren] = useState<JSX.Element[]>([]);
	const [availHeight, setAvailHeight] = useState<number>(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies : should not update if parsedChildren.length, itself sets it
	useEffect(() => {
		let newChildren: JSX.Element[] = [];
		if (Array.isArray(children)) {
			newChildren = children.filter((c) => isValidElement(c));
		} else if (isValidElement(children)) {
			newChildren = [children];
		} else {
			newChildren = [];
		}

		const isSameChildrenLength =
			newChildren.length === parsedChildren.length;
		setParsedChildren(newChildren);
		if (!isSameChildrenLength) {
			requestAnimationFrame(() => {
				if (
					!activeElementTarget.activeElement?.hasAttribute(
						"data-vlist-stay-focused",
					)
				) {
					listRoot.current?.focus();
				}
				highlightNth(0);
			});
		}
	}, [children]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore for now, as it should only run once to register keybord listeners
	useEffect(() => {
		// to fix a race condition if the getConfig promise takes longer than a rerender of the component
		let isMounted = true;
		if (!listRoot.current) {
			return;
		}
		const keyboardListener = new KeyboardListener([
			listRoot.current,
			activeElementTarget.querySelector<HTMLElement>(
				"[data-vlist-stay-focused]",
			),
		]);
		getConfig().then((config) => {
			if (!isMounted) return;
			keyboardListener.register(
				config.keybindings.nextAbove.keys,
				highlightNextAbove,
			);
			keyboardListener.register(
				config.keybindings.nextBelow.keys,
				highlightNextBelow,
			);
			keyboardListener.register(
				config.keybindings.nextLeft.keys,
				highlightNextLeft,
			);
			keyboardListener.register(
				config.keybindings.nextRight.keys,
				highlightNextRight,
			);
			keyboardListener.register(
				config.keybindings.selectResult.keys,
				() => onClick(parsedChildren[activeIndex]),
			);
		});
		const newActions = parsedChildren[activeIndex]?.props?.actions;
		if (newActions) {
			memoryStore.set("actions", newActions);
		}

		return () => {
			isMounted = false;
			keyboardListener.destroy();
		};
	}, [activeIndex, itemCountPerRow, parsedChildren]);

	function updateScrollTopSurroundingItems(index: number) {
		setTimeout(() => {
			const start = scrollTop + surroundingItems * realItemHeight;
			const end =
				scrollTop + availHeight - surroundingItems * realItemHeight;
			const item = realItemHeight * Math.floor(index / itemCountPerRow);
			/*
                |   - start
                |
                |   - item
                |
                |   - end
             */
			if (item > end) {
				const newScrollTop = scrollTop + realItemHeight;
				if (listRoot.current) {
					listRoot.current.scrollTop = newScrollTop;
				}
				setScrollTop(newScrollTop);
			}
			if (item < start) {
				const newScrollTop = scrollTop - realItemHeight;
				if (listRoot.current) {
					listRoot.current.scrollTop = newScrollTop;
				}
				setScrollTop(newScrollTop);
			}
		}, 0);
	}

	useEffect(() => {
		let isMounted = true;

		const localRealItemWidth = itemWidth + (itemSpacing?.x || 0);
		const localRealItemHeight = itemHeight + (itemSpacing?.x || 0);

		const availWidth = listRoot.current?.getBoundingClientRect().width || 0;
		const localItemCountPerRow =
			itemWidth === -1 ? 1 : Math.floor(availWidth / localRealItemWidth);
		const totalRowCount = Math.ceil(
			parsedChildren.length / localItemCountPerRow,
		);

		if (listRoot.current) {
			listRoot.current.style.position = "relative";
		}
		if (heightDiv.current) {
			heightDiv.current.style.width = "100%";
			heightDiv.current.style.height = `${localRealItemHeight * totalRowCount}px`;
		}

		// wait after first render, heightDiv gets calculated height which sometimes can change availHeight
		requestAnimationFrame(() => {
			if (!isMounted) return; // rerender happening

			const localAvailHeight =
				listRoot.current?.getBoundingClientRect().height || 0;
			const availWidth =
				listRoot.current?.getBoundingClientRect().width || 0;
			const localItemCountPerRow =
				itemWidth === -1
					? 1
					: Math.floor(availWidth / localRealItemWidth);
			const totalRowCount = Math.ceil(
				parsedChildren.length / localItemCountPerRow,
			);

			const outOfBounds = (itemsOutOfBounds || 3) * localItemCountPerRow;
			const localStartIndex = Math.max(
				Math.ceil(scrollTop / localRealItemHeight) *
					localItemCountPerRow -
					outOfBounds,
				0,
			);
			const localEndIndex = Math.min(
				localStartIndex +
					Math.ceil(localAvailHeight / localRealItemHeight) *
						localItemCountPerRow +
					outOfBounds,
				totalRowCount * localItemCountPerRow,
			);

			setAvailHeight(localAvailHeight);
			setStartIndex(localStartIndex);
			setRealItemHeight(localRealItemHeight);
			setRealItemWidth(localRealItemWidth);
			setItemCountPerRow(localItemCountPerRow);
			setRenderedChildren(
				parsedChildren.slice(localStartIndex, localEndIndex),
			);
		});

		return () => {
			isMounted = false;
		};
	}, [
		scrollTop,
		itemsOutOfBounds,
		itemSpacing,
		itemWidth,
		itemHeight,
		parsedChildren,
	]);

	function highlightNth(n: number) {
		setActiveIndex(n);
	}
	function highlightNextBelow() {
		if (activeIndex === -1) {
			setActiveIndex(0);
		} else {
			if (activeIndex + itemCountPerRow >= parsedChildren.length) {
				// border do nothing
				return;
			}
			const newIndex =
				(activeIndex + itemCountPerRow) % parsedChildren.length;
			setActiveIndex(newIndex);
			updateScrollTopSurroundingItems(newIndex);
		}
	}
	function highlightNextAbove() {
		if (activeIndex === -1) {
			setActiveIndex(0);
		} else {
			let targetIndex = activeIndex - itemCountPerRow;
			if (targetIndex < 0) {
				// border do nothing
				return;
			}
			if (targetIndex < 0) {
				targetIndex = parsedChildren.length - 1;
			}
			setActiveIndex(targetIndex);
			updateScrollTopSurroundingItems(targetIndex);
		}
	}
	function highlightNextLeft() {
		if (itemWidth === -1) {
			return;
		}
		if (activeIndex % itemCountPerRow === 0) {
			// border do nothing
			return;
		}
		if (activeIndex === -1) {
			setActiveIndex(0);
		} else {
			setActiveIndex((activeIndex - 1) % parsedChildren.length);
		}
	}
	function highlightNextRight() {
		if (itemWidth === -1) {
			return;
		}
		if ((activeIndex + 1) % itemCountPerRow === 0) {
			// border do nothing
			return;
		}
		if (activeIndex === -1) {
			setActiveIndex(0);
		} else {
			setActiveIndex((activeIndex + 1) % parsedChildren.length);
		}
	}

	function onScroll() {
		setScrollTop(listRoot.current?.scrollTop || 0);
	}

	function onChildMouseOver(event: MouseEvent, child: JSX.Element) {
		// make sure the mouse was moved to another position
		// opening actions and closing them would cause a new mouse event
		// this fixes that a new mouse event on the same position does not select the element while the mouse was not moved
		if (
			lastMousePosition.x !== event.clientX ||
			lastMousePosition.y !== event.clientY
		) {
			const childIndex = parsedChildren.findIndex(
				(c) => c.key === child.key,
			);
			setActiveIndex(childIndex);
		}
	}

	function onChildFocus(
		event: FocusEvent<HTMLLIElement>,
		child: JSX.Element,
	) {
		const childIndex = parsedChildren.findIndex((c) => c.key === child.key);
		setActiveIndex(childIndex);
	}

	function onClick(child?: JSX.Element) {
		window.dispatchEvent(new CustomEvent("evilbob-vlist-click"));
		onSelect?.(child?.props.data);
		setTimeout(() => {
			listRoot.current?.focus();
		}, 5);
		if (typeof child?.props.onClick === "function") {
			child.props.onClick();
		}
	}

	return (
		<ul
			// biome-ignore lint/a11y/noNoninteractiveTabindex: this one is interactive
			tabIndex={0}
			className="vlist m-0 text-sm flex list-none h-full overflow-auto relative "
			ref={listRoot}
			onScroll={onScroll}
			{...props}
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
						// biome-ignore lint/a11y/useKeyWithClickEvents: they key listener for keyboard events is registered in the root of the list
						<li
							// biome-ignore lint/a11y/noNoninteractiveTabindex: this one is interactive
							tabIndex={0}
							onClick={() => onClick(child)}
							onMouseOver={(event) =>
								onChildMouseOver(event, child)
							}
							onFocus={(event) => onChildFocus(event, child)}
							style={style}
							className={`${
								activeIndex === startIndex + index
									? "vlist-item-active"
									: ""
							}`}
							key={child.key}
						>
							{child}
						</li>
					);
				})}
			</div>
		</ul>
	);
};

export interface VListItemTileProps {
	children: ReactNode;
	className?: string;
	actions?: JSX.Element | undefined;
	// biome-ignore lint/suspicious/noExplicitAny: Can be any but can probably be improved via generic types?
	data?: any;
	onClick?: () => void;
}

const VListItemTile = ({
	children,
	className,
	actions,
	data,
	onClick,
	...props
}: VListItemTileProps) => {
	return (
		<div
			className={`${className ? className : ""} vlist-item-tile border border-solid border-transparent rounded-sm h-full w-full overflow-hidden flex flex-col items-start justify-start`}
			{...props}
		>
			{children}
		</div>
	);
};

export interface VListItemProps {
	children: ReactNode;
	onClick?: () => void;
	actions?: JSX.Element | undefined;
	// biome-ignore lint/suspicious/noExplicitAny: Can be any but can probably be improved via generic types?
	data?: any;
	className?: string;
}
const VListItem = ({
	className,
	children,
	onClick,
	data,
	actions,
	...props
}: VListItemProps) => {
	return (
		<div
			className={`${className ? className : ""} vlist-item rounded-sm overflow-hidden truncate text-base text-fg items-center flex h-full w-full m-0 py-1.5 px-2 list-none`}
			{...props}
		>
			{children}
		</div>
	);
};
export interface VListItemIconProps {
	url?: string;
	children?: ReactNode;
}
const VListItemIcon = ({ url, children }: VListItemIconProps) => {
	const [error, setError] = useState(false);

	return (
		<span className="pr-2 flex items-center shrink-0">
			{error ? (
				<CircleHelpIcon></CircleHelpIcon>
			) : url ? (
				<img
					onError={() => setError(true)}
					className="h-6 w-6 object-contain overflow-hidden"
					src={url}
					alt={url}
				/>
			) : (
				children
			)}
		</span>
	);
};

export { VList, VListItemTile, VListItem, VListItemIcon };
