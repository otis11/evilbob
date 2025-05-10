import { Input } from "@/components/ui/input.tsx";
import { normalizeKey } from "@/lib/utils";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

export function KeybindingInput({
	keys,
	onAllKeysUp,
	className,
}: {
	keys: string[];
	className: string;
	onAllKeysUp?: (keys: string[]) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [keysPressedDownLive, setKeysPressedDownLive] = useState<
		Record<string, boolean>
	>({});
	const [keysPressedDown, setKeysPressedDown] = useState<
		Record<string, boolean>
	>({});

	useEffect(() => {
		const newKeys: Record<string, boolean> = {};
		for (const key of keys) {
			newKeys[normalizeKey(key)] = true;
		}
		setKeysPressedDownLive({ ...newKeys });
	}, [keys]);

	function onKeyUp(event: KeyboardEvent<HTMLInputElement>) {
		// this only needs to be tracked because of macOS and the Meta key. The Meta key does not trigger a keyup event for keys while its pressed.
		// if key not held down emulate the key up event for that specific key.
		// this is not perfect, as holding multiple keys down at once triggers only 1 keydown event for the last key pressed.
		// https://github.com/electron/electron/issues/5188
		if (event.key === "Meta") {
			onAllKeysUp?.(Object.keys(keysPressedDown));
			setKeysPressedDownLive({});
			return;
		}
		delete keysPressedDownLive[event.key];
		if (Object.keys(keysPressedDownLive).length === 0) {
			onAllKeysUp?.(Object.keys(keysPressedDown));
		}
		setKeysPressedDownLive({ ...keysPressedDownLive });
	}

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		event.preventDefault();
		keysPressedDownLive[normalizeKey(event.key)] = true;
		setKeysPressedDownLive({ ...keysPressedDownLive });
		setKeysPressedDown({ ...keysPressedDownLive });
	}

	return (
		<div className={`relative w-full h-9 ${className ? className : ""}`}>
			<Input
				onFocus={() => setKeysPressedDownLive({})}
				className="left-0 right-0 top-0 bottom-0 absolute"
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				type="text"
				autoCorrect="off"
				autoComplete="off"
				autoCapitalize="none"
				ref={inputRef}
			/>
			<div className="px-4 flex items-center gap-4 text-xs tracking-widest text-muted-foreground absolute left-0 right-0 bottom-0 top-0 pointer-events-none">
				{Object.keys(keysPressedDownLive).map((key: string) => (
					<kbd key={key}>{key}</kbd>
				))}
			</div>
		</div>
	);
}
