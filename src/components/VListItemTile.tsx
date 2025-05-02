import type { CSSProperties, ReactNode } from "react";

export interface VListItemTileProps {
	children: ReactNode;
	title?: string;
	style?: CSSProperties;
	className?: string;
}

export const VListItemTile = ({
	children,
	title,
	className,
	style,
}: VListItemTileProps) => {
	return (
		<li
			className={`${className} vlist-item vlist-item-tile rounded-lg border-2 border-solid border-transparent overflow-hidden flex flex-col items-start justify-start`}
			style={style}
		>
			{children}
		</li>
	);
};
