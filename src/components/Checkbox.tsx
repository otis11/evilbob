import { CheckboxOnly } from "@/components/ui/checkbox.tsx";
import type { Root } from "@radix-ui/react-checkbox";
import { type ComponentProps, useState } from "react";

let checkboxIdCounter = 0;
export function Checkbox({
	children,
	className,
	...props
}: ComponentProps<typeof Root>) {
	const [checkboxId, setCheckboxId] = useState(checkboxIdCounter++);
	return (
		<div className="flex items-center space-x-2">
			<CheckboxOnly id={checkboxId.toString()} {...props} />
			<label
				htmlFor={checkboxId.toString()}
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{children}
			</label>
		</div>
	);
}
