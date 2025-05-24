import { ActionsBoxTop } from "@/components/ActionsBoxTop.tsx";
import { Input } from "@/components/ui/input.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { keysAsString } from "@/lib/keybindings.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import {
	ArrowLeft,
	Loader2,
	Maximize2,
	Minimize2,
	SettingsIcon,
} from "lucide-react";
import { type ChangeEvent, type KeyboardEvent, useEffect, useRef } from "react";
import { EvilbobRoot } from "../lib/evilbob-root.tsx";

export function MainTopBar() {
	const [isFullscreen, setIsFullscreen] = useMemoryStore("isFullscreen");
	const inputRef = useRef<HTMLInputElement>(null);
	const [pluginViewCommand, setPluginViewCommand] =
		useMemoryStore("pluginViewCommand");
	const [isCommandExecuting, setIsCommandExecuting] =
		useMemoryStore("isCommandExecuting");
	const [search, setSearch] = useMemoryStore("search");
	const [actions, setActions] = useMemoryStore("actions");
	const [config, setConfig] = useMemoryStore("config");
	const [searchHint, setSearchHint] = useMemoryStore("searchHint");
	const [isActionsOpen, setIsActionsOpen] = useMemoryStore("isActionsOpen");

	useEffect(() => {
		function onWindowFocus() {
			// 10ms delay to wait for any website focus redirects
			setTimeout(() => {
				inputRef.current?.focus();
				inputRef.current?.select();
			}, 10);
		}
		window.addEventListener("focus", onWindowFocus);
		window.addEventListener("focusin", onWindowFocus);
		return () => {
			window.removeEventListener("focus", onWindowFocus);
			window.removeEventListener("focusin", onWindowFocus);
		};
	}, []);

	useEffect(() => {
		if (!isCommandExecuting) {
			// 10ms delay to wait for any website focus redirects
			setTimeout(() => {
				inputRef.current?.focus();
				inputRef.current?.select();
			}, 10);
		}
	}, [isCommandExecuting]);

	function onChange(data: ChangeEvent<HTMLInputElement>) {
		setSearch(data.target.value);
	}

	useEffect(() => {
		if (!pluginViewCommand || !isActionsOpen) {
			// 10ms delay to wait for any website focus redirects
			setTimeout(() => {
				inputRef.current?.focus();
				inputRef.current?.select();
			}, 10);
		}
	}, [pluginViewCommand, isActionsOpen]);

	async function onSettingsClick() {
		await browserApi.runtime.openOptionsPage();
	}

	function onBack() {
		EvilbobRoot.instance().unmountPluginView();
	}

	function onKeyUp(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			for (const callback of EvilbobRoot.instance()
				.onSearchEnterCallbacks) {
				callback(event);
			}
		}
		for (const callback of EvilbobRoot.instance().onSearchKeyUpCallbacks) {
			callback(event);
		}
	}

	return (
		<>
			<div className="flex items-center gap-3">
				{isCommandExecuting ? (
					<Loader2 className="animate-spin" size={20} />
				) : (
					<ArrowLeft
						data-testid="back"
						onClick={onBack}
						size={20}
						className={
							pluginViewCommand
								? ""
								: "pointer-events-none opacity-50"
						}
					></ArrowLeft>
				)}

				<Input
					data-testid="search-input"
					autoCapitalize="off"
					autoCorrect="off"
					autoComplete="off"
					data-vlist-stay-focused
					id="evilbob-search-input"
					className="h-12 !text-lg"
					ref={inputRef}
					onChange={onChange}
					onKeyUp={onKeyUp}
					value={search}
				></Input>
				{isFullscreen ? (
					<Minimize2
						onClick={() => setIsFullscreen(false)}
						size={20}
					></Minimize2>
				) : (
					<Maximize2
						onClick={() => setIsFullscreen(true)}
						size={20}
					></Maximize2>
				)}
				<SettingsIcon
					size={20}
					onClick={onSettingsClick}
				></SettingsIcon>
			</div>
			<div className="h-8 min-h-8 flex items-center justify-center relative">
				<div className="text-xs tracking-widest text-muted-foreground flex items-center gap-1 absolute left-0 top-2">
					{pluginViewCommand ? (
						<>
							Go Back{" "}
							{keysAsString(
								config?.keybindings.closePluginView?.keys,
							).map((key) => (
								<span key={key}>{key}</span>
							))}
						</>
					) : (
						""
					)}
				</div>
				<div className="text-sm text-muted-foreground">
					{searchHint}
				</div>
				<span className="absolute right-0 top-2">
					<ActionsBoxTop>{actions}</ActionsBoxTop>
				</span>
			</div>
		</>
	);
}
