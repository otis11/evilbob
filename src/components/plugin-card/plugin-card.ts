import type { BobConfig } from "../../config";
import { disablePlugin, enablePlugin } from "../../plugins";
import type { Plugin } from "../../plugins/Plugin";
import "./plugin-card.css";

export function PluginCard(plugin: Plugin, config: BobConfig) {
	const container = document.createElement("div");
	container.classList.add("result-plugin-card");

	const label = document.createElement("label");
	label.classList.add("result-plugin-title");

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = !!config.plugins[plugin.id()]?.enabled;
	checkbox.addEventListener("change", async () => {
		if (checkbox.checked) {
			enablePlugin(plugin);
		} else {
			disablePlugin(plugin);
		}
	});
	const labelText = document.createElement("span");
	labelText.innerText = plugin.name();
	label.append(checkbox, labelText);
	const description = document.createElement("div");
	description.classList.add("result-plugin-description");
	description.innerText = plugin.description();
	container.append(label, description);

	return container;
}
