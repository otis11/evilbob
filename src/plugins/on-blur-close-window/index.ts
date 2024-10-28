import { defineBobPlugin } from "../../core/BobPlugin";

export default defineBobPlugin({
	name() {
		return "On blur close bob window";
	},
	onBobWindowBlur(state) {
		state.win.close();
	},
});
