import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { EvilbobRoot } from "../lib/evilbob-root.tsx";

export interface TextSelectProps {
	values: string[] | { value: string; label: string }[];
	onValueChange?: (value: string) => void;
	value: number | string;
	container?: HTMLElement | ShadowRoot;
}
export function TextSelect({
	values,
	onValueChange,
	value,
	container,
}: TextSelectProps) {
	return (
		<Select
			value={value.toString()}
			onValueChange={(e) => onValueChange?.(e)}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Theme" />
			</SelectTrigger>
			<SelectContent
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				onKeyDown={(e) => {
					e.stopPropagation();
				}}
				container={
					container ||
					EvilbobRoot.instance().dialogElement ||
					document.body
				}
			>
				{values.map((value, index) => (
					<SelectItem
						key={typeof value === "string" ? value : value.value}
						value={typeof value === "string" ? value : value.value}
					>
						{typeof value === "string" ? value : value.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
