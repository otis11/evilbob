import { defineBobPlugin } from "../../core/BobPlugin";

export default defineBobPlugin({
	name: () => "Clear search on window focus",
	description() {
		return "Clears the search field when focusing/opening bob.";
	},
	onBobWindowFocus(state) {
		state.input.value = "";
	},
});
