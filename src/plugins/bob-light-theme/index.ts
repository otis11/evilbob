import { defineBobPlugin } from "../../core/BobPlugin";
import { iconBob } from "../../core/icons";

export default defineBobPlugin({
	name() {
		return "Bob light theme";
	},
	async provideTheme() {
		return await import("./light.css");
	},
	icon: iconBob,
});
