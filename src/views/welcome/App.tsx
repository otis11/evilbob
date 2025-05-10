import { Button } from "@/components/ui/button.tsx";
import { ACTION_KEY, keysAsString } from "@/lib/keybindings.ts";
import { ExternalLinkIcon } from "lucide-react";

export default function App() {
	async function onPluginsClick() {
		await chrome.runtime.sendMessage({ event: "open-plugins" });
	}

	return (
		<>
			<img
				alt="Evilbob Logo"
				src="https://raw.githubusercontent.com/otis11/evilbob/refs/heads/main/src/media/evilbob-icon-128x128.png"
			/>
			<p className="text-2xl flex items-center gap-1">
				To open me press
				{keysAsString([ACTION_KEY, "Shift", "L"]).map((key) => (
					<span key={key} className="font-bold tracking-widest">
						{key}
					</span>
				))}
			</p>
			<Button onClick={onPluginsClick}>
				<span className="mr-2">Choose Your Plugins</span>
				<ExternalLinkIcon></ExternalLinkIcon>
			</Button>
			<p className="pt-8">
				If the shortcut is not working, set the shortcut yourself.
				<h3 className="pt-2 font-bold">Chrome</h3>
				<ol>
					<li>
						Type <kbd>chrome://extensions/shortcuts</kbd> into your
						search bar.
					</li>
					<li>Set the shortcut for "Open Evilbob"</li>
				</ol>
				<h3 className="pt-2 font-bold">Firefox</h3>
				<ol>
					<li>
						Type <kbd>about:addons</kbd> into your search bar.
					</li>
					<li>Click on the right cog wheel</li>
					<li>Click on "Manage Extension Shortcuts"</li>
					<li>Set the shortcut for "Open Evilbob"</li>
				</ol>
				<h3 className="pt-2 font-bold">Edge</h3>
				<ol>
					<li>
						Type <kbd>edge://extensions/shortcuts</kbd> into your
						search bar.
					</li>
					<li>Set the shortcut for "Open Evilbob"</li>
				</ol>
			</p>
		</>
	);
}
