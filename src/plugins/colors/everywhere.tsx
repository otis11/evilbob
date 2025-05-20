import { toast } from "@/components/Toast.tsx";
import {
	VListItem,
	VListItemIcon,
	VListItemTitle,
} from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { copyTextToClipboard } from "@/lib/utils.ts";
import type { Color } from "@/plugins/colors/components/edit-color.tsx";
import { PaletteIcon } from "lucide-react";

export async function AdditionalSearchItems() {
	const { colors } = (await browserApi.storage.sync.get(["colors"])) as {
		colors: Color[];
	};
	if (!colors) {
		return [];
	}
	return colors.map((item) => ({
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
					className="w-full h-full"
					style={{ backgroundColor: item.c }}
				></div>
			</VListItem>
		),
	}));
}
