import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { EvilbobRoot } from "../lib/evilbob-root.tsx";

export interface NumberSelectProps {
	values: number[] | { value: number; label: string }[];
	onValueChange?: (value: number) => void;
	value: number | string;
}
export function NumberSelect({
	values,
	onValueChange,
	value,
}: NumberSelectProps) {
	return (
		<Select
			value={value.toString()}
			onValueChange={(e) => onValueChange?.(Number.parseInt(e))}
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
					EvilbobRoot.instance().dialogElement || document.body
				}
			>
				{values.map((value, index) => (
					<SelectItem
						key={typeof value === "number" ? value : value.value}
						value={
							typeof value === "number"
								? value.toString()
								: value.value.toString()
						}
					>
						{typeof value === "number" ? value : value.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
