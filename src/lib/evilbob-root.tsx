import { toast } from "@/components/Toast.tsx";
import { memoryStore } from "@/lib/memory-store.ts";
import {
	getThemePreference,
	onThemePreferenceChange,
} from "@/lib/theme-preference.ts";
import { KeyboardListener } from "@/lib/utils.ts";
import { type Root, createRoot } from "react-dom/client";
// @ts-expect-error typescript does not know ?inline imports
import styles from "../globals.css?inline";
import { MainSearchView } from "../views/MainSearchView.tsx";
import { type EvilbobConfig, getConfig } from "./config.ts";
import { loadEnabledPlugins } from "./plugins-frontend.ts";

export type HTMLEvilbobRoot = HTMLElement & { instance: EvilbobRoot };

export class EvilbobRoot {
	public mainRoot: Root | undefined;
	public pluginViewRoot: Root | undefined = undefined;

	private constructor(
		public readonly pluginViewElement: HTMLDivElement,
		public readonly mainElement: HTMLDivElement,
		public readonly shadowRoot: ShadowRoot,
		public readonly rootElement: HTMLElement,
		public readonly dialogElement: HTMLDialogElement,
	) {}

	static instance(target?: HTMLElement) {
		const existingRoot =
			document.querySelector<HTMLEvilbobRoot>("evilbob-root");
		if (existingRoot) {
			return existingRoot.instance;
		}
		const rootElement = document.createElement(
			"evilbob-root",
		) as HTMLEvilbobRoot;
		const shadowRoot = EvilbobRoot.createShadowRoot(rootElement);

		const mainElement = EvilbobRoot.createMainElement();
		const pluginViewElement = EvilbobRoot.createPluginViewElement();

		const dialogElement = EvilbobRoot.createDialogElement();
		dialogElement.appendChild(mainElement);
		dialogElement.appendChild(pluginViewElement);
		shadowRoot.appendChild(dialogElement);

		(target || document.body).appendChild(rootElement);

		shadowRoot.addEventListener("keydown", (e) => {
			if (dialogElement.open) {
				e.stopPropagation();
			}
		});
		shadowRoot.addEventListener("keyup", (e) => {
			if (dialogElement.open) {
				e.stopPropagation();
			}
		});

		// !! do not add async. Breaks in firefox sendResponse, will always be undefined
		chrome.runtime.onMessage.addListener((message) => {
			const event = message.event;
			const data = message.data;
			if (event === "background-error") {
				try {
					toast(
						<>
							<span>An error occurred.</span>
							<pre>{JSON.stringify(data, null, 4)}</pre>
						</>,
					);
				} catch {
					toast("An error occurred.");
				}
			}
		});

		memoryStore.subscribe("config", (config) => {
			if (!config) {
				return;
			}
			const listener = new KeyboardListener([
				EvilbobRoot.instance().shadowRoot,
			]);
			listener.register(config.keybindings.closePluginView.keys, () => {
				EvilbobRoot.instance().unmountPluginView();
				memoryStore.set("search", "");
			});
			listener.register(config.keybindings.openActions.keys, () => {
				memoryStore.set("isActionsOpen", true);
			});
		});

		memoryStore.subscribe("isFullscreen", (isFullscreen) => {
			EvilbobRoot.instance().fullscreen(isFullscreen);
		});

		memoryStore.subscribe("isActionsOpen", (isActionsOpen) => {
			// update plugin view focus. Is there a better way ?
			if (!isActionsOpen) {
				EvilbobRoot.instance().renderMainView();
				const PluginView = memoryStore.get("PluginView");
				if (PluginView) {
					EvilbobRoot.instance().pluginViewRoot?.render(
						<PluginView></PluginView>,
					);
				}
			}
		});

		memoryStore.subscribe("PluginView", (PluginView) => {
			if (!PluginView) {
				return;
			}
			const instance = EvilbobRoot.instance();
			if (!instance.pluginViewRoot) {
				instance.pluginViewRoot = createRoot(
					instance.pluginViewElement,
				);
			}
			instance.mainElement.classList.add("!h-auto");
			instance.pluginViewElement.classList.add("!h-full");

			instance.pluginViewRoot?.render(<PluginView></PluginView>);
		});

		rootElement.instance = new EvilbobRoot(
			pluginViewElement,
			mainElement,
			shadowRoot,
			rootElement,
			dialogElement,
		);
		return rootElement.instance;
	}

