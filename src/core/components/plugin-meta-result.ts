import type { BobWindowState } from "../BobPlugin";
import { iconFromString } from "../icons";
import type { BobPluginMeta } from "../plugin-list";
import { disablePlugin, enablePlugin } from "../plugins";
import { Result } from "./result/result";
import type { Tag } from "./tags/tags";

export class PluginMetaResult extends Result {
	constructor(
		private plugin: BobPluginMeta,
		private enabled = false,
	) {
		super();
	}

	async execute(state: BobWindowState): Promise<void> {}

	protected afterElementCreation(): void {
		this.rootEl?.addEventListener("click", async () => {
			if (this.enabled) {
				if (await disablePlugin(this.plugin)) {
					this.enabled = false;
					this.rootEl?.classList.remove("plugin-active");
				} else {
					alert("Plugin could not be disabled.");
				}
			} else {
				if (await enablePlugin(this.plugin)) {
					this.enabled = true;
					this.rootEl?.classList.add("plugin-active");
				} else {
					alert("Plugin could not be enabled.");
				}
			}
		});

		if (this.enabled) {
			this.rootEl?.classList.add("plugin-active");
		}

		if (!this.plugin.canBeDisabled) {
			this.rootEl?.classList.add("plugin-cant-disable");
		}
	}

	tags(): Tag[] {
		const tags: Tag[] = [];
		if (this.plugin.providesTheme) {
			tags.push({ text: "Theme" });
		}
		if (this.plugin.providesResults) {
			tags.push({ text: "Results" });
		}

		if (!this.plugin.canBeDisabled) {
			tags.push({ text: "Required", type: "error" });
		}

		return tags;
	}

	public title(): string {
		return this.plugin.name;
	}

	description(): string {
		return this.plugin.description || "";
	}

	prepend(): HTMLElement | undefined {
		return this.plugin.icon ? iconFromString(this.plugin.icon) : undefined;
	}
}
