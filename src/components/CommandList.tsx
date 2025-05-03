import type { PluginCommandExtended } from "@/plugins";
import { useRef } from "react";
import { VList, VListItem, type VListRef } from "./VList.tsx";
export interface CommandListProps {
	onCommandClick?: (item: PluginCommandExtended) => void;
	commands: PluginCommandExtended[];
}
export function CommandList({ onCommandClick, commands }: CommandListProps) {
	const listRef = useRef<VListRef>(null);
	return (
		<VList ref={listRef} itemHeight={32} itemWidth={-1}>
			{commands.map((command) => (
				<VListItem
					key={command.name}
					onClick={() => onCommandClick?.(command)}
				>
					<span>{command.title}</span>
					<span className="text-fg-weak text-sm pl-4">
						{command.plugin?.title}
					</span>
					{command.type === "command" ? (
						<span className="ml-auto text-fg-weak text-sm">
							Command
						</span>
					) : (
						<span className="ml-auto text-fg-weak text-sm">
							View
						</span>
					)}
				</VListItem>
			))}
		</VList>
	);
}
