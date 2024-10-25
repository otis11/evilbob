import { FlexContainer } from "../../components/flex-container";
import { GroupHeading } from "../../components/group-heading";
import { NumberInput } from "../../components/number-input";
import { type BobConfig, updateConfig } from "../../config";

export async function renderBobDimensions(config: BobConfig) {
	const container = FlexContainer({ flexDirection: "column" });
	container.append(GroupHeading("Window Dimensions"));

	const [labelWidth, inputWidth] = NumberInput({
		value: config.dimensions.width.toString(),
		label: "Width",
	});
	const [labelHeight, inputHeight] = NumberInput({
		value: config.dimensions.height.toString(),
		label: "Height",
	});

	inputWidth.addEventListener("input", () => {
		updateConfig({
			dimensions: {
				width: Number.parseInt(inputWidth.value),
				height: Number.parseInt(inputHeight.value),
			},
		});
	});

	inputHeight.addEventListener("input", () => {
		updateConfig({
			dimensions: {
				width: Number.parseInt(inputWidth.value),
				height: Number.parseInt(inputHeight.value),
			},
		});
	});

	labelHeight.style.marginBottom = "8px";
	labelWidth.style.marginBottom = "8px";
	container.append(labelWidth, labelHeight);
	document.body.append(container);
}
