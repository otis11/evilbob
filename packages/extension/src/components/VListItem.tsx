import type { CSSProperties, ReactNode } from "react";

export interface VListItemProps {
	children: ReactNode;
	onClick?: () => void;
	style?: CSSProperties;
}
export const VListItem = ({ children, onClick, style }: VListItemProps) => {
	return (
		<li
			className="vlist-item truncate text-base text-fg items-center flex  w-full m-0 p-2 rounded-lg list-none"
			onClick={onClick}
			style={style}
		>
			{children}
		</li>
	);
};
