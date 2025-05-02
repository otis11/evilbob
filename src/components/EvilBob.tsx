import { KeyboardListener } from "@/lib/utils.ts";
import type { PluginCommandExtended, PluginViewProps } from "@/plugins";
import type { Plugin } from "@/plugins";
import type { FunctionComponent } from "react";
import { type Root, createRoot } from "react-dom/client";
import { type EvilBobConfig, getConfig } from "../config/config.ts";
import { loadEnabledPlugins } from "../config/plugins-frontend.ts";
// @ts-expect-error typescript does not know ?inline imports
import styles from "../theme.css?inline";
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
	public pluginViewProps: PluginViewProps | undefined;
	public plugins: Plugin[] | undefined;
	public pluginViewCommand: PluginCommandExtended | undefined;

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
		viewDiv.className = "overflow-hidden h-auto";
		return viewDiv;
	}

	private static createDialogElement() {
		const dialog = document.createElement("dialog");
		dialog.className =
			"max-w-full max-h-full m-0 backdrop:bg-black backdrop:opacity-40 p-3 outline-none border-solid border-fg-weakest border bg-bg text-fg font-main rounded-lg m-auto overflow-hidden flex flex-col";

		dialog.addEventListener("close", () => {
			EvilBob.instance().dialogElement.classList.add("!hidden");
			EvilBob.instance().mainRoot?.unmount();
			EvilBob.instance().pluginViewRoot?.unmount();
		});

		dialog.addEventListener("close", async () => {
			document.body.style.overflow = "auto";
		});

		return dialog;
	}

	public renderMainView() {
		this.mainRoot?.render(
			<MainSearchView
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

		this.mainRoot = createRoot(this.mainElement);
		this.renderMainView();

		if (this.PluginView && this.pluginViewProps) {
			this.pluginViewRoot = createRoot(this.pluginViewElement);
			this.pluginViewRoot.render(
				<this.PluginView {...this.pluginViewProps}></this.PluginView>,
			);
		}

		document.body.style.overflow = "hidden";
		EvilBob.instance().dialogElement.classList.remove("!hidden");
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
		this.PluginView = undefined;
		this.pluginViewRoot = undefined;
		this.pluginViewCommand = undefined;
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
	 * @param View
	 * @param props
	 */
	public renderPluginView(
		command: PluginCommandExtended,
		View: FunctionComponent<PluginViewProps>,
		props?: PluginViewProps,
	) {
		this.pluginViewCommand = command;
		this.PluginView = View;
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

	async showInput({
		type,
		title,
	}: ShowInputProps): Promise<string | undefined> {
		return new Promise((resolve) => {
			const input = document.createElement("input");
			input.className = "h-full w-full m-0";
			input.type = type;

			window.addEventListener("paste", (e) => {
				const newValue =
					e.clipboardData?.getData("Text") || input.value;
				input.value = newValue;
				label.style.backgroundColor = newValue;
			});

			const label = document.createElement("label");
			label.className =
				"h-full w-full flex flex-col items-center justify-center m-0 p-0";

			const titleElement = document.createElement("div");
			titleElement.className = "text-fg p-1";
			titleElement.innerText = title;
			label.append(titleElement, input);

			if (type === "color") {
				input.className = "hidden";
				input.addEventListener("change", (e) => {
					if (e.target instanceof HTMLInputElement) {
						label.style.backgroundColor = e.target.value;
					}
				});
			}

			const dialog = document.createElement("dialog");
			dialog.addEventListener("close", async () => {
				removeSelf();
				resolve(undefined);
			});

			dialog.addEventListener("keydown", (e) => {
				e.stopPropagation();
				if (e.key === "Enter") {
					removeSelf();
					resolve(input.value);
				}
			});

			dialog.appendChild(label);
			dialog.className =
				"outline-none border-solid border-fg-weakest border h-12 w-96 flex items-center justify-center backdrop:bg-black backdrop:opacity-40 m-auto";

			function removeSelf() {
				dialog.remove();
			}

			this.shadowRoot.appendChild(dialog);
			dialog.showModal();
		});
	}
}
