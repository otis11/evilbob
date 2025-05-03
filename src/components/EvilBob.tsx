import {
	getThemePreference,
	onThemePreferenceChange,
} from "@/lib/theme-preference.ts";
import { KeyboardListener } from "@/lib/utils.ts";
import type {
	PluginCommandExtended,
	PluginCommandImported,
	PluginViewProps,
} from "@/plugins";
import type { Plugin } from "@/plugins";
import type { FunctionComponent, JSX } from "react";
import { type Root, createRoot } from "react-dom/client";
// @ts-expect-error typescript does not know ?inline imports
import styles from "../globals.css?inline";
import { type EvilBobConfig, getConfig } from "../lib/config.ts";
import { loadEnabledPlugins } from "../lib/plugins-frontend.ts";
import { MainSearchView } from "../views/MainSearchView.tsx";

interface OpenDialogProps {
	height: number;
	width: number;
}

export interface ShowInputProps {
	type: "text" | "color";
	title: string;
}

export class EvilBob {
	static internalInstance: EvilBob | undefined;
	public mainRoot: Root | undefined;

	public pluginViewRoot: Root | undefined = undefined;
	public PluginView: FunctionComponent<PluginViewProps> | undefined =
		undefined;
	private pluginActions: JSX.Element | undefined;
	public pluginViewProps: PluginViewProps | undefined;
	public plugins: Plugin[] | undefined;
	public pluginViewCommand: PluginCommandExtended | undefined;
	// biome-ignore lint/suspicious/noExplicitAny: They can be any.
	private activeVListItemProps: any;

	private constructor(
		public readonly pluginViewElement: HTMLDivElement,
		public readonly mainElement: HTMLDivElement,
		public readonly shadowRoot: ShadowRoot,
		public readonly rootElement: HTMLElement,
		public readonly dialogElement: HTMLDialogElement,
	) {
		getConfig().then((config: EvilBobConfig) => {
			const listener = new KeyboardListener(
				EvilBob.instance().shadowRoot,
			);
			listener.register(config.keybindings.closePluginView.keys, () => {
				this.unmountPluginView();
			});
			listener.register(config.keybindings.openActions.keys, () => {
				this.renderMainView();
				window.dispatchEvent(new CustomEvent("evil-bob-open-actions"));
			});
		});
	}

	static instance(target?: HTMLElement) {
		if (!EvilBob.internalInstance) {
			const rootElement = document.createElement("evil-bob");
			const shadowRoot = EvilBob.createShadowRoot(rootElement);

			const mainElement = EvilBob.createMainElement();
			const pluginViewElement = EvilBob.createPluginViewElement();

			const dialogElement = EvilBob.createDialogElement();
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

			EvilBob.internalInstance = new EvilBob(
				pluginViewElement,
				mainElement,
				shadowRoot,
				rootElement,
				dialogElement,
			);
		}

		return EvilBob.internalInstance;
	}

	private static createShadowRoot(root: HTMLElement) {
		const shadow = root.attachShadow({ mode: "open" });

		const sheet = new CSSStyleSheet();
		sheet.replaceSync(styles);
		shadow.adoptedStyleSheets = [sheet];

		// window or document mouseover event does not seem to trigger consistent when a dialog opens from a shadow root
		// it does trigger consistent on the shadow root
		shadow.addEventListener("mouseover", (e) => {
			window.dispatchEvent(
				new CustomEvent("evil-bob-mouse-over", { detail: e }),
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
		dialog.className =
			"relative max-w-full max-h-full m-0 backdrop:bg-black backdrop:opacity-40 p-3 outline-none border-solid border-fg-weakest border bg-bg text-fg font-main rounded-lg m-auto overflow-hidden flex-col";

		dialog.addEventListener("close", () => {
			dialog.classList.remove("flex");
			EvilBob.instance().dialogElement.classList.add("!hidden");
			EvilBob.instance().mainRoot?.unmount();
			EvilBob.instance().pluginViewRoot?.unmount();
			EvilBob.instance().mainRoot = undefined;
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
		this.mainRoot?.render(
			<MainSearchView
				actions={
					this.activeVListItemProps?.Actions || this.pluginActions
				}
				plugins={this.plugins || []}
				pluginView={this.pluginViewCommand}
				onBack={this.unmountPluginView.bind(this)}
			></MainSearchView>,
		);
	}

	public async openDialog(config: EvilBobConfig) {
		if (!this.plugins) {
			this.plugins = await loadEnabledPlugins();
		}

		const maxHeightOffset = 100;
		const maxWidthOffset = 100;
		this.dialogElement.style.height = `${Math.min(
			config.dimensions.height,
			window.innerHeight - maxHeightOffset,
		)}px`;
		this.dialogElement.style.width = `${Math.min(config.dimensions.width, window.innerWidth - maxWidthOffset)}px`;

		if (!this.mainRoot) {
			this.mainRoot = createRoot(this.mainElement);
		}
		this.renderMainView();

		if (this.PluginView && this.pluginViewProps) {
			this.pluginViewRoot = createRoot(this.pluginViewElement);
			this.pluginViewRoot.render(
				<this.PluginView {...this.pluginViewProps}></this.PluginView>,
			);
		}

		document.body.style.overflow = "hidden";
		this.dialogElement.classList.add("flex");
		EvilBob.instance().dialogElement.classList.remove("!hidden");
		this.dialogElement.showModal();
	}

	public remove() {
		this.mainRoot?.unmount();
		this.rootElement.remove();
	}

	setPluginActions(newActions: JSX.Element) {
		this.pluginActions = newActions;
	}

	// biome-ignore lint/suspicious/noExplicitAny: Can be any
	public setActiveVListItemProps(data: any) {
		this.activeVListItemProps = data;
	}

	public unmountPluginView() {
		this.mainElement.classList.remove("!h-auto");
		this.pluginViewElement.classList.remove("!h-full");
		this.pluginViewRoot?.unmount();
		this.pluginViewRoot = undefined;
		this.PluginView = undefined;
		this.pluginViewRoot = undefined;
		this.pluginViewCommand = undefined;
		this.pluginActions = undefined;
		this.activeVListItemProps = undefined;
		this.renderMainView();
		window.dispatchEvent(new CustomEvent("evil-bob-unmount-plugin-view"));
	}

	private _rerenderPluginView() {
		if (this.PluginView && this.pluginViewProps) {
			this.pluginViewRoot?.render(
				<this.PluginView {...this.pluginViewProps}></this.PluginView>,
			);
		}
	}

	/**
	 * To render a view conditional we need a second root node as react has specific rules for hooks:
	 * Do not call Hooks inside conditions or loops.
	 * @param command
	 * @param imported
	 * @param props
	 */
	public renderPluginCommand(
		command: PluginCommandExtended,
		imported: PluginCommandImported,
		props?: PluginViewProps,
	) {
		this.pluginViewCommand = command;
		this.PluginView = imported.Command as FunctionComponent | undefined;
		if (props) {
			this.pluginViewProps = props;
		}
		if (!this.pluginViewProps) {
			this.pluginViewProps = {
				search: "",
			};
		}
		if (!this.pluginViewRoot) {
			this.pluginViewRoot = createRoot(this.pluginViewElement);
		}
		this.mainElement.classList.add("!h-auto");
		this.pluginViewElement.classList.add("!h-full");

		this.renderMainView();
		this._rerenderPluginView();
	}

	updatePluginView(props: PluginViewProps) {
		this.pluginViewProps = props;
		this._rerenderPluginView();
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
