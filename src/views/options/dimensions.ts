import { FlexContainer } from "../../components/flex-container";
import { GroupHeading } from "../../components/group-heading";
import { NumberInput } from "../../components/number-input";
import { type BobConfig, updateConfig } from "../../config";
import { t } from "../../locales/locales";

export async function renderBobDimensions(config: BobConfig) {
	const container = FlexContainer({ flexDirection: "column" });
	container.append(GroupHeading(t("Window Dimensions")));

	const [labelWidth, inputWidth] = NumberInput({
		value: config.dimensions.width.toString(),
		label: t("Width"),
	});
	const [labelHeight, inputHeight] = NumberInput({
		value: config.dimensions.height.toString(),
		label: t("Height"),
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

	container.append(labelWidth, labelHeight);
	document.body.append(container);
}
