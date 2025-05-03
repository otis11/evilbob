import { KeyboardListener } from "@/lib/utils.ts";
import {
	type CSSProperties,
	type JSX,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { getConfig } from "../lib/config.ts";
import { EvilBob } from "./EvilBob.tsx";

interface VListProps<T> {
	children: ReactNode;
	itemHeight: number;
	itemWidth: number;
	itemsOutOfBounds?: number;
	itemSpacing?: {
		x: number;
		y: number;
	};
	keyboardListenerTarget?: Window | Document | HTMLElement;
	// biome-ignore lint/suspicious/noExplicitAny: Can be any but can probably be improved via generic types?
	onSelect?: (item: any) => void;
}

const VList = <T,>({
	children,
	itemHeight,
	itemWidth,
	itemsOutOfBounds,
	itemSpacing,
	keyboardListenerTarget,
	onSelect,
}: VListProps<T>) => {
	const [renderedChildren, setRenderedChildren] = useState<JSX.Element[]>([]);
	const root = useRef<HTMLUListElement>(null);
	const heightDiv = useRef<HTMLDivElement>(null);
	const [startIndex, setStartIndex] = useState(0);
	const [realItemHeight, setRealItemHeight] = useState(0);
	const [realItemWidth, setRealItemWidth] = useState(0);
	const [itemCountPerRow, setItemCountPerRow] = useState(0);
	const [scrollTop, setScrollTop] = useState(root.current?.scrollTop || 0);
	const [activeIndex, setActiveIndex] = useState(0);
	const parsedChildren = Array.isArray(children) ? children : [];

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore for now, as it should only run once to register keybord listeners
	useEffect(() => {
		const keyboardListener = new KeyboardListener(
			keyboardListenerTarget || EvilBob.instance().shadowRoot,
		);
		getConfig().then((config) => {
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
				() => onSelect?.(parsedChildren[activeIndex]?.props.data),
			);
		});
		EvilBob.instance().setActiveVListItemProps(
			parsedChildren[activeIndex]?.props,
		);
		return () => keyboardListener.destroy();
	}, [activeIndex, itemCountPerRow, parsedChildren]);
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
			highlightNth(0);
		});
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
			setActiveIndex(
				(activeIndex + itemCountPerRow) % parsedChildren.length,
			);
		}
	}
	function highlightNextAbove() {
		if (activeIndex === -1) {
			setActiveIndex(0);
		} else {
			let targetIndex = activeIndex - itemCountPerRow;
			if (targetIndex < 0) {
				targetIndex = parsedChildren.length - 1;
			}
			setActiveIndex(targetIndex);
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
		setScrollTop(root.current?.scrollTop || 0);
	}

	function onChildMouseOver(index: number) {
		setActiveIndex(index);
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
						<div
							onClick={() =>
								onSelect?.(parsedChildren[index].props.data)
							}
							onMouseOver={() => onChildMouseOver(index)}
							onFocus={() => onChildMouseOver(index)}
							style={style}
							className={
								activeIndex === index
									? "!bg-accent"
									: "!border-ring"
							}
							key={index}
						>
							{child}
						</div>
					);
				})}
			</div>
		</ul>
	);
};

export interface VListItemTileProps {
	children: ReactNode;
	className?: string;
	Actions?: JSX.Element | undefined;
	// biome-ignore lint/suspicious/noExplicitAny: Can be any but can probably be improved via generic types?
	data?: any;
}

const VListItemTile = ({
	children,
	className,
	Actions,
	data,
}: VListItemTileProps) => {
	return (
		<li
			className={`${className} h-full w-full rounded-lg border-2 border-solid border-transparent overflow-hidden flex flex-col items-start justify-start`}
		>
			{children}
		</li>
	);
};

export interface VListItemProps {
	children: ReactNode;
	onClick?: () => void;
	Actions?: JSX.Element | undefined;
	// biome-ignore lint/suspicious/noExplicitAny: Can be any but can probably be improved via generic types?
	data?: any;
}
const VListItem = ({ children, onClick, data, Actions }: VListItemProps) => {
	return (
		<li
			className="truncate text-base text-fg items-center flex h-full w-full m-0 py-1.5 px-2 rounded-sm list-none"
			onClick={onClick}
		>
			{children}
		</li>
	);
};

export { VList, VListItemTile, VListItem };
