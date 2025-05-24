import { toast } from "@/components/Toast.tsx";
import {
    VList,
    VListItem,
    VListItemIcon, VListItemText,
    VListItemTitle,
} from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { copyTextToClipboard } from "@/lib/utils.ts";
import type { Color } from "@/plugins/colors/components/edit-color.tsx";
import {PaletteIcon, PipetteIcon} from "lucide-react";
import {getAllColorsInDocument, saveColor} from "@/plugins/colors/lib.ts";
import type {WebsiteColor} from "@/plugins/colors/website-colors.tsx";

export async function AdditionalSearchItems() {
	let { colors } = (await browserApi.storage.sync.get(["colors"])) as {
		colors: Color[];
	};
	if (!colors) {
		colors = [];
	}
    const websiteColors = getAllColorsInDocument()
	return [...colors.map((item) => ({
		search: item.title + item.c,
		content: (
			<VListItem
				data-testid={`colors-${item.title}`}
				data={item}
				key={item.title}
				onClick={() => {
					copyTextToClipboard(item.c);
					toast("Copied.");
				}}
			>
				<VListItemIcon>
					<PaletteIcon></PaletteIcon>
				</VListItemIcon>
				<VListItemTitle>{item.title}</VListItemTitle>
				<div
					className="w-full h-full border border-solid border-foreground rounded-sm"
					style={{ backgroundColor: item.c }}
				></div>
			</VListItem>
		),
	})), ...websiteColors.map((item) => ({
        search: item.c,
        content: (
            <VListItem
                data-testid={`website-colors-${item.c}`}
                data={item}
                key={"websiteColor" + item.c}
                onClick={() => {
                    copyTextToClipboard(item.c);
                    toast("Copied.");
                }}
            >
                <VListItemIcon>
                    <PipetteIcon></PipetteIcon>
                </VListItemIcon>
                <VListItemTitle>{item.c}</VListItemTitle>
                <VListItemText>{item.count}</VListItemText>
                <div
                    className="w-full h-full border border-solid border-foreground rounded-sm"
                    style={{ backgroundColor: item.c }}
                ></div>
            </VListItem>
        ),
    }))];
}
