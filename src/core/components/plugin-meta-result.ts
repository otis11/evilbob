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
				await disablePlugin(this.plugin);
				this.enabled = false;
				this.rootEl?.classList.remove("plugin-active");
			} else {
				await enablePlugin(this.plugin);
				this.enabled = true;
				this.rootEl?.classList.add("plugin-active");
			}
		});

		if (this.enabled) {
			this.rootEl?.classList.add("plugin-active");
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
