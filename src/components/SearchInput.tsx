import type { ChangeEvent, Ref } from "react";

export interface onSearchInputChangeProps {
	value: string;
}

export interface SearchInputProps {
	onChange?: (data: onSearchInputChangeProps) => void;
	ref?: Ref<HTMLInputElement> | undefined;
	value?: string;
}

const SearchInput = ({ onChange, ref, value }: SearchInputProps) => {
	function onInputChange(event: ChangeEvent<HTMLInputElement>) {
		onChange?.({ value: event.target.value });
	}
	return (
		<div className="overflow-hidden border border-solid border-fg-weakest rounded-2xl w-full ">
			<input
				className="text-xl w-full  p-input text-fg min-h-input bg-bg border-none outline-none"
				ref={ref}
				autoComplete="off"
				onChange={onInputChange}
				type="text"
				value={value}
			/>
		</div>
	);
};

export { SearchInput };
