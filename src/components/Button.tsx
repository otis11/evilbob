import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { EllipsisLoader } from "./EllipsisLoader.tsx";

export interface ButtonProps {
	children?: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	style?: CSSProperties;
	variant?: ButtonVariant;
	className?: string;
	loading?: boolean;
}

export type ButtonVariant = "default" | "success" | "accent";

const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
	accent: "bg-accent text-bg",
	success: "text-fg bg-success",
	default: "text-bg bg-fg",
};
const Button = ({
	children,
	onClick,
	style,
	variant,
	loading,
	className,
}: ButtonProps) => {
	return (
		<button
			type="button"
			style={style}
			onClick={onClick}
			className={`${BUTTON_VARIANT_CLASSES[variant || "default"]} ${className} rounded-lg p-input min-h-input border border-fg-weakest flex items-center cursor-pointer justify-center`}
		>
			{loading ? <EllipsisLoader></EllipsisLoader> : children}
		</button>
	);
};
export { Button };