	private static createShadowRoot(root: HTMLElement) {
		const shadow = root.attachShadow({ mode: "open" });

		// https://bugzilla.mozilla.org/show_bug.cgi?id=1827104
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1766909
		// cannot use [sheet] syntax. This would an array in a sandboxed context which is disallowed and breaks.
		// also shadow.adoptedStyleSheets.push() throws shadow.adoptedStyleSheets.push is not a function.
		// have to use a stylesheet
		const style = document.createElement("style");
		style.textContent = styles;
		shadow.appendChild(style);

		// window or document mouseover event does not seem to trigger consistent when a dialog opens from a shadow root
		// it does trigger consistent on the shadow root
		shadow.addEventListener("mouseover", (e) => {
			window.dispatchEvent(
				new CustomEvent("evilbob-mouse-over", { detail: e }),
			);
		});

		return shadow;
	}

	private static createMainElement() {
		const searchDiv = document.createElement("div");
		searchDiv.id = "dialog-main";
		searchDiv.className = "overflow-hidden h-full flex flex-col shrink-0";
		return searchDiv;
	}

	private static createPluginViewElement() {
		const viewDiv = document.createElement("div");
		viewDiv.id = "dialog-view";
		viewDiv.className = "overflow-hidden h-auto flex flex-col";
		return viewDiv;
	}

	private static createDialogElement() {
		const dialog = document.createElement("dialog");
		dialog.setAttribute("data-testid", "evilbob-dialog");
		dialog.className =
			"relative max-w-full max-h-full m-0 backdrop:bg-black backdrop:opacity-40 p-3 outline-none border-solid border-fg-weakest border bg-bg text-fg font-main rounded-lg m-auto overflow-hidden flex-col";

		dialog.addEventListener("close", () => {
			dialog.classList.remove("flex");
			EvilbobRoot.instance().dialogElement.classList.add("!hidden");
			EvilbobRoot.instance().mainRoot?.unmount();
			EvilbobRoot.instance().pluginViewRoot?.unmount();
			EvilbobRoot.instance().mainRoot = undefined;
			EvilbobRoot.instance().pluginViewRoot = undefined;
		});

		dialog.addEventListener("close", async () => {
			document.body.style.overflow = "auto";
		});

		if (getThemePreference() === "dark") {
			dialog.classList.add("dark");
		}

		onThemePreferenceChange((preference) => {
			if (preference === "dark") {
				dialog.classList.add("dark");
			} else {
				dialog.classList.remove("dark");
			}
		});

		return dialog;
	}

	public renderMainView() {
		this.mainRoot?.render(<MainSearchView></MainSearchView>);
	}

	public async openDialog(config: EvilbobConfig) {
		if (!memoryStore.get("plugins")) {
			memoryStore.set("plugins", await loadEnabledPlugins());
		}
		if (!memoryStore.get("config")) {
			memoryStore.set("config", await getConfig());
		}

		this.dialogElement.style.height = `${Math.min(
			config.dimensions.height,
			window.innerHeight,
		)}px`;
		this.dialogElement.style.width = `${Math.min(config.dimensions.width, window.innerWidth)}px`;

		if (!this.mainRoot) {
			this.mainRoot = createRoot(this.mainElement);
		}
		this.renderMainView();

		const PluginView = memoryStore.get("PluginView");
		if (PluginView) {
			this.pluginViewRoot = createRoot(this.pluginViewElement);
			this.pluginViewRoot.render(<PluginView></PluginView>);
		}

		document.body.style.overflow = "hidden";
		this.dialogElement.classList.add("flex");
		EvilbobRoot.instance().dialogElement.classList.remove("!hidden");
		this.dialogElement.showModal();
	}

	public remove() {
		this.mainRoot?.unmount();
		this.rootElement.remove();
	}

	public unmountPluginView() {
		this.mainElement.classList.remove("!h-auto");
		this.pluginViewElement.classList.remove("!h-full");
		this.pluginViewRoot?.unmount();
		this.pluginViewRoot = undefined;
		memoryStore.set("PluginView", undefined);
		memoryStore.set("pluginViewCommand", undefined);
		memoryStore.set("actions", undefined);
		window.dispatchEvent(new CustomEvent("evilbob-unmount-plugin-view"));
	}

	public fullscreen(isFullscreen: boolean) {
		if (isFullscreen) {
			this.dialogElement.classList.add(
				"!h-full",
				"!w-full",
				"!m-0",
				"!rounded-none",
			);
		} else {
			this.dialogElement.classList.remove(
				"!h-full",
				"!w-full",
				"!m-0",
				"!rounded-none",
			);
		}
	}
}
