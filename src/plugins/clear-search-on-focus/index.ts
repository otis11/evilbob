import { defineBobPlugin } from "../../core/BobPlugin";

export default defineBobPlugin({
	name: () => "Clear search on window focus",
	onBobWindowFocus(state) {
		state.input.value = "";
	},
});
