import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { EvilBob } from "./EvilBob";

export interface NumberSelectProps {
	values: number[];
	onValueChange?: (value: number) => void;
	value: number;
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
				container={EvilBob.instance().dialogElement || document.body}
			>
				{values.map((value, index) => (
					<SelectItem key={value} value={value.toString()}>
						{value}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
