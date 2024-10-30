import { defineBobPlugin } from "../../core/BobPlugin";
import { iconBob } from "../../core/icons";

export default defineBobPlugin({
	name() {
		return "Bob dark theme";
	},
	async provideTheme() {
		return await import("./dark.css");
	},
	icon: iconBob,
});
