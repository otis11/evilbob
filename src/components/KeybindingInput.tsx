import { Input } from "@/components/ui/input.tsx";
import { normalizeKey } from "@/lib/utils";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

export function KeybindingInput({
	keys,
	onKeydownTimeout,
	className,
}: {
	keys: string[];
	className: string;
	onKeydownTimeout?: (keys: string[]) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [keysWerePressed, setKeysWerePressed] = useState<
		Record<string, boolean>
	>({});

	useEffect(() => {
		const originalKeys: Record<string, boolean> = {};
		for (const key of keys) {
			originalKeys[normalizeKey(key)] = true;
		}
		setKeysWerePressed({ ...originalKeys });
	}, [keys]);

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		event.preventDefault();

		setTimeout(() => {
			onKeydownTimeout?.(Object.keys(keysWerePressed));
			setKeysWerePressed({});
		}, 800);

		keysWerePressed[normalizeKey(event.key)] = true;
		setKeysWerePressed({ ...keysWerePressed });
	}

	return (
		<div className={`relative w-full h-9 ${className ? className : ""}`}>
			<Input
				onFocus={() => setKeysWerePressed({})}
				className="left-0 right-0 top-0 bottom-0 absolute"
				onKeyDown={onKeyDown}
				type="text"
				autoCorrect="off"
				autoComplete="off"
				autoCapitalize="none"
				ref={inputRef}
			/>
			<div className="px-4 flex items-center gap-4 text-xs tracking-widest text-muted-foreground absolute left-0 right-0 bottom-0 top-0 pointer-events-none">
				{Object.keys(keysWerePressed).map((key: string) => (
					<kbd key={key}>{key}</kbd>
				))}
			</div>
		</div>
	);
}
