import type { PluginCommandExtended } from "@evil-bob/plugins/src/types.ts";
import { useRef } from "react";
import { VList, type VListChildProps, type VListRef } from "./VList.tsx";
export interface CommandListProps {
	onCommandClick?: (item: PluginCommandExtended) => void;
	commands: PluginCommandExtended[];
}
export function CommandList({ onCommandClick, commands }: CommandListProps) {
	const listRef = useRef<VListRef>(null);
	return (
		<VList ref={listRef} items={commands} itemHeight={32} itemWidth={-1}>
			{({
				item,
				index,
				style,
			}: VListChildProps<PluginCommandExtended>) => {
				return (
					<VList.Item
						style={style}
						key={index}
						onClick={() => onCommandClick?.(item)}
					>
						<span>{item.title}</span>
						<span className="text-fg-weak text-sm pl-4">
							{item.plugin?.title}
						</span>
						{item.type === "command" ? (
							<div className="ml-auto text-fg-weak text-sm">
								Command
							</div>
						) : (
							<div className="ml-auto text-fg-weak text-sm">
								View
							</div>
						)}
					</VList.Item>
				);
			}}
		</VList>
	);
}
