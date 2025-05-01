import type { ChangeEventHandler, ReactNode } from "react";

export interface SelectProps {
	children: ReactNode;

	className?: string;
	onChange?: ChangeEventHandler<HTMLSelectElement>;
}
const Select = ({ className, children, onChange }: SelectProps) => {
	return (
		<select className={className} onChange={onChange}>
			{children}
		</select>
	);
};

interface SelectItemProps {
	value: string;
	className?: string;
	children?: ReactNode;
}
Select.Item = ({ className, value, children }: SelectItemProps) => {
	return (
		<option className={className} value={value}>
			{children}
		</option>
	);
};
export { Select };
