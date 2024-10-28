import { defineBobPlugin } from "../../core/BobPlugin";

export default defineBobPlugin({
	name() {
		return "Bob dark theme";
	},
	async provideTheme() {
		return await import("./dark.css");
	},
});
