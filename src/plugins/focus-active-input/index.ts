import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin";

export default defineBobPlugin({
	name() {
		return "Focus active search field";
	},
	description() {
		return "When opening/switching to the bob command palette, focus the active search field to directly type into it.";
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
