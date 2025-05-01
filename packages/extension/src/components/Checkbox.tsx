import type { ChangeEventHandler, ReactNode } from "react";

export interface CheckboxProps {
	className?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	value?: string;
	children?: ReactNode;
	checked?: boolean;
}

export function Checkbox({
	className,
	onChange,
	value,
	children,
	checked,
}: CheckboxProps) {
	return (
		<label className={`${className} flex items-center gap-2`}>
			<input
				value={value}
				type="checkbox"
				checked={checked}
				onChange={onChange}
			/>
			{children}
		</label>
	);
}
