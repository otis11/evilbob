import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin";

export default defineBobPlugin({
	name() {
		return "Focus Input";
	},
	onBobWindowFocus(state) {
		focusActiveInput(state);
	},
	onBobWindowOpen(state) {
		focusActiveInput(state);
	},
});

function focusActiveInput(state: BobWindowState) {
	(state.isOptionsVisible ? state.optionsInput : state.input).focus();
}
