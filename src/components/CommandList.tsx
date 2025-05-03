import type { PluginCommandExtended } from "@/plugins";
import { VList, VListItem } from "./VList.tsx";
export interface CommandListProps {
	commands: PluginCommandExtended[];
	// biome-ignore lint/suspicious/noExplicitAny: Can be any but can probably be improved via generic types?
	onSelect: (item: any) => void;
}
export function CommandList({ commands, onSelect }: CommandListProps) {
	return (
		<VList itemHeight={32} itemWidth={-1} onSelect={onSelect}>
			{commands.map((command) => (
				<VListItem data={command} key={command.name}>
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
