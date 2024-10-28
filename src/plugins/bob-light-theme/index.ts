import { defineBobPlugin } from "../../core/BobPlugin";

export default defineBobPlugin({
	name() {
		return "Bob light theme";
	},
	async provideTheme() {
		return await import("./light.css");
	},
});
