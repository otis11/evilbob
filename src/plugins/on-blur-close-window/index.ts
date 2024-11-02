import { defineBobPlugin } from "../../core/BobPlugin";

export default defineBobPlugin({
	name() {
		return "On bob leave close window";
	},
	description() {
		return "When leaving the bob command palette, for instance focusing another window, fully close the command palette window.";
	},
	onBobWindowBlur(state) {
		state.win.close();
	},
});
