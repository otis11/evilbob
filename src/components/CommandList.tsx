import type { PluginCommandExtended } from "@/plugins";
import {
	VList,
	VListItem,
	VListItemIcon,
	VListItemText,
	VListItemTitle,
} from "./VList.tsx";
export interface CommandListProps {
	commands: PluginCommandExtended[];
	// biome-ignore lint/suspicious/noExplicitAny: Can be any but can probably be improved via generic types?
	onSelect: (item: any) => void;
}
export function CommandList({ commands, onSelect }: CommandListProps) {
	return (
		<VList data-testid="command-list" onSelect={onSelect}>
			{commands.map((command) => (
				<VListItem
					data={command}
					key={command.name}
					data-testid={`command-${command.plugin.id}-${command.name}`}
				>
					<VListItemIcon>{command.plugin.icon}</VListItemIcon>
					<VListItemTitle>{command.title}</VListItemTitle>
					<VListItemText>{command.plugin?.title}</VListItemText>
					{command.type === "command" ? (
						<VListItemText className="ml-auto">
							Command
						</VListItemText>
					) : (
						<VListItemText className="ml-auto">View</VListItemText>
					)}
				</VListItem>
			))}
		</VList>
	);
}
