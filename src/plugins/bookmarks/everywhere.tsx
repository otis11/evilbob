import { toast } from "@/components/Toast.tsx";
import {
    VListItem,
    VListItemIcon,
    VListItemTitle,
} from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import {copyTextToClipboard, getFaviconUrl} from "@/lib/utils.ts";
import type { Color } from "@/plugins/colors/components/edit-color.tsx";
import { PaletteIcon } from "lucide-react";
import {flattenBookmarksTree} from "@/plugins/bookmarks/utils.ts";
import type {BookmarkItem} from "@/plugins/bookmarks/bookmarks.tsx";

export async function AdditionalSearchItems() {
    const tree = await browserApi.bookmarks.getTree()
    const bookmarks = flattenBookmarksTree(tree, [])
    async function onBookmarkClick(item: BookmarkItem) {
        if (item.node.url) {
            await browserApi.tabs.create({ url: item.node.url });
        }
    }
    return bookmarks.map((item) => ({
        search: (item.node.title?.toLowerCase() ||"") + (item.node.url?.toLowerCase() ||""),
        content: (
            <VListItem
                className="flex-col"
                data={item}
                key={item.node.id}
                onClick={() => onBookmarkClick(item)}
            >
						<span className="w-full flex items-center">
							<VListItemIcon
                                url={getFaviconUrl(item.node.url)}
                            ></VListItemIcon>
							<span>{item.node.title}</span>
							<span className="text-muted-foreground ml-auto">
								{item.folders.map((f) => f.title).join("/")}
							</span>
						</span>
                <span className="w-full flex items-center pt-1">
							<span className="text-muted-foreground truncate">
								{item.node.url}
							</span>
						</span>
            </VListItem>
        ),
    }));
}
